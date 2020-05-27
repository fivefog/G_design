<template>
<!-- 添加售货员信息 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>售货员信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加售货员信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="add-card">
        <!-- 页头区域 -->
        <el-page-header @back="goBack" content="添加售货员信息">
        </el-page-header>
        <!-- 添加售货员信息表单 -->
        <el-form label-position="right" label-width="80px" :model="addSalesmanForm" :rules="addSalesmanRules" ref="addSalesmanRef" status-icon>
            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="员工号" prop="s_id">
                        <el-input v-model="addSalesmanForm.s_id" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addSalesmanForm.username" placeholder="请输入用户名" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="addSalesmanForm.name" placeholder="请输入姓名" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="登录密码" prop="password">
                        <el-input v-model="addSalesmanForm.password" show-password placeholder="请输入密码" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="性别" prop="sex">
                        <el-select v-model="addSalesmanForm.sex" placeholder="请选择性别" clearable>
                            <el-option v-for="item in sex" :key="item.value" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="年龄" prop="age">
                        <el-input v-model.number="addSalesmanForm.age" placeholder="请输入年龄" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="学历" prop="xueli">
                        <el-select v-model="addSalesmanForm.xueli" placeholder="请选择学历" clearable>
                            <el-option v-for="item in xueli" :key="item.value" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addSalesmanForm.email" placeholder="请输入邮箱地址" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model.number="addSalesmanForm.phone" placeholder="请输入手机号" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-row class="btn">
            <!-- 添加按钮 -->
            <el-col :span="2.5" :offset="7">
                <el-button type="primary" round @click="addSalesman" v-preventReClick>添加</el-button>
            </el-col>
            <!-- 更换员工号按钮 -->
            <el-col :span="2" :offset="1">
                <el-button type="info" round @click="updateS_id" class="updateIdbtn" v-preventReClick>更换员工号</el-button>
            </el-col>
            <!-- 重置按钮 -->
            <el-col :span="1" :offset="1" class="resetbtn">
                <el-button type="success" round @click="resetAddSalesman" v-preventReClick>重置</el-button>
            </el-col>
        </el-row>
    </el-card>

</div>
</template>

<script>
import addSalesman from './addsalesman'
export default addSalesman
</script>
