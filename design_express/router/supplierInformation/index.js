//供应商信息管理
const express = require('express')

const supplierList = require('./supplierList')
const addSupplier = require('./addSupplier')

const router = express.Router()

router.use('/api/supplierlist', supplierList) //供应商列表
router.use('/api/addsupplier', addSupplier) //添加供应商

module.exports = router