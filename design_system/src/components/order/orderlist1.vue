<template>
<!-- 商品信息列表 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单信息列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
        <el-row :gutter="12" class="box-searchRow">
            <el-col :span="1.1" class="condition">
                <span>条件查询:</span>
            </el-col>
            
            <el-col :span="3">
                <el-select v-model="query.filters" placeholder="请选择条件" clearable>
                    <el-option v-for="item in filters" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="8">
                <el-input placeholder="请输入您要查询的内容" v-model="query.search" clearable @clear="getGoodsList">
                    <el-button slot="append" icon="el-icon-search" @click="search" v-preventReClick>查询</el-button>
                </el-input>
            </el-col>

        </el-row>

        <!-- 商品信息表格区域-->
        <el-table :data="goodsList" height="335" style="width: 100%" border stripe class="box-table">
            <!-- <el-table-column type="index" label="#" width="60">
            </el-table-column> -->
            <el-table-column prop="order_id" label="订单号" width="90" show-overflow-tooltip fixed>
            </el-table-column>

            <el-table-column prop="g_id" label="商品编号" width="100" show-overflow-tooltip >
            </el-table-column>

            <el-table-column prop="g_name" label="商品名称" width="100" show-overflow-tooltip>
            </el-table-column>

            <!-- <el-table-column label="商品图片" width="145">
                <template slot-scope="scope">
                    <img :src="scope.row.g_imgurl" width="100" height="100">
                </template>
            </el-table-column> -->

            <el-table-column  label="商品信息" width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                    <img :src="scope.row.g_imgurl" width="100" height="100">
                </template>
            </el-table-column>

            <el-table-column prop="c_name" label="商品类别" width="100" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="g_price" label="商品售价/元" width="120" show-overflow-tooltip>
            </el-table-column>


            <el-table-column prop="un_num" label="未上架数量" width="100" show-overflow-tooltip>
            </el-table-column>

          

        </el-table>

        <!-- 分页区域 -->
        <el-pagination @size-change="pagesizeChange" @current-change="pagenumChange" :current-page="this.query.pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="this.query.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="this.query.total" background>
        </el-pagination>
    </el-card>
</div>
</template>

<script>
import orderlist from './orderlist'
export default orderlist
</script>
