// 个人信息查询
const express = require('express')
const query = require('../../db/mysql')
const { formatData } = require('../../utils/index')
const router = express.Router()

//通过id获取超级管理员或管理员个人信息
router.get('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `select * from staffusers where id=${id}`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})

//获取全部的员工编号
router.get('/', async(req, res) => {
    let sql = `select s_id from staffusers order by s_id asc`
    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //查询成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //查询失败
    }
})
module.exports = router