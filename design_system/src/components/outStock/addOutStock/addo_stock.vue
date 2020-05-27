<template>
<!-- 添加出货信息 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>出货管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加出货信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="add-card">
        <!-- 页头区域 -->
        <el-page-header @back="goBack" content="添加出货信息">
        </el-page-header>
        <!-- 添加出货信息表单 -->
        <el-form label-position="right" label-width="80px" :model="addO_stockForm" :rules="addO_stockRules" ref="addO_stockRef" status-icon>
            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item class="addo_stock_input" label="出货单号" prop="o_id">
                        <el-input v-model="addO_stockForm.o_id" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品编号" prop="g_id">
                        <el-select class="addo_stock_input" v-model="addO_stockForm.g_id" filterable placeholder="请选择商品编号" clearable @clear="clearGoodData">
                            <el-option v-for="item in g_iddata" :key="item.g_id" :value="item.g_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品名称" prop="g_name">
                        <el-input class="addo_stock_input" v-model="addO_stockForm.g_name" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品图片" prop="g_imgurl">
                        <el-upload class="addo_stock_input" ref="uploadRef" :action="goodsAction" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-error="handleError" :on-exceed="handleExceed" :limit="1" :headers="headers">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisibleAdd">
                            <img width="100%" :src="addO_stockForm.g_imgurl" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品规格" prop="g_unit">
                        <el-input class="addo_stock_input" v-model="addO_stockForm.g_unit" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品类别" prop="c_name">
                        <el-input class="addo_stock_input" v-model="addO_stockForm.c_name" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品预售价" prop="o_price">
                        <el-input class="addo_stock_input" v-model="addO_stockForm.o_price" placeholder="请输入商品预售价" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="出货数量" prop="o_num">
                        <el-input class="addo_stock_input" v-model="addO_stockForm.o_num" placeholder="请输入出货数量" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="备注">
                        <el-input class="addo_stock_input" v-model="addO_stockForm.o_note" placeholder="请输入备注" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-row class="btn">
            <!-- 添加按钮 -->
            <el-col :span="2.5" :offset="7">
                <el-button type="primary" round @click="addO_stock" v-preventReClick>添加</el-button>
            </el-col>
            <!-- 更换出货单号按钮 -->
            <el-col :span="2" :offset="1">
                <el-button type="info" round @click="updateO_id" class="updateOtherIdbtn" v-preventReClick>更换出货单号</el-button>
            </el-col>
            <!-- 重置按钮 -->
            <el-col :span="1" :offset="1" class="resetbtn">
                <el-button type="success" round @click="resetAddO_stock" v-preventReClick>重置</el-button>
            </el-col>
        </el-row>
    </el-card>

</div>
</template>

<script>
import './addo_stock.css'
import addo_stock from './addo_stock'
export default addo_stock
</script>
