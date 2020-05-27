//登录、注册接口
const express = require('express')
const query = require('../../db/mysql') //引入连接数据库文件
const { formatData, token } = require('../../utils/index') //引入设置的能提示返回给客户端的状态码等

const router = express.Router()

//验证登录信息
router.post('/userInf', async (req, res) => {
    let { phone, password } = req.body

    let sql = `select * from uniUserinf where phone = '${phone}'`;
    let result = await query(sql)
    try {

        if (password == result[0].password) {
            // if (result.length > 0) { //数据长度大于0才登录成功
            //登录成功创建一个令牌
            let Authorization = token.create(phone) //Authorization是传给客户端的token名
            res.send(formatData({ data: [result[0], Authorization] }))

        } else {
            //密码错误            
            res.send(formatData({ status: 0, msg: '账号或密码错误！' }))

        }
    } catch (error) {
        if (result.length) {
            res.send(formatData({ code: 500 }))
        } else {
            res.send(formatData({ status: 0, msg: '该账户尚未注册！' }))
        }
    }
})
//注册(获取验证码)
router.post('/registerGetYZM', async (req, res) => {
    let { phone } = req.body

    let sql = `select * from uniUserinf where phone = '${phone}'`;
    let result = await query(sql)
    // console.log('sql:',sql,'result:',result);

    try {

        if (result.length) {
            res.send(formatData({ status: 0, msg: '账号已存在！' }))

        } else {
            //生成6位的随机数
            function checkCode(n) {
                //0-9之间任意n个数字组合
                // var num = parseInt(Math.random() * 10);//0-9.999  0-9
                var html = '';
                for (var i = 0; i < n; i++) {
                    var num = parseInt(Math.random() * 10);//5 4
                    html += num;
                }
                return html;//拼接好的四位随机数
            }
            var yzm = checkCode(6);
            res.send(formatData({ status: 1, data: yzm, msg: '验证码：' + yzm }))

        }
    } catch (error) {
        console.log('error', error);

        if (result.length) {
            res.send(formatData({ code: 500 }))
        } else {

            res.send(formatData({ status: 0, msg: '出错了！' }))
        }
    }
})

//注册 ，需验证 验证码
router.post('/register', async (req, res) => {


    let { phone, real_yzm, yzm, nickname, password } = req.body
    console.log('req.body:', req.body);

    let result = '';
    let sql = '';
    if (real_yzm != yzm) {

    } else { //验证码通过
        sql = `select * from uniUserinf where phone = '${phone}'`;
        result = await query(sql)
        console.log('sql:', sql, 'result:', result, result.length);

    }


    try {

        if (sql && result.length == 0) {  // 验证码通过 且 没注册过手机号
            let sql2 = `INSERT INTO uniuserinf (nickname, phone, password) VALUES ('${nickname}', '${phone}', '${password}')`
            await query(sql2);
            res.send(formatData({ status: 1, msg: '注册成功！' }))

        } else if (!sql) {
            res.send(formatData({ status: 0, msg: '验证码错误！' }))

        } else if (result.length) {
            res.send(formatData({ status: 0, msg: '手机号已存在' }))

        }
    } catch (error) {
        console.log('error', error);

        if (result.length) {
            res.send(formatData({ status: 0, code: 500 }))
        } else {

            res.send(formatData({ status: 0, msg: '出错了！' }))
        }
    }
})
module.exports = router