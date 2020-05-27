<template>
<!-- 添加会员信息 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>会员信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加会员信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="add-card">
        <!-- 页头区域 -->
        <el-page-header @back="goBack" content="添加会员信息">
        </el-page-header>
        <!-- 添加会员信息表单 -->
        <el-form label-position="right" label-width="80px" :model="addVipForm" :rules="addVipRules" ref="addVipRef" status-icon>
            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="会员号" prop="v_id">
                        <el-input v-model="addVipForm.v_id" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addVipForm.username" placeholder="请输入用户名" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="addVipForm.name" placeholder="请输入姓名" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="登录密码" prop="password">
                        <el-input v-model="addVipForm.password" show-password placeholder="请输入密码" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="性别" prop="sex">
                        <el-select v-model="addVipForm.sex" placeholder="请选择性别" clearable>
                            <el-option v-for="item in sex" :key="item.value" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addVipForm.email" placeholder="请输入邮箱地址" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model.number="addVipForm.phone" placeholder="请输入手机号" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-row class="btn">
            <!-- 添加按钮 -->
            <el-col :span="2.5" :offset="7">
                <el-button type="primary" round @click="addVip" v-preventReClick>添加</el-button>
            </el-col>
            <!-- 更换会员号按钮 -->
            <el-col :span="2" :offset="1">
                <el-button type="info" round @click="updateV_id" class="updateIdbtn" v-preventReClick>更换会员号</el-button>
            </el-col>
            <!-- 重置按钮 -->
            <el-col :span="1" :offset="1" class="resetbtn">
                <el-button type="success" round @click="resetAddVip" v-preventReClick>重置</el-button>
            </el-col>
        </el-row>
    </el-card>

</div>
</template>

<script>
import addvip from './addvip'
export default addvip
</script>
