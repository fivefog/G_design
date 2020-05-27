<template>
<!-- 权限列表(管理员)-->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
        <!-- 权限列表表格区域-->
        <el-table :data="superList" height="409" style="width: 100%" border stripe class="menu-table">
            <el-table-column type="index" label="#" width="80">
            </el-table-column>

            <el-table-column prop="f_id" label="权限编号" width="200">
            </el-table-column>

            <el-table-column prop="name" label="权限名称" width="200">
            </el-table-column>

            <el-table-column label="权限路径" width="200">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.path===''||scope.row.path===null">无</el-tag>
                    <span v-else>{{scope.row.path}}</span>
                </template>
            </el-table-column>

            <el-table-column label="权限等级">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level===0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level===1">二级</el-tag>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination @size-change="pagesizeChange" @current-change="pagenumChange" :current-page="this.query.pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="this.query.paesize" layout="total, sizes, prev, pager, next, jumper" :total="this.query.total" background>
        </el-pagination>
    </el-card>
</div>
</template>

<script>
import adminrolelist from './adminrolelist'
export default adminrolelist
</script>
