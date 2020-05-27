//商品列表
const express = require('express')
const query = require('../../db/mysql')
const { formatData } = require('../../utils/index')
const _ = require('lodash')

const router = express.Router()

//通过模糊条件查询商品的未上架数量、上架数量、上架商品剩余数量、下架数量、销售数量、查询分页和计算总条数
router.get('/:pagenum/:pagesize', async(req, res) => {
    let start = 0 //设置的起始数据为第一条
    let { pagenum, pagesize } = req.params //页码，每页显示的条数

    if (pagenum > 1) { //页码大于1的分页的起始数
        start = (pagenum - 1) * pagesize
    }
    let sql = `select MAX(id) as id,sum(o_num) as o_num from outstock group by g_id`
    let sql1 = `select id,g_id,g_name,g_imgurl,g_unit,c_name,o_price from outstock where `
    for (let key in req.query) {
        sql1 += `${key} like '%${req.query[key]}%' or `
    }
    sql1 = sql1.slice(0, -3)
    sql1 += `and id in (select MAX(id) from outstock group by g_id) group by g_id limit ${start},${pagesize}`


    let sql2 = `select g_id,sum(on_num) as on_num from onshelves group by g_id`
    let sql3 = `select g_id,sum(down_num) as down_num from downshelves group by g_id`
    let sql4 = `select g_id,sum(s_num) as s_num from sale group by g_id`

    let sql5 = `select count(*) as total  from outstock where ` //计算总条数
    for (let key in req.query) {
        sql5 += `${key} like '%${req.query[key]}%' or `
    }
    sql5 = sql5.slice(0, -3)
    sql5 += `group by g_id`

    try {
        let result = await query(sql)
        let result1 = await query(sql1)
        let result2 = await query(sql2)
        let result3 = await query(sql3)
        let result4 = await query(sql4)
        let result5 = await query(sql5)

        //获取出货数量
        result.forEach(item1 => {

            result1.forEach(item2 => {
                if (item1.id === item2.id) {
                    item2.o_num = item1.o_num
                }
            });
        });

        result3.forEach(item1 => {

            //计算下架数量与销售数量的总数量
            result4.forEach(item2 => {
                if (item1.g_id === item2.g_id) {
                    item1.num = item1.down_num + item2.s_num
                    item1.s_num = item2.s_num //销售数量

                } else if (item1.s_num === undefined) {
                    item1.num = item1.down_num
                    item1.s_num = 0 //销售数量

                }
                if (item2.down_num === undefined) {
                    item2.num = item2.s_num
                    item2.down_num = 0 //下架数量
                }

                result3 = _.union(result3, result4) //合并
                result3 = _.unionBy(result3, 'g_id') //完全去重
            });
        })

        //计算上架商品剩余数量
        result2.forEach(item1 => {

            if (result3.length > 0) {
                result3.forEach(item2 => {
                    if (item1.g_id === item2.g_id) {
                        item1.r_num = item1.on_num - item2.num //上架商品剩余数量
                        item1.down_num = item2.down_num //下架数量
                        item1.s_num = item2.s_num //销售数量

                    } else if (item1.r_num === undefined) {
                        item1.r_num = item1.on_num //上架商品剩余数量
                        item1.down_num = 0 //下架数量
                        item1.s_num = 0 //销售数量
                    }
                });
            } else {
                result4.forEach(item3 => {
                    if (item1.g_id === item3.g_id) {
                        if (item3.down_num === undefined) {
                            item1.r_num = item1.on_num - item3.s_num //上架商品剩余数量
                            item1.down_num = 0 //下架数量
                            item1.s_num = item3.s_num //销售数量
                        }
                    } else if (item1.r_num === undefined) {
                        item1.r_num = item1.on_num //上架商品剩余数量
                        item1.down_num = 0 //下架数量
                        item1.s_num = 0 //销售数量
                    }
                });
            }

        });

        //计算未上架数量
        result1.forEach(item1 => {

            if (result2.length > 0) {
                result2.forEach(item2 => {
                    if (item1.g_id === item2.g_id) {
                        item1.un_num = item1.o_num - item2.on_num //未上架数量
                        item1.on_num = item2.on_num //上架数量
                        item1.r_num = item2.r_num //上架商品剩余数量
                        item1.down_num = item2.down_num //下架数量
                        item1.s_num = item2.s_num //销售数量

                        if (item2.r_num === undefined) {
                            item1.un_num = item1.o_num - item2.on_num //未上架数量
                            item1.on_num = item2.on_num //上架数量
                            item1.r_num = item2.on_num //上架商品剩余数量
                            item1.down_num = 0 //下架数量
                            item1.s_num = 0 //销售数量

                        } else if (item2.s_num === undefined) {
                            item1.un_num = item1.o_num - item2.on_num //未上架数量
                            item1.on_num = item2.on_num //上架数量
                            item1.r_num = item2.on_num - item2.down_num //上架商品剩余数量
                            item1.down_num = item2.down_num //下架数量
                            item1.s_num = 0 //销售数量
                        }
                    } else if (item1.un_num === undefined) {
                        item1.un_num = item1.o_num //未上架数量
                        item1.on_num = 0 //上架数量
                        item1.r_num = '未上架' //上架商品剩余数量
                        item1.down_num = 0 //下架数量
                        item1.s_num = 0 //销售数量
                    }
                });
            } else {
                item1.un_num = item1.o_num //未上架数量
                item1.on_num = 0 //上架数量
                item1.r_num = '未上架' //上架商品剩余数量
                item1.down_num = 0 //下架数量
                item1.s_num = 0 //销售数量
            }

        });


        if (result5.length > 0) {
            res.send(formatData({ data: [result1, result5.length] }))
        } else {
            res.send(formatData({ status: 0 }))
        }

    } catch (error) {
        res.send(formatData({ status: 0 }))
    }
})

module.exports = router