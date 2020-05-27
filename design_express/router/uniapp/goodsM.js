//登录页面
const express = require('express')
const query = require('../../db/mysql') //引入连接数据库文件
const { formatData, token } = require('../../utils/index') //引入设置的能提示返回给客户端的状态码等
const router = express.Router()

//获取所有的商品信息
router.post('/goodsM', async (req, res) => {
    // let { username, password} = req.body
    let sql = `select * from goodsm`;
    try {

        let result = await query(sql)
        if (result.length > 0) { //数据长度大于0才登录成功
            result.forEach(element => {
                if (element.g_imglist) {
                    element.g_imglist = element.g_imglist.split(',');

                }

            });
            res.send(formatData({ data: [result] }))

        } else {

            res.send(formatData({ status: 0 }))

        }
    } catch (error) {

        res.send(formatData({ status: 0, msg: '失败' }))
    }
})
//获取指定g_id的商品信息
//通过g_id获取商品信息
router.post('/goodsM/:id', async (req, res) => {

    let { id } = req.params
    let sql = `select * from goodsm where g_id=${id}`

    try {
        let result = await query(sql)
        result.forEach(element => {  //2hang+    将轮播图列表字符串转为数组
            if (element.g_imglist) {
                element.g_imglist = element.g_imglist.split(',');
            }
            if (element.g_attr) {
                // console.log(element.g_attr.slice(1,-1).split(','));
                // element.g_attr = element.g_attr.slice(1, -1).split(',');
                // element.g_attr.forEach(item => {
                //     // console.log(typeof item);  //{ 颜色:"红 蓝"} 字符串类型
                //     // item = item.slice(1, -1);  // 颜色:"红 蓝"

                // })

                //console.log(typeof element.g_attr); //String
                let ee = JSON.parse(element.g_attr);  //字符串转成对象
                element.g_attr = ee;
                //console.log(typeof element.g_attr); //Object
            }
        });
        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})
//通过id修改商品存库
router.post('/editStock', (req, res) => {
    console.log('editStock的地盘', req.body);
    // return;
    let { orderParam } = req.body;


    orderParam.forEach(async element => {
        let g_id = element.g_id;
        let sql1 = `select * from goodsm where g_id=${g_id}`;  //获取原有的库存
        let result1 = await query(sql1);

        let oldStock = result1[0].g_stock;

        let newStock = oldStock - element.num;
      
        
        let sql2 = `update goodsm set g_stock=${newStock} where g_id=${g_id}`
        console.log('sql2:',sql2);
        
        await query(sql2);
    });

    try {
        res.send(formatData({ status: 1, msg: '编辑库存' })) //查询成功
    } catch (error) {
        console.log('error:',error);

        res.send(formatData({ status: 0,msg:'修改失败' })) //查询失败
    }
})

module.exports = router