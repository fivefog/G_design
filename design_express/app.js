const express = require('express')
const cors = require('cors')
const { port } = require('./config.json')
const compression = require('compression')
const allRouter = require('./router/index')

const fs = require('fs')

//创建一个服务器
const app = express()

//压缩文件体积
app.use(compression())

//开放静态资源
// app.use(express.static('./public')) //前端页面静态资源
app.use('/uploads', express.static('./uploads')) //上传图片的静态资源

//实现跨域
app.use(cors())

//总路由模块
app.use(allRouter)

app.listen(port, () => {
    console.log('服务器连接成功')
})