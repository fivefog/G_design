<template>
<!-- 添加退货信息 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>退货管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加退货信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="add-card">
        <!-- 页头区域 -->
        <el-page-header @back="goBack" content="添加退货信息">
        </el-page-header>
        <!-- 添加退货信息表单 -->
        <el-form label-position="right" label-width="80px" :model="addR_goodsForm" :rules="addR_goodsRules" ref="addR_goodsRef" status-icon>
            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item class="addr_goods_input" label="退货单号" prop="r_id">
                        <el-input v-model="addR_goodsForm.r_id" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品编号" prop="g_id">
                        <el-select class="addr_goods_input" v-model="addR_goodsForm.g_id" filterable placeholder="请选择商品编号" clearable @clear="clearGoodData">
                            <el-option v-for="item in g_iddata" :key="item.g_id" :value="item.g_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="供应商编号" prop="s_id">
                        <el-select class="addr_goods_input" v-model="addR_goodsForm.s_id" filterable placeholder="请选择供应商编号" clearable>
                            <el-option v-for="(item,index) in s_iddata" :key="index" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品名称" prop="g_name">
                        <el-input class="addr_goods_input" v-model="addR_goodsForm.g_name" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品图片" prop="g_imgurl">
                        <el-upload class="addr_goods_input" ref="uploadRef" :action="goodsAction" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-error="handleError" :on-exceed="handleExceed" :limit="1" :headers="headers">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisibleAdd">
                            <img width="100%" :src="addR_goodsForm.g_imgurl" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品规格" prop="g_unit">
                        <el-input class="addr_goods_input" v-model="addR_goodsForm.g_unit" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

              <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品类别" prop="c_name">
                        <el-input class="addr_goods_input" v-model="addR_goodsForm.c_name" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品进价" prop="e_price">
                     <el-select class="addr_goods_input" v-model="addR_goodsForm.e_price" filterable placeholder="请选择商品进价" clearable>
                            <el-option v-for="(item,index) in e_pricedata" :key="index" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="退货数量" prop="r_num">
                        <el-input class="addr_goods_input" v-model="addR_goodsForm.r_num" placeholder="请输入退货数量" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="备注">
                        <el-input class="addr_goods_input" v-model="addR_goodsForm.r_note" placeholder="请输入备注" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-row class="btn">
            <!-- 添加按钮 -->
            <el-col :span="2.5" :offset="7">
                <el-button type="primary" round @click="addR_goods" v-preventReClick>添加</el-button>
            </el-col>
            <!-- 更换退货单号按钮 -->
            <el-col :span="2" :offset="1">
                <el-button type="info" round @click="updateR_id" class="updateOtherIdbtn" v-preventReClick>更换退货单号</el-button>
            </el-col>
            <!-- 重置按钮 -->
            <el-col :span="1" :offset="1" class="resetbtn">
                <el-button type="success" round @click="resetAddR_goods" v-preventReClick>重置</el-button>
            </el-col>
        </el-row>
    </el-card>

</div>
</template>

<script>
import './addr_goods.css'
import addr_goods from './addr_goods'
export default addr_goods
</script>
