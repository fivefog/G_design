<template>
<!-- 售货员首页 -->
<div>
    <el-container style="height: 100vh; border: 1px solid #eee" class="el-container">
        <el-aside :width="asideWidth">

            <el-menu unique-opened background-color="#324057" text-color="#BFCBD9" router active-text-color="#2696FF" @select="handSelect" :default-active="$route.meta.name" :collapse="isCollapse" :collapse-transition="false">
                <!-- <el-menu-item index="welcome">
                    <i class="el-icon-s-home"></i>
                    <span slot="title" class="submenu-span">首页</span>
                </el-menu-item> -->
                <el-submenu :index="item1.f_id" v-for="item1 in menulist" :key="item1.id">
                    <!-- 一级菜单 -->
                    <template slot="title">
                        <i :class="item1.icon"></i>
                        <span class="submenu-span">{{item1.name}}</span>
                    </template>

                    <!-- 二级菜单 -->
                    <el-menu-item :index="item2.path" v-for="item2 in item1.children" :key="item2.id" class="menu-item">
                        <i :class="item2.icon"></i>
                        <span>{{item2.name}}</span>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        
        <el-container>
            <el-header style="text-align: right; font-size: 12px" class="home--header">
            <!-- 图标控制导航栏扩展与收缩 -->
                <span class="iscollapse" @click="setcollapse">
                    <i class="el-icon-s-unfold" v-if="isCollapse===false"></i>
                    <i class="el-icon-s-fold" v-else-if="isCollapse===true"></i>
                </span>

                <a class="shoptitle">熊猫优选管理系统</a>
                <a v-if="myselfdata.sex==='男'">欢迎您: {{myselfdata.role}} {{myselfdata.name}}先生</a>
                <a v-else-if="myselfdata.sex==='女'">欢迎您: {{myselfdata.role}} {{myselfdata.name}}女士</a>

                <el-dropdown @command="handleCommand">
                    <!-- 头像 -->
                      <span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-huabanfuben" v-if="myselfdata.sex==='男'"></use>
                            <use xlink:href="#icon-huabanfuben1" v-else-if="myselfdata.sex==='女'"></use>
                        </svg>
                    </span>

                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="myInformation">个人信息</el-dropdown-item>
                        <el-dropdown-item command="passwordUpdate">修改密码</el-dropdown-item>
                        <el-dropdown-item command="loginOut">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>

            <el-main>
                <div class="taghome">
                    <el-tag v-for="item in tags" :key="item.name" :type="item.type" closable @click="tabChange(item)" @close="handleClose(item)" disable-transitions effect="dark">
                        {{item.name}}
                    </el-tag>
                </div>
                <keep-alive include="myselfUpdate,passUpdate,addvip,addsupplier,addonshelves,adddownshelves,addsale">
                    <router-view />
                </keep-alive>
            </el-main>
        </el-container>
    </el-container>

</div>
</template>

<script>
//引入js文件
import salesmanHome from './salesmanHome'
export default salesmanHome;
</script>
