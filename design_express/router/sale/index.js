//销售管理
const express = require('express')

const salelist = require('./saleList')
const addsale = require('./addSale')

const router = express.Router()

router.use('/api/salelist', salelist) //销售信息列表
router.use('/api/addsale', addsale) //添加销售信息

module.exports = router