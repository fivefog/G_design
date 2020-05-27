//上架商品列表
const express = require('express')
const query = require('../../db/mysql')
const { formatData, deleteImg, multDeleteImg } = require('../../utils/index')

const router = express.Router()

//计算某个数据的总数(用来判断数据是否重复)
router.get('/total', async(req, res) => {
    let sql = `select count(*) as total from onshelves where `

    for (let key in req.query) {
        sql += `${key}='${req.query[key]}' and `
    }
    sql = sql.slice(0, -5)
        // console.log(sql)

    try {
        let result = await query(sql)
        res.send(formatData({ data: result[0].total })) //计算总数成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //计算总数失败
    }
})

//根据商品编号计算商品的出货数量、上架数量
router.get('/num/:g_id', async(req, res) => {
    let { g_id } = req.params
    let sql1 = `select sum(o_num) as o_num from outstock where g_id=${g_id} group by g_id`
    let sql2 = `select sum(on_num) as on_num from onshelves where g_id=${g_id} group by g_id`

    try {
        let result1 = await query(sql1)
        let result2 = await query(sql2)
        let result = [...result1, ...result2]
        res.send(formatData({ data: result }))
    } catch (error) {
        res.send(formatData({ status: 0 }))
    }
})

//根据商品编号计算商品的上架数量、下架数量、销售数量
router.get('/allnum/:g_id', async(req, res) => {
    let { g_id } = req.params
    let sql1 = `select sum(on_num) as on_num from onshelves where g_id=${g_id} group by g_id`
    let sql2 = `select sum(down_num) as down_num from downshelves where g_id=${g_id} group by g_id`
    let sql3 = `select sum(s_num) as s_num from sale where g_id=${g_id} group by g_id`

    try {
        let result1 = await query(sql1)
        let result2 = await query(sql2)
        let result3 = await query(sql3)
        let result = [...result1, ...result2, ...result3]

        res.send(formatData({ data: result }))
    } catch (error) {
        res.send(formatData({ status: 0 }))
    }
})

//获取全部分组好的商品编号
router.get('/', async(req, res) => {
    let sql = `select g_id from onshelves group by g_id`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

//查询该商品编号对应的上架商品信息
router.get('/query', async(req, res) => {
    let sql = `select * from onshelves where `
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

//查询该商品编号对应的会员价格
router.get('/queryv_price', async(req, res) => {
    let sql = `select * from onshelves where `
    for (let key in req.query) {
        sql += `${key}='${req.query[key]}' order by vipprice+0 asc`
    }

    try {
        let result = await query(sql)

        let vipPriceData = [] //存放会员价格数据
        result.forEach(item => {
            vipPriceData.push(item.vipprice)
        })

        let vipPriceData1 = vipPriceData.filter((item, index, arr) => {
            // console.log('item:', arr.indexOf(item))
            // console.log('index:', index)
            return arr.indexOf(item) === index
        })

        res.send(formatData({ data: vipPriceData1 })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

//查询该商品编号对应的非会员价格
router.get('/queryprice', async(req, res) => {
    let sql = `select * from onshelves where `
    for (let key in req.query) {
        sql += `${key}='${req.query[key]}' order by price+0 asc`
    }

    try {
        let result = await query(sql)

        let priceData = [] //存放非会员价格数据
        result.forEach(item => {
            priceData.push(item.price)
        })

        let priceData1 = priceData.filter((item, index, arr) => {
            // console.log('item:', arr.indexOf(item))
            // console.log('index:', index)
            return arr.indexOf(item) === index
        })

        res.send(formatData({ data: priceData1 })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

//通过模糊条件查询上架商品、 查询分页和计算总条数
router.get('/:pagenum/:pagesize', async(req, res) => {
    let start = 0 //设置的起始数据为第一条
    let { pagenum, pagesize } = req.params //页码，每页显示的条数

    if (pagenum > 1) { //页码大于1的分页的起始数
        start = (pagenum - 1) * pagesize
    }
    let sql1 = `select * from onshelves where `
    for (let key in req.query) {
        sql1 += `${key} like '%${req.query[key]}%' or `
    }
    sql1 = sql1.slice(0, -3)
    sql1 += `limit ${start},${pagesize}`

    let sql2 = `select count(*) as total  from onshelves where ` //计算总条数
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

//通过id获取上架商品
router.get('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `select * from onshelves where id=${id}`

    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

// 通过id修改上架商品信息
router.patch('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `update onshelves set `

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

//通过id删除上架商品和服务器已上传的图片
router.delete('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `select g_imgurl from onshelves where id=${id}`
    let sql1 = `delete from onshelves where id=${id}`

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

//批量删除上架商品和服务器已上传的图片(多选)
router.delete('/multId/:ids', async(req, res) => {

    let { ids } = req.params
    let sql = `select g_imgurl from onshelves where id in ${ids}`
    let sql1 = `delete from onshelves where id in ${ids}`

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