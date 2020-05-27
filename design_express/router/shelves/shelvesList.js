//货架信息列表
const express = require('express')
const query = require('../../db/mysql')
const { formatData } = require('../../utils/index')

const router = express.Router()

//计算某个数据的总数(用来判断数据是否重复)
router.get('/total/:shelvesid', async (req, res) => {
    console.log(8888);
    
    let { shelvesid } = req.params
    let sql = `select count(*) as alltotal from shelves where shelvesid=${shelvesid}`

    let sql1 = `select count(*) as total from shelves where `
    for (let key in req.query) {
        sql1 += `${key}='${req.query[key]}' and `
    }
    sql1 = sql1.slice(0, -5)

    try {
        let result = await query(sql)
        let result1 = await query(sql1)
        res.send(formatData({ data: [result[0].alltotal, result1[0].total] })) //计算总数成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //计算总数失败
    }
})

//查询货架类别对应的货架信息
router.get('/query', async (req, res) => {
    console.log('查询');
    let sql = `select * from shelves where `;


    for (let key in req.query) {
        sql += `${key}='${req.query[key]}' order by shelvesid asc`
    }

    try {
        let result = await query(sql)
        console.log('result', result)
        res.send(formatData({ data: result })) //查询成功

    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

//获取全部的货架号
router.get('/', async (req, res) => {
    console.log('这是1')
    let sql = `select shelvesid from shelves order by shelvesid asc`
    try {
        let result = await query(sql)
        let data = []
        for (let key of result) {
            data.push(key.shelvesid)
        }

        res.send(formatData({ data })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

//通过模糊条件查询货架信息、查询分页和计算总条数
router.get('/:pagenum/:pagesize', async (req, res) => {
    let start = 0 //设置的起始数据为第一条
    let { pagenum, pagesize } = req.params //页码，每页显示的条数

    if (pagenum > 1) { //页码大于1的分页的起始数
        start = (pagenum - 1) * pagesize
    }

    let sql1 = `select * from shelves where `
    for (let key in req.query) {
        sql1 += `${key} like '%${req.query[key]}%' or `
    }
    sql1 = sql1.slice(0, -3)
    sql1 += `order by shelvesid asc limit ${start},${pagesize}`

    let sql2 = `select count(*) as total  from shelves where ` //计算总条数
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

//获取最大的货架号
router.get('/maxId', async (req, res) => {
    console.log('获取最大货架');
    let sql = `select max(shelvesid) as shelvesid from shelves`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

//通过id获取货架信息
router.get('/:id', async (req, res) => {
    console.log('这是2')

    let { id } = req.params
    let sql = `select * from shelves where id=${id}`

    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

// 通过id修改货架信息
router.patch('/:id', async (req, res) => {
    let { id } = req.params
    let sql = `update shelves set `

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

//通过id删除货架信息
router.delete('/:id', async (req, res) => {
    let { id } = req.params
    let sql = `delete from shelves where id=${id}`
    try {
        await query(sql)
        res.send(formatData()) //删除成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //删除失败
    }
})

//批量删除货架信息(多选)
router.delete('/multId/:ids', async (req, res) => {
    let { ids } = req.params
    let sql = `delete from shelves where id in ${ids}`

    try {
        await query(sql)
        res.send(formatData()) //删除成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //删除失败
    }
})

module.exports = router