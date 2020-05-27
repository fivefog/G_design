module.exports = {
    outputDir: 'public', //打包好的文件夹名字
    assetsDir: 'static', //静态资源位置
    publicPath: '', //公共路径
    
    //vue-cli3 配置全局的scss变量    https://www.cnblogs.com/happymental/p/12358167.html
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "~@/styles/_variable.scss";`
            }
        }
    }
}