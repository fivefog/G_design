const express = require('express')
const loginRouter = require('./login/login')
const forgetPasswordRouter = require('./forgetPassword/forgetPwd')
const verifyRouter = require('./roleTokenVerify/verify')
const staffPersonalInformationRouter = require('./staffPersonalInformation/index')
const adminInformationRouter = require('./adminInformation/index')
// const salesmanInformationRouter = require('./salesmanInformation/index')  删
const vipInformationRouter = require('./vipInformation/index')
const supplierInformationRouter = require('./supplierInformation/index')
const uploadsRouter = require('./uploads/upload')
const menuRouter = require('./menu/index')
const enterStockRouter = require('./enterStock/index')
const outStockRouter = require('./outStock/index')
const returnGoodsRouter = require('./returnGoods/index')
const stockRouter = require('./stock/index')
const goodsRouter = require('./goods/index')
const shelvesRouter = require('./shelves/index')
const saleRouter = require('./sale/index')
const dataRouter = require('./data/index')
const orderRouter = require('./order/index')
const userInfRouter = require('./userInf/index')
const uni_Router = require('./uniapp/index')


//中间件
const router = express.Router()

//格式化请求体中的参数
router.use(express.json(), express.urlencoded())

router.use(menuRouter) //菜单管理

router.use('/api/upload', uploadsRouter) //上传图片

router.use('/api/login', loginRouter) //登录页

router.use('/api/forgetpwd', forgetPasswordRouter) //忘记密码

router.use('/api', verifyRouter) //超级管理员、售货员、超市会员的token校验接口

router.use(staffPersonalInformationRouter) //个人信息管理（超级管理员、管理员或售货员）

router.use(adminInformationRouter) //管理员信息管理

//删 router.use(salesmanInformationRouter) //售货员信息管理

router.use(vipInformationRouter) //会员信息管理

router.use(supplierInformationRouter) //供应商信息管理

router.use(enterStockRouter) //进货管理

router.use(outStockRouter) //出货管理

router.use(returnGoodsRouter) //退货管理

router.use(stockRouter) //库存管理

router.use(goodsRouter) //商品管理

router.use(shelvesRouter) //商品上下架管理

router.use(saleRouter) //销售管理

router.use(dataRouter) //数据管理

router.use(orderRouter) //订单管理

router.use(userInfRouter) //用户管理

router.use('/uni',uni_Router)

//导出中间件
module.exports = router