//售货员信息管理
const express = require('express')

const salesmanList = require('./salesmanList')
const addSalesman = require('./addSalesman')

const router = express.Router()

router.use('/api/salesmanlist', salesmanList) //售货员列表
router.use('/api/addsalesman', addSalesman) //添加售货员

module.exports = router