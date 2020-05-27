<template>
<!-- 申请退出会员-->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>身份管理</el-breadcrumb-item>
        <el-breadcrumb-item>申请退出会员</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
        <!-- 申请退出会员表单 -->
        <el-form label-position="right" label-width="80px" :model="exitVipForm" status-icon>
            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="会员号">
                        <el-input v-model.number="exitVipForm.v_id" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="姓名">
                        <el-input v-model="exitVipForm.name" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="性别">
                        <el-input v-model="exitVipForm.sex" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="会员状态">
                        <el-input v-model="exitVipForm.state" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-row class="btn">
            <!-- 申请退出按钮 -->
            <el-col :span="4" :offset="8">
                <el-button v-if="exitVipForm.state==='正常'" type="primary" round @click="exitVip" v-preventReClick>申请退出</el-button>
                <el-button v-else-if="exitVipForm.state==='申请退出中'" type="primary" round disabled>申请退出</el-button>
            </el-col>

            <!-- 取消申请按钮 -->
            <el-col :span="1" class="recovervipbtn">
                <el-button v-if="exitVipForm.state==='申请退出中'" type="success" round @click="recoverVip" v-preventReClick>取消申请</el-button>
                <el-button v-else-if="exitVipForm.state==='正常'" type="success" round disabled>取消申请</el-button>
            </el-col>
        </el-row>
    </el-card>
</div>
</template>

<script>
import './exitvip.css'
import exitvip from './exitvip'
export default exitvip
</script>
