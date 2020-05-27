//菜单管理
const express = require('express')
const menuList = require('./menu')

const router = express.Router()

router.use('/api/menu', menuList) //超级管理员菜单列表

module.exports = router