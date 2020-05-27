// 添加进货信息
const express = require('express')
const query = require('../../db/mysql')
const { formatData } = require('../../utils/index')
const router = express.Router()


//添加进货信息
router.post('/', async(req, res) => {

    let sql = `insert into enterstock (`

    for (let key in req.body) {
        sql += `${key},`
    }

    sql = sql.replace(/,$/, ') values (')

    for (let key in req.body) {
        sql += `'${req.body[key]}',`
    }
    sql = sql.replace(/,$/, ')')

    try {
        let result = await query(sql)
        res.send(formatData({ data: result })) //添加成功
    } catch (error) {
        res.send(formatData({ status: 0 })) //添加失败
    }
})

module.exports = router