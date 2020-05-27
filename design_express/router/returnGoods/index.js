//退货管理
const express = require('express')

const returnGoodsList = require('./returnGoodsList')
const addReturngoods = require('./addReturngoods')

const router = express.Router()

router.use('/api/returngoodslist', returnGoodsList) //退货信息列表
router.use('/api/addreturngoods', addReturngoods) //添加退货信息

module.exports = router