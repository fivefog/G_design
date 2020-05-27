const express = require('express')




//app的接口start
const uni_goodsMRouter = require('./goodsM')
const uni_indexCarousel = require('./carousel')
const uni_category = require('./category')
const uni_goodsBuy = require('./goodsBuy')
const uni_userInf = require('./userInf')
const uni_order = require('./order')
const uni_address = require('./address')
//中间件
const router = express.Router()

router.use(uni_goodsMRouter)
router.use(uni_indexCarousel)
router.use(uni_category)
router.use(uni_goodsBuy)
router.use(uni_userInf)
router.use(uni_order)
router.use(uni_address)
//导出中间件
module.exports = router
