// 个人信息修改
const express = require('express')
const query = require('../../db/mysql')
const { formatData } = require('../../utils/index')
const router = express.Router()

// 通过id修改个人信息
router.patch('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `update staffusers set `

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

//计算名员工号总数(用来判断员工号是否存在)
router.get('/s_idTotal', async(req, res) => {
    let { s_id } = req.query
    let sql = `select count(*) as total from staffusers where s_id=${s_id}`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result[0].total })) //计算员工号总数成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //计算员工号总数失败
    }
})

//计算用户名总数(用来判断用户名是否重复)
router.get('/usernameTotal', async(req, res) => {
    let { username, role } = req.query
    let sql = `select count(*) as total from staffusers where username='${username}' and role='${role}'`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result[0].total })) //计算用户名总数成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //计算用户名总数失败
    }
})

//计算手机号总数(用来判断手机号是否重复)
router.get('/phoneTotal', async(req, res) => {
    let { phone } = req.query
    let sql = `select count(*) as total from staffusers where phone='${phone}'`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result[0].total })) //计算手机号总数成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //计算手机号总数失败
    }
})

//计算邮箱地址总数(用来判断邮箱地址是否重复)
router.get('/emailTotal', async(req, res) => {
    let { email } = req.query
    let sql = `select count(*) as total from staffusers where email='${email}'`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result[0].total })) //计算邮箱地址总数成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //计算邮箱地址总数失败
    }
})
module.exports = router