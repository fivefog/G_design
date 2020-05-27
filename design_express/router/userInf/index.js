// 用户信息管理
const express = require('express')

const userInflist = require('./userInflist')
const userInfadd = require('./userInfadd')

const router = express.Router()

router.use('/api/userInflist', userInflist) //账号信息列表
router.use('/api/userInfadd', userInfadd) //账号信息添加

module.exports = router