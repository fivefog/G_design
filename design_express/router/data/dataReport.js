//数据报表
const express = require('express')
const query = require('../../db/mysql')
const { formatData } = require('../../utils/index')
const axios = require('axios')

const router = express.Router()

//获取疫情地图数据
router.get('/map', async(req, res) => {

    try {
        let { data: { data } } = await axios.get('https://interface.sina.cn/news/wap/fymap2020_data.d.json?_=1580892522427')
            // console.log(data.list)
        let list = data.list.map(item => ({
                name: item.name,
                value: item.value
            }))
            // console.log(list)

        res.send(formatData({ data: list }))

    } catch (error) {
        res.send(formatData({ status: 0 }))
    }
})

//计算总数
router.get('/total', async(req, res) => {

    //管理员总数
    let sql = `select count(*) as total from staffusers where role='管理员'`

    //售货员员总数 
    let sql1 = `select count(*) as total from staffusers where role='售货员'`

    //会员总数    
    let sql2 = `select count(*) as total from vipusers`

    // 供应商总数
    let sql3 = `select count(*) as total from supplier`

    //进货总金额
    let sql4 = `select sum(e_totolprice) as totolprice from enterstock`

    //出货总金额
    let sql5 = `select sum(o_totolprice) as totolprice from outstock`

    //退货总金额
    let sql6 = `select sum(r_totolprice) as totolprice from returngoods`

    //销售总金额
    let sql7 = `select sum(s_totolprice) as totolprice from sale`
    try {
        let result = await query(sql)
        let result1 = await query(sql1)
        let result2 = await query(sql2)
        let result3 = await query(sql3)
        let result4 = await query(sql4)
        let result5 = await query(sql5)
        let result6 = await query(sql6)
        let result7 = await query(sql7)

        // result = [...result, ...result1, ...result2, ...result3, ...result4, ...result5, ...result6, ...result7]
        result = [result[0].total, result1[0].total, result2[0].total, result3[0].total, result4[0].totolprice, result5[0].totolprice, result6[0].totolprice, result7[0].totolprice, ]
            // result = {...result[0], ...result[1], ...result[2], ...result[3], ...result[4], ...result[5], ...result[6], ...result[7] }

        if (result[4] === null) {
            result[4] = 0
        }
        if (result[5] === null) {
            result[5] = 0
        }
        if (result[6] === null) {
            result[6] = 0
        }
        if (result[7] === null) {
            result[7] = 0
        }

        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

//计算倒退6天到当前时间的日期的总数
router.get('/:datetime', async(req, res) => {
    let { datetime } = req.params

    //管理员总数
    let sql = `select count(*) as adminTotal from staffusers where role='管理员' and createtime like '%${datetime}%'`

    //售货员员总数 
    let sql1 = `select count(*) as salesmanTotal from staffusers where role='售货员' and createtime like '%${datetime}%'`

    //会员总数    
    let sql2 = `select count(*) as vipTotal from vipusers where createtime like '%${datetime}%'`

    // 供应商总数
    let sql3 = `select count(*) as supplierTotal from supplier where createtime like '%${datetime}%'`

    //进货总金额
    let sql4 = `select sum(e_totolprice) as e_totolprice from enterstock where e_datetime like '%${datetime}%'`

    //出货总金额
    let sql5 = `select sum(o_totolprice) as o_totolprice from outstock where o_datetime like '%${datetime}%'`

    //退货总金额
    let sql6 = `select sum(r_totolprice) as r_totolprice from returngoods where r_datetime like '%${datetime}%'`

    //销售总金额
    let sql7 = `select sum(s_totolprice) as s_totolprice from sale where s_datetime like '%${datetime}%'`
    try {
        let result = await query(sql)
        let result1 = await query(sql1)
        let result2 = await query(sql2)
        let result3 = await query(sql3)
        let result4 = await query(sql4)
        let result5 = await query(sql5)
        let result6 = await query(sql6)
        let result7 = await query(sql7)

        result = [...result, ...result1, ...result2, ...result3, ...result4, ...result5, ...result6, ...result7]
        result = {...result[0], ...result[1], ...result[2], ...result[3], ...result[4], ...result[5], ...result[6], ...result[7] }

        if (result.e_totolprice === null) {
            result.e_totolprice = 0
        }
        if (result.o_totolprice === null) {
            result.o_totolprice = 0
        }
        if (result.r_totolprice === null) {
            result.r_totolprice = 0
        }
        if (result.s_totolprice === null) {
            result.s_totolprice = 0
        }

        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

module.exports = router