// 管理员信息管理
const express = require('express')

const adminList = require('./adminList')
const addAdmin = require('./addAdmin')

const router = express.Router()

router.use('/api/adminlist', adminList) //管理员列表
router.use('/api/addadmin', addAdmin) //添加管理员

module.exports = router