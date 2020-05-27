
const express = require('express')
const query = require('../../db/mysql') //引入连接数据库文件
const { formatData } = require('../../utils/index') //引入设置的能提示返回给客户端的状态码等

const router = express.Router()


//供后台使用


//获取所有订单  
//通过模糊条件查询货架信息、查询分页和计算总条数
// router.get('/:pagenum/:pagesize', async (req, res) => {

//     let start = 0 //设置的起始数据为第一条
//     let { pagenum, pagesize } = req.params //页码，每页显示的条数

//     if (pagenum > 1) { //页码大于1的分页的起始数
//         start = (pagenum - 1) * pagesize
//     }

//     let sql1 = `select * from goodsorder where `
//     for (let key in req.query) {
//         sql1 += `${key} like '%${req.query[key]}%' or `
//     }
//     sql1 = sql1.slice(0, -3)
//     sql1 += `order by g_id asc limit ${start},${pagesize}`

//     let sql2 = `select count(*) as total  from goodsorder where ` //计算总条数
//     for (let key in req.query) {
//         sql2 += `${key} like '%${req.query[key]}%' or `
//     }

//     sql2 = sql2.slice(0, -4)
//     console.log(sql1,sql2);

//     try {
//         let result1 = await query(sql1)
//         let result2 = await query(sql2)
//      console.log('result1:',result1);
//      console.log('result2:',result2);

//         if (result2[0].total !== 0) {
//             res.send(formatData({ data: [result1, result2[0].total] })) //查询成功
//         } else {
//             res.send(formatData({ status: 0 }))
//         }
//     } catch (error) {
//         res.send(formatData({ status: 0 }))
//     }
// })
//获取所有订单
router.post('/', async (req, res) => {
    var sql = `select * from goodsorder`;

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
// 设置发货表单，订单状态也做修改
router.post('/setForm', async (req, res) => {
    let { order_id, tacking_num, tacking_company } = req.body.params;
    var sql = `update goodsorder set tacking_num='${tacking_num}', tacking_company='${tacking_company}', status=2 where order_id='${order_id}'`;
    
    await query(sql)
 
    try {
            
        res.send(formatData({ status: 1, msg: '提交成功！' }))
     
    } catch (error) {
        console.log('出错：',error);
         res.send(formatData({ status: 0, msg: '失败！请检查' }))
      
    }
})
// 设置发货表单，订单状态也做修改
router.post('/setStatus', async (req, res) => {
    let { order_id, status } = req.body.params;
    var sql = `update goodsorder set status=${status} where order_id='${order_id}'`;
    
    await query(sql)
 
    try {
            
        res.send(formatData({ status: 1, msg: '修改成功！' }))
     
    } catch (error) {
        console.log('出错：',error);
         res.send(formatData({ status: 0, msg: '失败！请检查' }))
      
    }
})

module.exports = router