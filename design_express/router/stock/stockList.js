//库存信息列表
const express = require('express')
const query = require('../../db/mysql')
const { formatData } = require('../../utils/index')

const router = express.Router()

//根据商品编号计算商品的进货数量、出库数量
router.get('/:g_id', async(req, res) => {
    let { g_id } = req.params
    let sql1 = `select sum(e_num) as e_num from enterstock where g_id=${g_id} group by g_id`
    let sql2 = `select sum(o_num) as o_num from outstock where g_id=${g_id} group by g_id`

    try {
        let result1 = await query(sql1)
        let result2 = await query(sql2)
        let result = [...result1, ...result2]
        res.send(formatData({ data: result }))
    } catch (error) {
        res.send(formatData({ status: 0 }))
    }
})

//通过模糊条件查询商品的库存数量、查询分页和计算总条数
router.get('/:pagenum/:pagesize', async(req, res) => {
    let start = 0 //设置的起始数据为第一条
    let { pagenum, pagesize } = req.params //页码，每页显示的条数

    if (pagenum > 1) { //页码大于1的分页的起始数
        start = (pagenum - 1) * pagesize
    }
    let sql = `select MAX(id) as id,sum(e_num) as e_num from enterstock group by g_id`
    let sql1 = `select id,g_id,g_name,g_imgurl,g_unit,c_name,stockwaring from enterstock where `
    for (let key in req.query) {
        sql1 += `${key} like '%${req.query[key]}%' or `
    }
    sql1 = sql1.slice(0, -3)
    sql1 += `and id in (select MAX(id) from enterstock group by g_id) group by g_id limit ${start},${pagesize}`

    let sql2 = `select g_id,sum(o_num) as o_num from outstock group by g_id`

    let sql3 = `select count(*) as total  from enterstock where ` //计算总条数
    for (let key in req.query) {
        sql3 += `${key} like '%${req.query[key]}%' or `
    }
    sql3 = sql3.slice(0, -3)
    sql3 += `group by g_id`

    try {
        let result = await query(sql)
        let result1 = await query(sql1)
        let result2 = await query(sql2)
        let result3 = await query(sql3)

        //获取进货数量
        result.forEach(item1 => {

            result1.forEach(item2 => {
                if (item1.id === item2.id) {
                    item2.e_num = item1.e_num
                }
            });
        });

        //计算库存数量
        result1.forEach(item1 => {

            if (result2.length > 0) {
                result2.forEach(item2 => {
                    if (item1.g_id === item2.g_id) {
                        item1.stocknum = item1.e_num - item2.o_num //库存数量
                        item1.o_num = item2.o_num //出货数量
                    } else if (item1.stocknum === undefined) {
                        item1.stocknum = item1.e_num //库存数量
                        item1.o_num = 0 //出货数量
                    }
                });
            } else {
                item1.stocknum = item1.e_num //库存数量
                item1.o_num = 0 //出货数量
            }
            if (item1.stocknum > item1.stockwaring) {
                item1.stockstate = '库存充足'
            } else if (item1.stocknum === 0) {
                item1.stockstate = '无库存'
            } else {
                item1.stockstate = '库存不足'
            }
        })

        if (result3.length > 0) {
            res.send(formatData({ data: [result1, result3.length] }))
        } else {
            res.send(formatData({ status: 0 }))
        }
    } catch (error) {
        res.send(formatData({ status: 0 }))
    }
})

// 通过商品编号修改库存信息
router.patch('/:g_id', async(req, res) => {
    let { g_id } = req.params
    let sql = `update enterstock set `

    for (let key in req.body) {
        sql += `${key}='${req.body[key]}',`
    }
    sql = sql.replace(/,$/, ` where g_id=${g_id}`)

    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //修改成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //修改失败
    }
})

//根据商品编号批量修改信息(多选)
router.patch('/mulG_id/:g_ids', async(req, res) => {
    let { g_ids } = req.params
    let sql = `update enterstock set `

    for (let key in req.body) {
        sql += `${key}='${req.body[key]}',`
    }
    sql = sql.replace(/,$/, ` where g_id in ${g_ids}`)

    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //修改成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //修改失败
    }
})


module.exports = router