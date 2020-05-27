//售货员列表
const express = require('express')
const query = require('../../db/mysql')
const { formatData } = require('../../utils/index')
const router = express.Router()

//通过模糊条件查询售货员信息、查询分页和计算总条数
router.get('/:pagenum/:pagesize', async(req, res) => {
    let start = 0 //设置的起始数据为第一条
    let { pagenum, pagesize } = req.params //页码，每页显示的条数

    if (pagenum > 1) { //页码大于1的分页的起始数
        start = (pagenum - 1) * pagesize
    }
    let sql1 = `select * from staffusers where (`
    for (let key in req.query) {
        sql1 += `${key} like '%${req.query[key]}%' or `
    }
    sql1 = sql1.slice(0, -4)
    sql1 += `) and role='售货员' limit ${start},${pagesize}`

    let sql2 = `select count(*) as total  from staffusers where (` //计算总条数
    for (let key in req.query) {
        sql2 += `${key} like '%${req.query[key]}%' or `
    }
    sql2 = sql2.slice(0, -3)
    sql2 += `) and role='售货员'`

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

//通过id删除售货员
router.delete('/:id', async(req, res) => {
    let { id } = req.params
    let sql = `delete from staffusers where id=${id}`
    try {
        await query(sql)
        res.send(formatData()) //删除成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //删除失败
    }
})

//批量删除售货员(多选)
router.delete('/multId/:ids', async(req, res) => {
    let { ids } = req.params
    let sql = `delete from staffusers where id in ${ids}`

    try {
        await query(sql)
        res.send(formatData()) //删除成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //删除失败
    }
})

module.exports = router