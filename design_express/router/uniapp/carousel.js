//登录页面
const express = require('express')
const query = require('../../db/mysql') //引入连接数据库文件
const { formatData, token } = require('../../utils/index') //引入设置的能提示返回给客户端的状态码等

const router = express.Router()

//获取所有的轮播图
router.post('/indexCarousel', async (req, res) => {
    // let { username, password} = req.body
    let sql = `select indexCarousel from carousel`;

    try {

        let result = await query(sql)
        if (result.length > 0) { //数据长度大于0才登录成功
            //登录成功创建一个令牌
            // let Authorization = token.create(username) //Authorization是传给客户端的token名
            // res.send(formatData({ data: [result, Authorization] }))
            res.send(formatData({ data: result}))

        } else {
            res.send(formatData({ status: 0 }))

        }
    } catch (error) {

        res.send(formatData({ status: 0 }))
    }
})


module.exports = router