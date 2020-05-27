//收货地址
const express = require('express')
const query = require('../../db/mysql') //引入连接数据库文件
const { formatData, token } = require('../../utils/index') //引入设置的能提示返回给客户端的状态码等

const router = express.Router()

//获取收货地址
router.post('/address/getUserAddressList', async (req, res) => {
    let { phone } = req.body
   
    let sql = `select * from address where phone = '${phone}'`;
 

    let result = await query(sql)
    try {
    
        if (result.length) {
            res.send(formatData({ data: result }))

        } else {
            //密码错误            
            res.send(formatData({ status: 0, msg: '没有数据了' }))

        }
    } catch (error) {
        if (result.length) {
            res.send(formatData({ code: 500 }))
        } else {
            res.send(formatData({ status: 0, msg: '失败！请检查' }))
        }
    }
})

//新增 和 编辑
router.post('/address/editUserAddress', async (req, res) => {
    let { addr_id, user_phone, real_name, phone, province, city, district, detail, is_default } = req.body;
    let sql = '';
    if (!addr_id) {   //添加地址
        sql = `insert into address(phone,real_name,real_phone,province,city,district,detail,is_default) values(${user_phone},'${real_name}',${phone},'${province}','${city}','${district}','${detail}',${is_default}) `;
    } else {  //编辑地址
        sql = `update address set real_name = '${real_name}',real_phone = ${phone},province = '${province}',city = '${city}',district = '${district}',detail = '${detail}',is_default = ${is_default} where addr_id = ${addr_id}`
    }


    let result = await query(sql)

    try {
        if (!addr_id) {
            res.send(formatData({ status: 1, msg: '添加成功！' }));
        } else {
            res.send(formatData({ status: 1, msg: '修改成功！' }));

        }

    } catch (error) {
        if (result.length) {
            res.send(formatData({ code: 500 }))
        } else {
            res.send(formatData({ status: 0, msg: '失败！请检查' }))
        }
    }
})

//某个订单的收货地址
router.post('/address/getOrderAddress', async (req, res) => {
    let { addr_id } = req.body
   
    let sql = `select * from address where addr_id = ${addr_id}`;
    console.log('sql:',sql);
    

    let result = await query(sql)
    try {
    
        if (result.length) {
            res.send(formatData({ data: result }))

        } else {
            //密码错误            
            res.send(formatData({ status: 0, msg: '请添加收货地址' }))

        }
    } catch (error) {
        if (result.length) {
            res.send(formatData({ code: 500 }))
        } else {
            res.send(formatData({ status: 0, msg: '失败！请检查' }))
        }
    }
})
module.exports = router