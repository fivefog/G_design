<template>
<!-- 修改密码(会员) -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
        <!-- 修改密码表单 -->
        <el-form label-position="right" label-width="80px" :model="passForm" :rules="passUpdateRules" ref="passUpdateRef" status-icon>
            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="原密码">
                        <el-input v-model="passForm.oldPassword" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="新密码" prop="newPassword" ref="newPassRef">
                        <el-input v-model="passForm.newPassword" show-password placeholder="请输入新密码" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="确认密码" prop="checkPassword" ref="checkPassRef">
                        <el-input v-model="passForm.checkPassword" show-password placeholder="请再次输入新密码" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row class="btn">
                <!-- 修改按钮 -->
                <el-col :span="4" :offset="8" class="updatebtn">
                    <el-button type="primary" round @click="passUpdate" v-preventReClick>修改</el-button>
                </el-col>

                <!-- 重置按钮 -->
                <el-col :span="1" class="passResetbtn">
                    <el-button type="success" round @click="resetupdate" v-preventReClick>重置</el-button>
                </el-col>
            </el-row>
        </el-form>

    </el-card>
</div>
</template>

<script>
import passUpdate from './passUpdate'
export default passUpdate
</script>
