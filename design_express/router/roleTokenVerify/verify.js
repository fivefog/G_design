const express = require('express')
const { formatData, token } = require('../../utils/index')

router = express.Router()

router.get('/superAdminverify', (req, res) => { //超级管理员校验
    //获取请求头上的token
    let superAdminAuthorization = req.get('superAdminAuthorization') //req.get()用来获取请求头上的数据
    if (token.verify(superAdminAuthorization)) { //如果校验成功发送给客户端状态码为1
        res.send(formatData())
    } else {
        res.send(formatData({ status: 0 }))
    }
})

router.get('/adminverify', (req, res) => { //管理员校验
    //获取请求头上的token
    let adminAuthorization = req.get('adminAuthorization') //req.get()用来获取请求头上的数据
    if (token.verify(adminAuthorization)) { //如果校验成功发送给客户端状态码为1
        res.send(formatData())
    } else {
        res.send(formatData({ status: 0 }))
    }
})

router.get('/saleverify', (req, res) => { //售货员校验
    //获取请求头上的token
    let saleAuthorization = req.get('saleAuthorization') //req.get()用来获取请求头上的数据
    if (token.verify(saleAuthorization)) { //如果校验成功发送给客户端状态码为1
        res.send(formatData())
    } else {
        res.send(formatData({ status: 0 }))
    }
})

router.get('/vipverify', (req, res) => { //超级会员校验
    //获取请求头上的token
    let vipAuthorization = req.get('vipAuthorization') //req.get()用来获取请求头上的数据
    if (token.verify(vipAuthorization)) { //如果校验成功发送给客户端状态码为1
        res.send(formatData())
    } else {
        res.send(formatData({ status: 0 }))
    }
})

module.exports = router