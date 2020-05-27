//库存管理
const express = require('express')

const stockList = require('./stockList')

const router = express.Router()

router.use('/api/stocklist', stockList) //库存信息列表

module.exports = router