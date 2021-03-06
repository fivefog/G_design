//商品类别信息列表
const express = require('express')
const query = require('../../db/mysql')
const { formatData } = require('../../utils/index')

const router = express.Router()

//计算某个数据的总数(用来判断数据是否重复)
router.get('/total', async(req, res) => {
    let sql = `select count(*) as total from category where `
    for (let key in req.query) {
        sql += `${key}='${req.query[key]}'`
    }
    // console.log(sql)

    try {
        let result = await query(sql)
        res.send(formatData({ data: result[0].total })) //计算总数成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //计算总数失败
    }
})

//获取全部的商品类别名称
router.get('/', async(req, res) => {
    let sql = `select c_name from category`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

//通过模糊条件查询商品类别信息、查询分页和计算总条数
router.get('/:pagenum/:pagesize', async(req, res) => {
    let start = 0 //设置的起始数据为第一条
    let { pagenum, pagesize } = req.params //页码，每页显示的条数

    if (pagenum > 1) { //页码大于1的分页的起始数
        start = (pagenum - 1) * pagesize
    }

    let sql1 = `select * from category where `
    for (let key in req.query) {
        sql1 += `${key} like '%${req.query[key]}%' or `
    }
    sql1 = sql1.slice(0, -3)
    sql1 += `limit ${start},${pagesize}`

    let sql2 = `select count(*) as total  from category where ` //计算总条数
    for (let key in req.query) {
        sql2 += `${key} like '%${req.query[key]}%' or `
    }

    sql2 = sql2.slice(0, -4)

    try {
        let result1 = await query(sql1)
        let result2 = await query(sql2)

        if (result2[0].total !== 0) {
            res.send(formatData({ data: [result1, result2[0].total] })) //查询成功
        } else {
            res.send(formatData({ status: 0 }))
        }
    } catch (error) {
        res.send(formatData({ status: 0 }))
    }
})

//通过id获取商品类别信息
router.get('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `select * from category where id=${id}`

    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

// 通过id修改商品类别信息
router.patch('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `update category set `

    for (let key in req.body) {
        sql += `${key}='${req.body[key]}',`
    }
    sql = sql.replace(/,$/, ` where id=${id}`)

    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //修改成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //修改失败
    }
})

//通过id删除商品类别信息
router.delete('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `delete from category where id=${id}`
    try {
        await query(sql)
        res.send(formatData()) //删除成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //删除失败
    }
})

//批量删除商品类别信息(多选)
router.delete('/multId/:ids', async(req, res) => {
    let { ids } = req.params
    let sql = `delete from category where id in ${ids}`

    try {
        await query(sql)
        res.send(formatData()) //删除成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //删除失败
    }
})

module.exports = router