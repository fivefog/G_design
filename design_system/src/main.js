import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
// import './assets/css/base.css'
import './styles/_variable.css'
import moment from 'moment'
import { regionData, CodeToText } from 'element-china-area-data'
import _ from 'lodash'
import './assets/font/iconfont.js'
import SlideVerify from 'vue-monoplasty-slide-verify'

Vue.use(SlideVerify) //使用滑块验证插件

Vue.config.productionTip = false

//把axios挂载到Vue实例上
Vue.prototype.$http = axios.create({
    baseURL: 'http://localhost:2020/api'
})

//把uploadd的action挂载到Vue实例上
// Vue.prototype.$action = 'http://120.79.168.248/api/upload'
Vue.prototype.$action = 'http://localhost:2020/api/upload'


//把store挂载到Vue实例上
Vue.prototype.$store = store

Vue.config.productionTip = false

//全局过滤器-处理日期格式
Vue.filter('fmtdata', value => {
    return moment(value).format('YYYY-MM-DD')
})

//把moment(处理日期格式)挂载到Vue实例上
Vue.prototype.$moment = moment

//全局过滤器-处理金额显示两位小数
Vue.filter('rounding', value => {
    if (typeof (value) !== 'number') {
        //转换为数字
        value = Number(value)
        return value.toFixed(2)
    }
})

//把省市区级联动数据载到Vue实例上
Vue.prototype.$regData = regionData

// 把省市区级联动数据由区域码转换成汉字
Vue.prototype.$codeToTxt = CodeToText

// 把lodash挂载到Vue实例上
Vue.prototype.$_ = _

// 防重复点击(指令实现)
Vue.directive('preventReClick', {
    inserted(el, binding) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false
                    el.istrue = false
                }, binding.value || 2000)
            }
        })
    }
})


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')