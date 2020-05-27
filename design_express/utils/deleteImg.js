const fs = require('fs') //引入fs模块

//删除服务器已上传的图片(单张)
function deleteImg(result) {
    return new Promise(resolve => {
        let g_imgurl = result[0].g_imgurl
            // console.log(g_imgurl)
            // console.log(g_imgurl.slice(g_imgurl.lastIndexOf('/') + 1))
        let filename = `uploads\\${g_imgurl.slice(g_imgurl.lastIndexOf('/') + 1)}`
        fs.unlink(filename, err => {
            if (err) {
                resolve(true)
            } else {
                resolve(true)
            }
        })
    })
}

//批量删除服务器已上传的图片(多张)
function multDeleteImg(result) {
    return new Promise(resolve => {
        for (let key of result) { //批量删除服务器已上传的图片
            // console.log(key.g_imgurl)
            // console.log(key.g_imgurl.slice(key.g_imgurl.lastIndexOf('/') + 1))
            fs.unlink(`uploads\\${key.g_imgurl.slice(key.g_imgurl.lastIndexOf('/') + 1)}`, async err => {
                if (err) {
                    resolve(true)
                } else {
                    resolve(true)
                }
            })
        }
    })
}

module.exports = {
    deleteImg,
    multDeleteImg
}