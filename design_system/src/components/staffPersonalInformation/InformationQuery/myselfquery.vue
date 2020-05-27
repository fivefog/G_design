<template>
<!-- 个人信息查询(超级管理员、管理员或售货员) -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <!-- <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item>个人信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息查询</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
        <!-- 个人信息表格区域-->
        <el-table :data="myselfdata" style="width: 100%" border stripe>
            <el-table-column prop="s_id" label="员工号" width="105">
            </el-table-column>

            <el-table-column prop="username" label="用户名" width="110">
            </el-table-column>

            <el-table-column prop="name" label="姓名" width="110">
            </el-table-column>

            <el-table-column prop="password" label="登录密码" width="100">
            </el-table-column>

            <el-table-column prop="role" label="角色" width="100">
            </el-table-column>

            <el-table-column prop="sex" label="性别" width="70">
            </el-table-column>

            <el-table-column prop="age" label="年龄" width="70">
            </el-table-column>

            <el-table-column prop="xueli" label="学历" width="70">
            </el-table-column>

            <el-table-column prop="email" label="邮箱" width="175" show-overflow-tooltip >
            </el-table-column>

            <el-table-column prop="phone" label="手机号" width="150">
            </el-table-column>

            <el-table-column label="创建时间">
                <!-- 
                    如果单元的内容不是文本 需要给该内容外层加容器template
                    template内部要用数据 设置slot-scope属性
                该属性的值是要用数据createtime的数据源

                slot-scope的值scope其实就是el-table绑定的数据
                scope.row->数组中的每个对象
                 -->
                <template slot-scope="scope">
                    <!-- 处理日期 格式-->
                    {{scope.row.createtime | fmtdata}}
                </template>
            </el-table-column>

        </el-table>

    </el-card>
</div>
</template>

<script>
import Query from './myselfquery'
export default Query
</script>
