//出库管理
const express = require('express')

const outStockList = require('./outStockList')
const addOutStock = require('./addOutStock')

const router = express.Router()

router.use('/api/outstocklist', outStockList) //出货信息列表
router.use('/api/addoutstock', addOutStock) //添加出货信息

module.exports = router