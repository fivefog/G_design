//订单管理
const express = require('express')

const getOrder = require('./order')

const router = express.Router()

router.use('/api/getOrder', getOrder) //订单信息列表

module.exports = router