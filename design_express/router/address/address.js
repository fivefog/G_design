//商品列表
const express = require('express')
const query = require('../../db/mysql')
const { formatData } = require('../../utils/index')
const _ = require('lodash')

const router = express.Router()

//通过模糊条件查询商品的未上架数量、上架数量、上架商品剩余数量、下架数量、销售数量、查询分页和计算总条数


module.exports = router