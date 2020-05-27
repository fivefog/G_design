// 个人信息管理
const express = require('express')

const myselfUpdate = require('./InformationUpdate')
const myselfQuery = require('./InformationQuery')

const router = express.Router()

router.use('/api/myselfquery', myselfQuery) //个人信息查询
router.use('/api/myselfupdate', myselfUpdate) //个人信息修改

module.exports = router