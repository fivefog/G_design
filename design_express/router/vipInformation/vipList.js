//会员列表
const express = require('express')
const query = require('../../db/mysql')
const { formatData } = require('../../utils/index')
const router = express.Router()

//获取全部的会员编号
router.get('/', async(req, res) => {
    let sql = `select v_id from vipusers order by v_id asc`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

//通过模糊条件查询会员信息、查询分页和计算总条数
router.get('/:pagenum/:pagesize', async(req, res) => {
    let start = 0 //设置的起始数据为第一条
    let { pagenum, pagesize } = req.params //页码，每页显示的条数

    if (pagenum > 1) { //页码大于1的分页的起始数
        start = (pagenum - 1) * pagesize
    }
    let sql1 = `select * from vipusers where (`
    for (let key in req.query) {
        sql1 += `${key} like '%${req.query[key]}%' or `
    }
    sql1 = sql1.slice(0, -4)
    sql1 += `) and role='会员' limit ${start},${pagesize} `

    let sql2 = `select count(*) as total  from vipusers where (` //计算总条数
    for (let key in req.query) {
        sql2 += `${key} like '%${req.query[key]}%' or `
    }
    sql2 = sql2.slice(0, -3)
    sql2 += `) and role='会员'`

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

//计算名会员号总数(用来判断会员号是否重复)
router.get('/v_idTotal', async(req, res) => {
    let { v_id } = req.query
    let sql = `select count(*) as total from vipusers where v_id=${v_id}`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result[0].total })) //计算会员号总数成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //计算会员号总数失败
    }
})

//计算用户名总数(用来判断用户名是否重复)
router.get('/usernameTotal', async(req, res) => {
    let { username, role } = req.query
    let sql = `select count(*) as total from vipusers where username='${username}' and role='${role}'`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result[0].total })) //计算用户名总数成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //计算用户名总数失败
    }
})

//计算邮箱地址总数(用来判断邮箱地址是否重复)
router.get('/emailTotal', async(req, res) => {
    let { email } = req.query
    let sql = `select count(*) as total from vipusers where email='${email}'`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result[0].total })) //计算邮箱地址总数成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //计算邮箱地址总数失败
    }
})

//计算手机号总数(用来判断手机号是否重复)
router.get('/phoneTotal', async(req, res) => {
    let { phone } = req.query
    let sql = `select count(*) as total from vipusers where phone='${phone}'`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result[0].total })) //计算手机号总数成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //计算手机号总数失败
    }
})

//通过id获取会员信息
router.get('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `select * from vipusers where id=${id}`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

// 通过id修改会员信息
router.patch('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `update vipusers set `

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

//通过id删除会员
router.delete('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `delete from vipusers where id=${id}`
    try {
        await query(sql)
        res.send(formatData()) //删除成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //删除失败
    }
})

//批量删除会员(多选)
router.delete('/multId/:ids', async(req, res) => {
    let { ids } = req.params
    let sql = `delete from vipusers where id in ${ids}`

    try {
        await query(sql)
        res.send(formatData()) //删除成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //删除失败
    }
})

module.exports = router