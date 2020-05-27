//商品上下架管理
const express = require('express')

const shelvesList = require('./shelvesList')
const addshelves = require('./addShelves')
const onshelveslist = require('./onShelvesList')
const addonshelves = require('./addOnShelves')
const downshelveslist = require('./downShelvesList')
const adddownshelves = require('./addDownShelves')
const goodsM = require('./goodsM')

const router = express.Router()

router.use('/api/goodsM', goodsM) //货架信息列表
router.use('/api/shelveslist', shelvesList) //货架信息列表
router.use('/api/addshelves', addshelves) //添加货架信息
router.use('/api/onshelveslist', onshelveslist) //上架商品列表
router.use('/api/addonshelves', addonshelves) //添加上架商品
router.use('/api/downshelveslist', downshelveslist) //下架商品列表
router.use('/api/adddownshelves', adddownshelves) //添加下架商品

module.exports = router