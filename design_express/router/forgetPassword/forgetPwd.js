//忘记密码
const express = require('express')
const query = require('../../db/mysql')
const { formatData, sendEmail } = require('../../utils/index')
const router = express.Router()

//通过条件查询超级管理员、管理员、售货员的id
router.get('/querystaff', async(req, res) => {
    let sql = `select *  from staffusers where `
    for (let key in req.query) {
        sql += `${key}='${req.query[key]}' and `
    }
    sql = sql.slice(0, -5)

    try {
        let result = await query(sql)
        if (result.length > 0) {
            res.send(formatData({ data: result[0] })) //成功
        } else {
            res.send(formatData({ status: 0 })) //失败
        }
    } catch (error) {
        res.send(formatData({ status: 0 })) //失败
    }
})

//通过条件查询会员的id
router.get('/queryvip', async(req, res) => {
    let sql = `select * from vipusers where `
    for (let key in req.query) {
        sql += `${key}='${req.query[key]}' and `
    }
    sql = sql.slice(0, -5)

    try {
        let result = await query(sql)
        if (result.length > 0) {
            res.send(formatData({ data: result[0] })) //成功
        } else {
            res.send(formatData({ status: 0 })) //失败
        }
    } catch (error) {
        res.send(formatData({ status: 0 })) //失败
    }
})

//根据邮箱地址发送验证码的邮件
router.post('/sendemail', async(req, res) => {
    let { email, verifynum } = req.body

    try {
        await sendEmail(email, verifynum)
        res.send(formatData()) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

// 通过id修改超级管理员、管理员、售货员信息
router.patch('/staff/:id', async(req, res) => {
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

// 通过id修改会员信息
router.patch('/vip/:id', async(req, res) => {
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

module.exports = router