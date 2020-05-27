import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'
import Login from '../components/login/Login.vue'
import Superadminhome from '../components/home/superAdminHome/superAdminHome.vue'
import Adminhome from '../components/home/adminHome/adminHome.vue'
import Salesmanhome from '../components/home/salesmanHome/salesmanHome.vue'
import Viphome from '../components/home/vipHome/vipHome.vue'
import Welcome from '../components/welcome/Welcome.vue'
import staffMyselfquery from '../components/staffPersonalInformation/InformationQuery/myselfquery.vue'
import staffMyselfupdate from '../components/staffPersonalInformation/InformationUpdate/myselfUpdate.vue'
import staffPassupdate from '../components/staffPersonalInformation/passwordUpadte/passUpdate.vue'
import vipMyselfquery from '../components/vipPersonalInformation/InformationQuery/myselfquery.vue'
import vipMyselfupdate from '../components/vipPersonalInformation/InformationUpdate/myselfUpdate.vue'
import vipPassupdate from '../components/vipPersonalInformation/passwordUpadte/passUpdate.vue'
import Adminlist from '../components/adminInformation/adminlist/adminlist.vue'
import Addadmin from '../components/adminInformation/addadmin/addadmin.vue'
import Salesmanlist from '../components/salesmanInformation/salesmanlist/salesmanlist.vue'
import Addsalesman from '../components/salesmanInformation/addsalesman/addsalesman.vue'
import Viplist from '../components/vipInformation/viplist/viplist.vue'
import Addvip from '../components/vipInformation/addvip/addvip.vue'
import Supplierlist from '../components/supplierInformation/supplierlist/supplierlist.vue'
import AddSupplier from '../components/supplierInformation/addsupplier/addsupplier.vue'
import Enterstocklist from '../components/enterStock/enterStockList/e_stocklist.vue'
import Addenterstock from '../components/enterStock/addEnterStock/adde_stock.vue'
import Categorylist from '../components/enterStock/categoryList/categorylist.vue'
import Warehouselist from '../components/enterStock/warehouseList/warehouselist.vue'
import Returngoodslist from '../components/returnGoods/returnGoodsList/r_goodslist.vue'
import Addreturngoods from '../components/returnGoods/addReturngoods/addr_goods.vue'
import Outstocklist from '../components/outStock/outStockList/o_stocklist.vue'
import Addoutstock from '../components/outStock/addOutStock/addo_stock.vue'
import Stocklist from '../components/stock/stockList/stockList.vue'
import Goodslist_c from '../components/order/goodslist_c.vue' //没用

import Shelveslist from '../components/shelves/shelvesList/shelveslist.vue'
import Onshelveslist from '../components/shelves/onShelvesList/onshelveslist.vue'
import Addonshelves from '../components/shelves/addOnShelves/addonshelves.vue'
import Downshelveslist from '../components/shelves/downShelvesList/downshelveslist.vue'
import Adddownshelves from '../components/shelves/addDownShelves/adddownshelves.vue'
import Salelist from '../components/sale/saleList/salelist.vue'
import Addsale from '../components/sale/addSale/addsale.vue'
import Superrootlist from '../components/root/superRoleList/superrolelist.vue'
import Viprootlist from '../components/root/vipRoleList/viprolelist.vue'
import Datareport from '../components/data/dataReport/datareport.vue'
import Exitvip from '../components/identity/exitVip/exitvip.vue'
import goodsM from '../components/shelves/shelvesList/goodsM.vue'
import orderlist from '../components/order/orderlist.vue'
import userinfquery from '../components/userInformation/InformationQuery/userInfquery.vue' //账号信息查询
import userinfupdate from '../components/userInformation/InformationUpdate/userInfupdate.vue' //账号信息修改
Vue.use(VueRouter)

