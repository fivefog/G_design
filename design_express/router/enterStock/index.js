//进库管理
const express = require('express')

const enterStockList = require('./enterStockList')
const addEnterStock = require('./addEnterStock')
const categoryList = require('./categoryList')
const addCategory = require('./addCategory')
const warehouseList = require('./warehouseList')
const addWarehouse = require('./addWarehouse')

const router = express.Router()

router.use('/api/enterstocklist', enterStockList) //进货信息列表
router.use('/api/addenterstock', addEnterStock) //添加进货信息
router.use('/api/categorylist', categoryList) //商品类别信息列表
router.use('/api/addcategory', addCategory) //添加商品类别信息
router.use('/api/warehouselist', warehouseList) //仓库信息列表
router.use('/api/addwarehouse', addWarehouse) //添加仓库信息

module.exports = router