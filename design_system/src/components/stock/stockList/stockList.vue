<template>
<!-- 库存信息列表 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>库存信息列表</el-breadcrumb-item>
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
                <el-input placeholder="请输入您要查询的内容" v-model="query.search" clearable @clear="getStockList">
                    <el-button slot="append" icon="el-icon-search" @click="search" v-preventReClick>查询</el-button>
                </el-input>
            </el-col>

            <el-col :span="2.5">
                <div class="stock">
                    <span>库存预警值：</span>
                    <el-input-number v-model="newStockwaring" :step="10" :min="0" size="medium"></el-input-number>
                    <el-button type="primary" @click="multEditS_Waring" :disabled="disabled" v-preventReClick>批量修改</el-button>
                </div>
            </el-col>
        </el-row>

        <!-- 库存信息表格区域-->
        <el-table :data="stockList" height="335" style="width: 100%" border stripe class="box-table" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40">
            </el-table-column>

            <el-table-column type="index" label="#" width="40">
            </el-table-column>

            <el-table-column prop="g_id" label="商品编号" width="130" show-overflow-tooltip fixed>
            </el-table-column>

            <el-table-column prop="g_name" label="商品名称" width="130" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="商品图片" width="135">
                <template slot-scope="scope">
                    <img :src="scope.row.g_imgurl" width="110" height="110">
                </template>
            </el-table-column>

            <el-table-column prop="g_unit" label="商品规格" width="120" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="c_name" label="商品类别" width="100" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="e_num" label="进货数量" width="80" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="o_num" label="出货数量" width="80" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="stocknum" label="库存数量" width="80" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="库存预警值" width="152">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.stockwaring" @change="handleS_waringChange(scope.row.g_id,scope.row.stockwaring)" :step="10" :min="0" size="small"></el-input-number>
                </template>
            </el-table-column>

            <el-table-column label="库存状态">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark" v-if="scope.row.stockstate==='库存充足'">库存充足</el-tag>
                    <el-tag type="warning" effect="dark" v-else-if="scope.row.stockstate==='库存不足'">库存不足</el-tag>
                    <el-tag type="danger" effect="dark" v-else-if="scope.row.stockstate==='无库存'">无库存</el-tag>
                    <el-tag type="danger" effect="dark" v-else-if="scope.row.stockstate==='库存负数'">库存负数</el-tag>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination @size-change="pagesizeChange" @current-change="pagenumChange" :current-page="this.query.pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="this.query.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="this.query.total" background>
        </el-pagination>
    </el-card>
</div>
</template>

<script>
import './stockList.css'
import stockist from './stockList'
export default stockist
</script>
