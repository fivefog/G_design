//超级管理员菜单
const express = require('express')
const query = require('../../db/mysql')
const { formatData, dataToTree } = require('../../utils/index')

const router = express.Router()

//将父子关系的数据转换成树形结构并根据不同角色查询
router.get('/tree/:role', async(req, res) => {
    let { role } = req.params
    let sql = `select * from menulist where ${role}=1`

    try {
        let data = await query(sql)

        let result = dataToTree(data) //把父子级关系数据转换成树形结构
        res.send(formatData({ data: result }))
    } catch (error) {
        res.send(formatData({ status: 0 }))
    }
})

//将父子关系的数据转换成树形结构并通过模糊条件查询菜单信息、查询分页和计算总条数
router.get('/list/:pagenum/:pagesize/:role', async(req, res) => {
    let start = 0 //设置的起始数据为第一条
    let { pagenum, pagesize, role } = req.params //页码,每页显示的条数,角色

    if (pagenum > 1) { //页码大于1的分页的起始数
        start = (pagenum - 1) * pagesize
    }
    let sql1 = `select * from menulist where ${role}=1 limit ${start},${pagesize}`

    let sql2 = `select count(*) as total  from  menulist  where ${role}=1` //计算总条数
    try {
        let result1 = await query(sql1)
        let result2 = await query(sql2)

        if (result2[0].total !== 0) {
            res.send(formatData({ data: [result1, result2[0].total] })) //查询成功
        } else {
            res.send(formatData({ status: 0 }))
        }
    } catch (error) {
        res.send(formatData({ status: 0 }))
    }
})

module.exports = router