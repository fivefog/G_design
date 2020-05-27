//会员信息管理
const express = require('express')

const vipList = require('./vipList')
const addvip = require('./addVip')

const router = express.Router()

router.use('/api/viplist', vipList) //会员列表
router.use('/api/addvip', addvip) //添加会员

module.exports = router