//数据管理
const express = require('express')

const datareport = require('./dataReport')

const router = express.Router()

router.use('/api/datareport', datareport) //数据报表

module.exports = router