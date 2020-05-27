//商品管理
const express = require('express')

const goodslist = require('./goodsList')

const router = express.Router()

router.use('/api/goodslist', goodslist) //商品信息列表

module.exports = router