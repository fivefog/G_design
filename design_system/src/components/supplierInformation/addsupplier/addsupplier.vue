<template>
<!-- 添加供应商信息 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>供应商信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加供应商信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="add-card">
        <!-- 页头区域 -->
        <el-page-header @back="goBack" content="添加供应商信息">
        </el-page-header>
        <!-- 添加供应商信息表单 -->
        <el-form label-position="right" label-width="80px" :model="addSupplierForm" :rules="addSupplierRules" ref="addSupplierRef" status-icon>
            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="供应商编号" prop="s_id">
                        <el-input v-model="addSupplierForm.s_id" class="addsupplier_input" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="公司名称" prop="s_name">
                        <el-input v-model="addSupplierForm.s_name" placeholder="请输入公司名称" clearable class="addsupplier_input"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="负责人姓名" prop="s_contact">
                        <el-input v-model="addSupplierForm.s_contact" placeholder="请输入负责人姓名" clearable class="addsupplier_input"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="邮箱" prop="s_email">
                        <el-input v-model="addSupplierForm.s_email" placeholder="请输入邮箱地址" clearable class="addsupplier_input"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="联系电话" prop="s_phone">
                        <el-input v-model.number="addSupplierForm.s_phone" placeholder="请输入联系电话" clearable class="addsupplier_input"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="公司地区" prop="s_area">
                        <el-cascader size="large" :options="options" v-model="selectedArea" @change="handleAreaChange" clearable class="addsupplier_input">
                        </el-cascader>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="详细地址" prop="s_adress">
                        <el-input v-model="addSupplierForm.s_adress" placeholder="请输入详细地址" clearable class="addsupplier_input"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>

        <el-row class="btn">
            <!-- 添加按钮 -->
            <el-col :span="2.5" :offset="7">
                <el-button type="primary" round @click="addSupplier" v-preventReClick>添加</el-button>
            </el-col>
            <!-- 更换供应商编号按钮 -->
            <el-col :span="2" :offset="1">
                <el-button type="info" round @click="updateS_id" class="updateS_id" v-preventReClick>更换供应商编号</el-button>
            </el-col>
            <!-- 重置按钮 -->
            <el-col :span="1" :offset="1" class="resetbtn">
                <el-button type="success" round @click="resetAddSupplier" v-preventReClick>重置</el-button>
            </el-col>
        </el-row>
    </el-card>

</div>
</template>

<script>
import './addsupplier.css'
import addsupplier from './addsupplier'
export default addsupplier
</script>
