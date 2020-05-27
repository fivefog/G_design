<template>
<!-- 个人信息修改(会员) -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息修改</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
        <!-- 个人信息修改表单 -->
        <el-form label-position="right" label-width="80px" :model="myselfForm" :rules="updateRules" ref="updateRef" status-icon>
            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="myselfForm.username" placeholder="请输入用户名" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="myselfForm.name" placeholder="请输入姓名" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="性别" prop="sex">
                        <el-select v-model="myselfForm.sex" placeholder="请选择性别" clearable>
                            <el-option v-for="item in sex" :key="item.value" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="myselfForm.email" placeholder="请输入邮箱地址" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model.number="myselfForm.phone" placeholder="请输入手机号" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-row class="btn">
            <!-- 修改按钮 -->
            <el-col :span="4" :offset="8" class="updatebtn">
                <el-button type="primary" round @click="myselfUpdate" v-preventReClick>修改</el-button>
            </el-col>

            <!-- 取消按钮 -->
            <el-col :span="1" class="cancelbtn">
                <el-button type="success" round @click="cancelUpdate" v-preventReClick>取消</el-button>
            </el-col>
        </el-row>
    </el-card>
</div>
</template>

<script>
import './myselfUpdate.css'
import myselfUpdate from './myselfUpdate'
export default myselfUpdate
</script>
