//登录页面
const express = require('express')
const query = require('../../db/mysql') //引入连接数据库文件
const { formatData, token } = require('../../utils/index') //引入设置的能提示返回给客户端的状态码等

const router = express.Router()

//通过角色、用户名、密码条件来区分管理员与售货员
router.post('/staff', async(req, res) => {
    let { username, password, role } = req.body
    let sql = `select * from staffusers where username='${username}' and password='${password}' and role='${role}'`;
    try {

        let result = await query(sql)
        if (result.length > 0) { //数据长度大于0才登录成功
            //登录成功创建一个令牌
            let Authorization = token.create(username) //Authorization是传给客户端的token名
            res.send(formatData({ data: [result, Authorization] }))

        } else {
            res.send(formatData({ status: 0 }))

        }
    } catch (error) {
        res.send(formatData({ status: 0 }))
    }
})

//通过角色、用户名、密码条件来区分超级管理员、管理员与售货员
router.post('/vip', async(req, res) => {
    let { username, password, role } = req.body
    let sql = `select * from vipUsers where username='${username}' and password='${password}' and role='${role}'`;
    try {

        let result = await query(sql)
        if (result.length > 0) { //数据长度大于0才登录成功
            //登录成功创建一个令牌
            let Authorization = token.create(username) //Authorization是传给客户端的token名
            res.send(formatData({ data: [result, Authorization] }))

        } else {
            res.send(formatData({ status: 0 }))

        }
    } catch (error) {
        res.send(formatData({ status: 0 }))
    }
})

module.exports = router