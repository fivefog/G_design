//登录页面
const express = require('express')
const query = require('../../db/mysql') //引入连接数据库文件
const { formatData, token } = require('../../utils/index') //引入设置的能提示返回给客户端的状态码等
const router = express.Router()

//加入购物车和立即购买的部分商品信息
router.post('/goodsBuy', async (req, res) => {

    let { data, buy_type } = req.body

    data[1] = JSON.stringify(data[1]);
    let sql1 = `select * from goodsm where g_id=${data[0]}`;
    let result1 = await query(sql1);
    let { g_price } = result1[0];
    let single_total = g_price * data[2];
    let sql2 = `insert into goodsbuy(g_id,select_attr,num,user_phone,buy_type,single_price,single_total) values(${data[0]},'${data[1]}',${data[2]},${data[3]},'${buy_type}',${g_price},${single_total})`;


    try {

        let result2 = await query(sql2)

        if (result2) { //数据长度大于0才登录成功

            res.send(formatData({ data: '插入成功' }))

        } else {

            res.send(formatData({ status: 0 }))

        }
    } catch (error) {
        console.log('error:', error);

        res.send(error, formatData({ status: 0 }))
    }
})

//创建订单1（立即购买列表）, 注意：购物车涉及单个选择，故不适用
router.post('/createOrder', async (req, res) => {
    let { phone, buy_type } = req.body

    let sql = `select * from goodsbuy where user_phone = '${phone}' and buy_type = '${buy_type}'`;
    let result = await query(sql)
    try {

        res.send(formatData({ data: [result] }))

    } catch (error) {
        console.log('errror', error);

        if (result.length) {
            res.send(formatData({ code: 500 }))
        } else {
            res.send(formatData({ status: 0, msg: '没有数据了' }))
        }
    }
})
//创建订单2（购物车列表）, 注意：购物车涉及单个选择
router.post('/createOrderById', async (req, res) => {
    let { phone, gb_id } = req.body

    let sql = `select * from goodsbuy where user_phone = '${phone}' and gb_id = ${gb_id}`;
    let result = await query(sql)
    try {

        res.send(formatData({ data: [result] }))

    } catch (error) {
        console.log('errror', error);

        if (result.length) {
            res.send(formatData({ code: 500 }))
        } else {
            res.send(formatData({ status: 0, msg: '没有数据了' }))
        }
    }
})
//支付成功后删除   and 购物车删除单个
router.post('/delete/goodsBuy', async (req, res) => {
    let { gb_id } = req.body
   

    let sql = `delete from goodsbuy where gb_id = ${gb_id}`;
    let result = await query(sql)
    try {
        res.send(formatData({ data: [result] }))

    } catch (error) {
        console.log('errror', error);

        if (result.length) {
            res.send(formatData({ code: 500 }))
        } else {
            res.send(formatData({ status: 0, msg: '没有数据了' }))
        }
    }
})
// 清空购物车，根据用户账户和 buy_type清空所有记录
router.post('/delete/cart', async (req, res) => {
    let { phone,buy_type } = req.body
   

    let sql = `delete from goodsbuy where user_phone = ${phone} and buy_type = '${buy_type}'`;
    let result = await query(sql)
    try {
        res.send(formatData({ data: [result] }))

    } catch (error) {
        console.log('errror', error);

        if (result.length) {
            res.send(formatData({ code: 500 }))
        } else {
            res.send(formatData({ status: 0, msg: '没有数据了' }))
        }
    }
})

module.exports = router