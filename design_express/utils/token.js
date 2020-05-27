const jwt = require('jsonwebtoken')
const secretKey = 'yl' //密钥
    //创建token
function create(data, expiresIn = '24h') { //设置有效期为24小时
    /* 
      @param {Object} data 加密的数据
      @param {Number|String} expiresIn 有效期
      @return {String}  返回的token
    */
    let token = jwt.sign(

        { data }, //数据
        secretKey, //密钥
        { expiresIn } //有效期（单位：s）

    )
    return token

}

//校验token
function verify(token) {
    let result;
    try {
        jwt.verify(token, secretKey); //校验成功
        result = true
    } catch (err) {
        result = false //校验失败
    }
    return result
}

module.exports = {
    create,
    verify
}