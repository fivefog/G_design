//收货联系方式管理
const express = require('express')

const addrList = require('./address')

const router = express.Router()

router.use('/api/addrList', addrList) //收货地址信息列表

module.exports = router