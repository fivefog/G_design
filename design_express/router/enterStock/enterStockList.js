//进货信息列表
const express = require('express')
const query = require('../../db/mysql')
const { formatData, deleteImg, multDeleteImg } = require('../../utils/index')

const router = express.Router()

//计算某个数据的总数(用来判断数据是否重复)
router.get('/total', async(req, res) => {
    let sql = `select count(*) as total from enterstock where `
    for (let key in req.query) {
        sql += `${key}='${req.query[key]}' and `
    }
    sql = sql.slice(0, -5)

    try {
        let result = await query(sql)
        res.send(formatData({ data: result[0].total })) //计算总数成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //计算总数失败
    }
})

//查询该商品编号对应的进货信息
router.get('/query', async(req, res) => {
    let sql = `select * from enterstock where `
    for (let key in req.query) {
        sql += `${key}='${req.query[key]}'`
    }

    try {
        let result = await query(sql)
        if (result.length > 0) {
            res.send(formatData({ data: result[0] })) //查询成功
        } else {
            res.send(formatData({ status: 0 }))
        }
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

//查询该商品编号对应的供应商编号
router.get('/querys_id', async(req, res) => {
    let sql = `select * from enterstock where `
    for (let key in req.query) {
        sql += `${key}='${req.query[key]}' order by s_id asc`
    }

    try {
        let result = await query(sql)
        let s_iddata = [] //存放供应商编号数据
        result.forEach(item => {
            s_iddata.push(item.s_id)
        })

        let s_iddata1 = s_iddata.filter((item, index, arr) => {
            // console.log('item:', arr.indexOf(item))
            // console.log('index:', index)
            return arr.indexOf(item) === index
        })

        res.send(formatData({ data: s_iddata1 })) //查询成功

    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

//查询该商品编号对应的商品进价
router.get('/querye_price', async(req, res) => {
    let sql = `select * from enterstock where `
    for (let key in req.query) {
        sql += `${key}='${req.query[key]}' and `
    }
    sql = sql.slice(0, -4)
    sql += 'order by e_price+0 asc'
        // console.log(sql)
    try {
        let result = await query(sql)
        let e_pricedata = [] //存放商品进价数据
        result.forEach(item => {
            e_pricedata.push(item.e_price)
        })

        let e_pricedata1 = e_pricedata.filter((item, index, arr) => {
            return arr.indexOf(item) === index
        })

        res.send(formatData({ data: e_pricedata1 })) //查询成功

    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

//获取全部分组好的商品编号
router.get('/', async(req, res) => {
    let sql = `select g_id from enterstock group by g_id`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

//通过模糊条件查询进货信息、查询分页和计算总条数
router.get('/:pagenum/:pagesize', async(req, res) => {
    let start = 0 //设置的起始数据为第一条
    let { pagenum, pagesize } = req.params //页码，每页显示的条数

    if (pagenum > 1) { //页码大于1的分页的起始数
        start = (pagenum - 1) * pagesize
    }

    let sql1 = `select * from enterstock where `
    for (let key in req.query) {
        sql1 += `${key} like '%${req.query[key]}%' or `
    }
    sql1 = sql1.slice(0, -3)
    sql1 += `limit ${start},${pagesize}`

    let sql2 = `select count(*) as total  from enterstock where ` //计算总条数
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

//通过id获取进货信息
router.get('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `select * from enterstock where id=${id}`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

// 通过id修改进货信息
router.patch('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `update enterstock set `

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

//通过id删除进货信息和服务器已上传的图片
router.delete('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `select g_imgurl from enterstock where id=${id}`
    let sql1 = `delete from enterstock where id=${id}`

    try {
        let result = await query(sql)

        //删除服务器已上传的图片(单张)
        await deleteImg(result)
        await query(sql1)
        res.send(formatData()); //删除成功

    } catch (error) {
        res.send(formatData({ status: 0 })); //删除失败
    }
})

//批量删除进货信息和服务器已上传的图片(多选)
router.delete('/multId/:ids', async(req, res) => {

    let { ids } = req.params
    let sql = `select g_imgurl from enterstock where id in ${ids}`
    let sql1 = `delete from enterstock where id in ${ids}`

    try {
        let result = await query(sql)

        //删除服务器已上传的图片(多张)
        await multDeleteImg(result)
        await query(sql1)
        res.send(formatData()); //删除成功

    } catch (error) {
        return res.send(formatData({ status: 0 })); //删除失败
    }
})

module.exports = router