const router = new VueRouter({
    routes: [{
        path: '*',
        redirect: '/login'
    },
    {
        path: '/login',
        name: '登录',
        component: Login,
        meta: { //路由元信息
            title: '登录'
        }
    },
    {
        path: '/superadminhome/:id',
        name: 'superadminHome',
        component: Superadminhome,
        meta: { //路由元信息
            requiresAuth: true,
            role: '超级管理员',
        },
        redirect: '/superadminhome/:id/welcome', //重定向
        children: [
            {
            path: 'welcome',
            name: 'superadminWelcome',
            component: Welcome,
            meta: { //路由元信息
                requiresAuth: true, //需要用户权限的路由
                role: '超级管理员', //用户角色
                name: 'welcome',
                title: '首页',
            }
        },
         {
            path: 'myselfquery',
            name: 'superadminMyselfquery',
            component: staffMyselfquery,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'myselfquery',
                title: '个人信息查询'
            }
        }, {
            path: 'myselfupdate',
            name: 'superadminMyselfupdate',
            component: staffMyselfupdate,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'myselfupdate',
                title: '个人信息修改'
            }
        },
        {
            path: 'passupdate',
            name: 'superadminPassupdate',
            component: staffPassupdate,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'passupdate',
                title: '修改密码'
            }
        },
        {
            path: 'adminlist',
            name: 'superadminAdminlist',
            component: Adminlist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'adminlist',
                title: '管理员信息列表'
            }
        },
        {
            path: 'addadmin',
            name: 'superadminaddadmin',
            component: Addadmin,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'addadmin',
                title: '添加管理员信息'
            }
        },
        {
            path: 'salesmanlist',
            name: 'superSalesmanlist',
            component: Salesmanlist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'salesmanlist',
                title: '售货员信息列表'
            }
        },
        {
            path: 'addsalesman',
            name: 'superAddsalesman',
            component: Addsalesman,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'addsalesman',
                title: '添加售货员信息'
            }
        },
        {
            path: 'viplist',
            name: 'superViplist',
            component: Viplist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'viplist',
                title: '会员信息列表'
            }
        },
        // {
        //     path: 'addvip',
        //     name: 'superAddvip',
        //     component: Addvip,
        //     meta: { //路由元信息
        //         requiresAuth: true,
        //         role: '超级管理员',
        //         name: 'addvip',
        //         title: '添加会员信息'
        //     }
        // },
        // {
        //     path: 'supplierlist',
        //     name: 'superSupplierlist',
        //     component: Supplierlist,
        //     meta: { //路由元信息
        //         requiresAuth: true,
        //         role: '超级管理员',
        //         name: 'supplierlist',
        //         title: '供应商信息列表'
        //     }
        // },
        // {
        //     path: 'addsupplier',
        //     name: 'superAddsupplier',
        //     component: AddSupplier,
        //     meta: { //路由元信息
        //         requiresAuth: true,
        //         role: '超级管理员',
        //         name: 'addsupplier',
        //         title: '添加供应商信息'
        //     }
        // },
        {
            path: 'enterstocklist',
            name: 'superEnterstocklist',
            component: Enterstocklist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'enterstocklist',
                title: '进货信息列表'
            }
        },
        {
            path: 'addenterstock',
            name: 'superAddenterstock',
            component: Addenterstock,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'addenterstock',
                title: '添加进货信息'
            }
        },
        {
            path: 'categorylist',
            name: 'superCategorylist',
            component: Categorylist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'categorylist',
                title: '商品类别信息列表'
            }
        },
        {
            path: 'warehouselist',
            name: 'superWarehouselist',
            component: Warehouselist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'warehouselist',
                title: '仓库信息列表'
            }
        },
        {
            path: 'r_goodslist',
            name: 'superR_goodslist',
            component: Returngoodslist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'r_goodslist',
                title: '退货信息列表'
            }
        },
        {
            path: 'addr_goods',
            name: 'superAddr_goods',
            component: Addreturngoods,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'addr_goods',
                title: '添加退货信息'
            }
        },
        {
            path: 'outstocklist',
            name: 'superOutstocklist',
            component: Outstocklist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'outstocklist',
                title: '出货信息列表'
            }
        },
        {
            path: 'addoutstock',
            name: 'superAddoutstock',
            component: Addoutstock,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'addoutstock',
                title: '添加出货信息'
            }
        },
        {
            path: 'stocklist',
            name: 'superStocklist',
            component: Stocklist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'stocklist',
                title: '库存信息列表'
            }
        },
        {
            path: 'orderlist',
            name: 'superOrderlist',
            component: orderlist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'orderlist',
                title: '商品信息列表'
            }
        },
        {
            path: 'userinfquery',
            name: 'superUserinfquery',
            component: userinfquery,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'userinfquery',
                title: '账号信息查询'
            }
        },
        {
            path: 'userinfupdate',
            name: 'superUserinfupdate',
            component: userinfupdate,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'userinfupdate',
                title: '账号信息修改'
            }
        },
        {
            path: 'goodslist_c',
            name: 'superGoodslist',
            component: Goodslist_c,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'goodslist_c',
                title: '各类商品管理'
            }
        },
        {
            path: 'shelveslist',
            name: 'superShelveslist',
            component: Shelveslist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'shelveslist',
                title: '货架信息列表'
            }
        },
        {
            path: 'goodsM',
            name: 'superGoodsM',
            component: goodsM,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'goodsM',
                title: '商品信息列表'
            }
        },
        {
            path: 'onshelveslist',
            name: 'superOnshelveslist',
            component: Onshelveslist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'onshelveslist',
                title: '上架商品列表'
            }
        },
        {
            path: 'addonshelves',
            name: 'superAddonshelves',
            component: Addonshelves,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'addonshelves',
                title: '添加上架商品'
            }
        },
        {
            path: 'downshelveslist',
            name: 'superDownshelveslist',
            component: Downshelveslist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'downshelveslist',
                title: '下架商品列表'
            }
        },
        {
            path: 'adddownshelves',
            name: 'superAdddownshelves',
            component: Adddownshelves,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'adddownshelves',
                title: '添加下架商品'
            }
        },
        {
            path: 'salelist',
            name: 'superSalelist',
            component: Salelist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'salelist',
                title: '销售信息列表'
            }
        },
        {
            path: 'addsale',
            name: 'superAddsale',
            component: Addsale,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'addsale',
                title: '添加销售信息'
            }
        },
        {
            path: 'rootlist',
            name: 'superSuperrootlist',
            component: Superrootlist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'rootlist',
                title: '权限列表'
            }
        },
        {
            path: 'datareport',
            name: 'superDatareport',
            component: Datareport,
            meta: { //路由元信息
                requiresAuth: true,
                role: '超级管理员',
                name: 'datareport',
                title: '数据报表'
            }
        }
        ]
    },

    {
        path: '/adminhome/:id',
        name: 'adminHome',
        component: Adminhome,
        redirect: '/adminhome/:id/welcome',
        meta: { //路由元信息
            requiresAuth: true, //需要用户权限的路由
            role: '管理员' //用户角色
        },
        // children: [
        children: [{
            path: 'welcome',
            name: 'adminWelcome',
            component: Welcome,
            meta: { //路由元信息
                requiresAuth: true, //需要用户权限的路由
                role: '管理员', //用户角色
                name: 'welcome',
                title: '首页',
            }
        },
        {
            path: 'myselfquery',
            name: 'adminMyselfquery',
            component: staffMyselfquery,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'myselfquery',
                title: '个人信息查询'
            }
        },
        {
            path: 'myselfupdate',
            name: 'adminMyselfupdate',
            component: staffMyselfupdate,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'myselfupdate',
                title: '个人信息修改'
            }
        },
        {
            path: 'passupdate',
            name: 'adminPassupdate',
            component: staffPassupdate,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'passupdate',
                title: '修改密码'
            }
        },
        {
            path: 'salesmanlist',
            name: 'adminSalesmanlist',
            component: Salesmanlist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'salesmanlist',
                title: '售货员信息列表'
            }
        },
        {
            path: 'addsalesman',
            name: 'adminAddsalesman',
            component: Addsalesman,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'addsalesman',
                title: '添加售货员信息'
            }
        },
        {
            path: 'viplist',
            name: 'adminViplist',
            component: Viplist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'viplist',
                title: '会员信息列表'
            }
        },
        {
            path: 'addvip',
            name: 'adminAddvip',
            component: Addvip,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'addvip',
                title: '添加会员信息'
            }
        },
        {
            path: 'supplierlist',
            name: 'adminSupplierlist',
            component: Supplierlist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'supplierlist',
                title: '供应商信息列表'
            }
        },
        {
            path: 'addsupplier',
            name: 'adminAddsupplier',
            component: AddSupplier,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'addsupplier',
                title: '添加供应商信息'
            }
        },
        {
            path: 'enterstocklist',
            name: 'adminEnterstocklist',
            component: Enterstocklist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'enterstocklist',
                title: '进货信息列表'
            }
        },
        {
            path: 'addenterstock',
            name: 'adminAddenterstock',
            component: Addenterstock,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'addenterstock',
                title: '添加进货信息'
            }
        },
        {
            path: 'categorylist',
            name: 'adminCategorylist',
            component: Categorylist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'categorylist',
                title: '商品类别信息列表'
            }
        },
        {
            path: 'warehouselist',
            name: 'adminWarehouselist',
            component: Warehouselist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'warehouselist',
                title: '仓库信息列表'
            }
        },
        {
            path: 'r_goodslist',
            name: 'adminR_goodslist',
            component: Returngoodslist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'r_goodslist',
                title: '退货信息列表'
            }
        }, {
            path: 'addr_goods',
            name: 'adminAddr_goods',
            component: Addreturngoods,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'addr_goods',
                title: '添加退货信息'
            }
        },
        {
            path: 'outstocklist',
            name: 'adminOutstocklist',
            component: Outstocklist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'outstocklist',
                title: '出货信息列表'
            }
        },
        {
            path: 'addoutstock',
            name: 'adminAddoutstock',
            component: Addoutstock,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'addoutstock',
                title: '添加出货信息'
            }
        },
        {
            path: 'stocklist',
            name: 'adminStocklist',
            component: Stocklist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'stocklist',
                title: '库存信息列表'
            }
        },
        {
            path: 'orderlist',
            name: 'adminOrderlist',
            component: orderlist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'orderlist',
                title: '订单信息列表'
            }
        },
        {
            path: 'userinfquery', //对应数据库的path
            name: 'adminUserinf',
            component: userinfquery,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'userinfquery',
                title: '账号信息查询'
            }
        },
        {
            path: 'userinfupdate', //对应数据库的path
            name: 'adminUserinfupdate',
            component: userinfupdate,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'userinfupdate',
                title: '账号信息查询'
            }
        },
        {
            path: 'goodslist_c',
            name: 'superGoodslist',
            component: Goodslist_c,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'goodslist_c',
                title: '各类商品管理'
            }
        },
        {
            path: 'shelveslist',
            name: 'adminShelveslist',
            component: Shelveslist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'shelveslist',
                title: '货架信息列表'
            }
        },
        {
            path: 'goodsM',
            name: 'adminGoodsM',
            component: goodsM,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'goodsM',
                title: '商品信息列表'
            }
        },
        {
            path: 'onshelveslist',
            name: 'adminOnshelveslist',
            component: Onshelveslist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'onshelveslist',
                title: '上架商品列表'
            }
        },
        {
            path: 'addonshelves',
            name: 'adminAddonshelves',
            component: Addonshelves,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'addonshelves',
                title: '添加上架商品'
            }
        },
        {
            path: 'downshelveslist',
            name: 'adminDownshelveslist',
            component: Downshelveslist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'downshelveslist',
                title: '下架商品列表'
            }
        },
        {
            path: 'adddownshelves',
            name: 'adminAdddownshelves',
            component: Adddownshelves,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'adddownshelves',
                title: '添加下架商品'
            }
        },
        {
            path: 'salelist',
            name: 'adminSalelist',
            component: Salelist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'salelist',
                title: '销售信息列表'
            }
        },
        {
            path: 'addsale',
            name: 'adminAddsale',
            component: Addsale,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'addsale',
                title: '添加销售信息'
            }
        },
        {
            path: 'rootlist',
            name: 'adminSuperrootlist',
            component: Superrootlist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'rootlist',
                title: '权限列表'
            }
        },
        {
            path: 'datareport',
            name: 'adminDatareport',
            component: Datareport,
            meta: { //路由元信息
                requiresAuth: true,
                role: '管理员',
                name: 'datareport',
                title: '数据报表'
            }
        }
        ]
    },

    {
        path: '/salehome/:id',
        name: 'salesmanHome',
        component: Salesmanhome,
        meta: { //路由元信息
            requiresAuth: true,
            role: '售货员'
        },
        redirect: '/salehome/:id/welcome',
        children: [{
            path: 'welcome',
            name: 'salesmanWelcome',
            component: Welcome,
            meta: { //路由元信息
                requiresAuth: true, //需要用户权限的路由
                role: '售货员', //用户角色
                name: 'welcome',
                title: '首页',
            }
        },
        {
            path: 'myselfquery',
            name: 'salesmanMyselfquery',
            component: staffMyselfquery,
            meta: { //路由元信息
                requiresAuth: true,
                role: '售货员',
                name: 'myselfquery',
                title: '个人信息查询'
            }
        },
        {
            path: 'myselfupdate',
            name: 'salesmanMyselfupdate',
            component: staffMyselfupdate,
            meta: { //路由元信息
                requiresAuth: true,
                role: '售货员',
                name: 'myselfupdate',
                title: '个人信息修改'
            }
        },
        {
            path: 'passupdate',
            name: 'salesmanPassupdate',
            component: staffPassupdate,
            meta: { //路由元信息
                requiresAuth: true,
                role: '售货员',
                name: 'passupdate',
                title: '修改密码'
            }
        },
        {
            path: 'viplist',
            name: 'salesmanViplist',
            component: Viplist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '售货员',
                name: 'viplist',
                title: '会员信息列表'
            }
        },
        {
            path: 'addvip',
            name: 'salesmanAddvip',
            component: Addvip,
            meta: { //路由元信息
                requiresAuth: true,
                role: '售货员',
                name: 'addvip',
                title: '添加会员信息'
            }
        },
        {
            path: 'orderlist',
            name: 'salesmanOrderlist',
            component: orderlist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '售货员',
                name: 'orderlist',
                title: '商品信息列表'
            }
        },
        {
            path: 'shelveslist',
            name: 'salesmanShelveslist',
            component: Shelveslist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '售货员',
                name: 'shelveslist',
                title: '货架信息列表'
            }
        },

        {
            path: 'onshelveslist',
            name: 'salesmanOnshelveslist',
            component: Onshelveslist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '售货员',
                name: 'onshelveslist',
                title: '上架商品列表'
            }
        }, {
            path: 'addonshelves',
            name: 'salesmanAddonshelves',
            component: Addonshelves,
            meta: { //路由元信息
                requiresAuth: true,
                role: '售货员',
                name: 'addonshelves',
                title: '添加上架商品'
            }
        }, {
            path: 'downshelveslist',
            name: 'salesmanDownshelveslist',
            component: Downshelveslist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '售货员',
                name: 'downshelveslist',
                title: '下架商品列表'
            }
        }, {
            path: 'adddownshelves',
            name: 'salesmanAdddownshelves',
            component: Adddownshelves,
            meta: { //路由元信息
                requiresAuth: true,
                role: '售货员',
                name: 'adddownshelves',
                title: '添加下架商品'
            }
        }, {
            path: 'salelist',
            name: 'salesmanSalelist',
            component: Salelist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '售货员',
                name: 'salelist',
                title: '销售信息列表'
            }
        }, {
            path: 'addsale',
            name: 'salesmanAddsale',
            component: Addsale,
            meta: { //路由元信息
                requiresAuth: true,
                role: '售货员',
                name: 'addsale',
                title: '添加销售信息'
            }
        }, {
            path: 'rootlist',
            name: 'salesmanSuperrootlist',
            component: Superrootlist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '售货员',
                name: 'rootlist',
                title: '权限列表'
            }
        }
        ]
    },

    {
        path: '/viphome/:id',
        name: 'vipHome',
        component: Viphome,
        meta: { //路由元信息
            requiresAuth: true,
            role: '会员'
        },
        redirect: '/viphome/:id/welcome',
        children: [{
            path: 'welcome',
            name: 'vipWelcome',
            component: Welcome,
            meta: { //路由元信息
                requiresAuth: true, //需要用户权限的路由
                role: '会员', //用户角色
                name: 'welcome',
                title: '首页',
            }
        },
        {
            path: 'myselfquery',
            name: 'vipMyselfquery',
            component: vipMyselfquery,
            meta: { //路由元信息
                requiresAuth: true,
                role: '会员',
                name: 'myselfquery',
                title: '个人信息查询'
            }
        },
        {
            path: 'myselfupdate',
            name: 'vipMyselfupdate',
            component: vipMyselfupdate,
            meta: { //路由元信息
                requiresAuth: true,
                role: '会员',
                name: 'myselfupdate',
                title: '个人信息修改'
            }
        },
        {
            path: 'passupdate',
            name: 'vipPassupdate',
            component: vipPassupdate,
            meta: { //路由元信息
                requiresAuth: true,
                role: '会员',
                name: 'passupdate',
                title: '修改密码'
            }
        },
        {
            path: 'exitvip',
            name: 'exitVip',
            component: Exitvip,
            meta: { //路由元信息
                requiresAuth: true,
                role: '会员',
                name: 'exitvip',
                title: '申请退出会员'
            }
        },
        {
            path: 'rootlist',
            name: 'vipRootlist',
            component: Viprootlist,
            meta: { //路由元信息
                requiresAuth: true,
                role: '会员',
                name: 'rootlist',
                title: '权限列表'
            }
        }

        ]
    }
    ],
})

