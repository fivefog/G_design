
const express = require('express')
const query = require('../../db/mysql') //引入连接数据库文件
const { formatData, token } = require('../../utils/index') //引入设置的能提示返回给客户端的状态码等

const router = express.Router()


//新增订单信息   注意 orderParam是数组    进行ing?
router.post('/order/setMyOrderList', async (req, res) => {

    let { addressData, add_time, order_id, orderParam, total_price,g_note } = req.body;
    let result = '';
    orderParam.forEach(element => {
        let sql = `insert into goodsorder(addr_id, order_id, status, g_id, user_phone, select_attr, num, single_total, single_price, total_price, g_imgurl, g_name, g_note, add_time) 
        values(${addressData.addr_id},'${order_id}',1,${element.g_id},${addressData.phone},'${element.select_attr}',${element.num},${element.single_total},${element.single_price},${total_price},'${element.g_imgurl}','${element.g_name}','${g_note}','${add_time}')`;
        console.log('新增订单sql：',sql)
         result = query(sql)
    });

    try {

        if (result.length) {
            res.send(formatData({ status: 1, msg: '有新订单' }))
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
//获取所有订单  
router.post('/order/getMyOrderList', async (req, res) => {

    let { phone, status } = req.body;
    // let sql='';
    if (status == -1) {
        var sql = `select * from goodsorder where user_phone = ${phone}`;
    } else {
        var sql = `select * from goodsorder where (user_phone = ${phone} && status = ${status})`;
    }


    let result = await query(sql)
    let cartInfo = []; //快照：同一订单多个商品
    let idArr = [];   //装order_id
  
    result.forEach((item, index) => {
        idArr.length ? newidArr(item) : idArr.push(item.order_id);
        check(item);
    });
    function newidArr(oderItem) {
        if (idArr.includes(oderItem.order_id) == false) {
            idArr.push(oderItem.order_id);
        }
    }
    function check(oderItem) { //每个订单编号所在的数组push相同订单编号的商品
        idArr.forEach((idItem, idIndex) => {
            if (idItem == oderItem.order_id) {
                if (!cartInfo[idIndex]) { cartInfo[idIndex] = [] }
                cartInfo[idIndex].push(oderItem);
            }
            
        });
    }
  
   
    // console.log('快照的数组：', cartInfo);
  
    
    try {

        if (cartInfo.length) {
            res.send(formatData({ data: cartInfo }))
        } else {
            //密码错误            
            res.send(formatData({ status: 0, msg: '没有数据了' }))
        }
    } catch (error) {
        if (cartInfo.length) {
            res.send(formatData({ code: 500 }))
        } else {
            res.send(formatData({ status: 0, msg: '失败！请检查' }))
        }
    }
})
//获取订单详情     
router.post('/order/MyOrderCell', async (req, res) => {

    let {  order_id} = req.body;
        let sql = `select * from goodsorder where order_id = '${order_id}'`;
        console.log('sql:',sql);
        let result =await query(sql)
        // console.log('result:',result);
        
    try {

        if (result.length) {
            res.send(formatData({ data:result,status: 1, msg: '获取订单详情' }))
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
//确认收货，状态变为待评价
router.post('/order/userTakeOrder', async (req, res) => {

    let {  order_id} = req.body;
        let sql = `UPDATE goodsorder SET status=3 where order_id = '${order_id}'`;
        console.log('sql:',sql);
        let result =await query(sql)
        
    try {
            res.send(formatData({ data:result,status: 1, msg: '确认收货成功！' }))
                  
       
    } catch (error) {
        if (result.length) {
            res.send(formatData({ code: 500 }))
        } else {
            res.send(formatData({ status: 0, msg: '失败！请检查' }))
        }
    }
})
module.exports = router