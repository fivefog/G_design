const nodemailer = require('nodemailer');

// 创建smtp服务器
const transport = nodemailer.createTransport({
    host: 'smtp.qq.com', //qq邮箱的服务器
    port: '465', //端口
    secureConnection: true,
    auth: {
        user: '1097503983@qq.com', //自己的邮箱地址
        pass: 'dexhcikkfjyygagh' //邮箱授权码
    }
});

function sendEmail(email, verifynum) {
    // 邮件具体信息
    const mailOptions = {
        from: '"熊猫小爱管理系统项目组"<1097503983@qq.com>', //发送方邮箱地址
        to: `${email}`, //接收方邮箱地址
        subject: '【熊猫小爱管理系统】身份验证', //邮件标题
        text: `您正在重置密码，验证码：${verifynum}，5分钟内有效，超时请重新获取。请勿泄露喔！` //邮件内容
    }

    //发送邮件
    transport.sendMail(mailOptions, (err, result) => {
        return new Promise((resolve, reject) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

module.exports = sendEmail