//全局路由守卫
router.beforeEach((to, from, next) => {
    //设置标题
    document.title = to.meta.title
    if (to.meta.requiresAuth) { //需要用户权限
        if (to.meta.role === '超级管理员') { //用来判断获取哪个角色的token并校验
            let superAdminAuthorization = localStorage.getItem('superAdminAuthorization') //获取管理员保存在本地的token
            if (superAdminAuthorization) {
                //登录则放行
                next();

                //发送校验请求
                router.app.$http.get('/superAdminverify', {
                    headers: { //请求头
                        superAdminAuthorization
                    }
                }).then(({ data }) => {
                    // console.log('校验结果', data)
                    if (data.status === 0) {
                        next('/login')
                        Message.warning('请重新登录')
                    }
                })
            } else {
                //否则返回登录界面
                next('/login')
                Message.warning('请重新登录')
            }
        } else if (to.meta.role === '管理员') {
            let adminAuthorization = localStorage.getItem('adminAuthorization') //获取管理员保存在本地的token
            if (adminAuthorization) {
                //登录则放行
                next();

                //发送校验请求
                router.app.$http.get('/adminverify', {
                    headers: { //请求头
                        adminAuthorization
                    }
                }).then(({ data }) => {
                    // console.log('校验结果', data)
                    if (data.status === 0) {
                        next('/login')
                        Message.warning('请重新登录')
                    }
                })
            } else {
                //否则返回登录界面
                next('/login')
                Message.warning('请重新登录')
            }
        } else if (to.meta.role === '售货员') {
            let saleAuthorization = localStorage.getItem('saleAuthorization') //获取售货员保存在本地的token
            if (saleAuthorization) {
                //登录则放行
                next();

                //发送校验请求
                router.app.$http.get('/saleverify', {
                    headers: { //请求头
                        saleAuthorization
                    }
                }).then(({ data }) => {
                    // console.log('校验结果', data)
                    if (data.status === 0) {
                        next('/login')
                        Message.warning('请重新登录')
                    }
                })
            } else {
                //否则返回登录界面
                next('/login')
                Message.warning('请重新登录')
            }
        } else if (to.meta.role === '会员') {
            let vipAuthorization = localStorage.getItem('vipAuthorization') //获取会员保存在本地的token
            if (vipAuthorization) {
                //登录则放行
                next();

                //发送校验请求
                router.app.$http.get('/vipverify', {
                    headers: { //请求头
                        vipAuthorization
                    }
                }).then(({ data }) => {
                    // console.log('校验结果', data)
                    if (data.status === 0) {
                        next('/login')
                        Message.warning('请重新登录')
                    }
                })
            } else {
                //否则返回登录界面
                next('/login')
                Message.warning('请重新登录')
            }
        }
    } else {
        next()
    }
})

//解决tag导航页多次点击会报错问题
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}

export default router