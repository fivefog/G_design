<template>
<!-- 数据报表 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
        <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
        <div id="main" class="echarts"></div>
        <div id="main1" class="echarts1"></div>
    </el-card>
</div>
</template>

<script>
import './datareport.css'
import datareport from './datareport'
export default datareport
</script>
