<template>
<!-- 添加进货信息 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>进货管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加进货信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="add-card">
        <!-- 页头区域 -->
        <el-page-header @back="goBack" content="添加进货信息">
        </el-page-header>
        <!-- 添加进货信息表单 -->
        <el-form label-position="right" label-width="80px" :model="addE_stockForm" :rules="addE_stockRules" ref="addE_stockRef" status-icon>
            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item class="adde_stock_input" label="进货单号" prop="e_id">
                        <el-input v-model="addE_stockForm.e_id" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品编号" prop="g_id">
                        <el-input class="adde_stock_input" v-model="addE_stockForm.g_id" placeholder="请输入商品编号" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="供应商编号" prop="s_id">
                        <el-select class="adde_stock_input" v-model="addE_stockForm.s_id" filterable placeholder="请选择供应商编号" clearable>
                            <el-option v-for="item in s_iddata" :key="item.s_id" :value="item.s_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品名称" prop="g_name">
                        <el-input class="adde_stock_input" v-model="addE_stockForm.g_name" placeholder="请输入商品名称" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品图片" prop="g_imgurl">
                        <el-upload class="adde_stock_input" ref="uploadRef" :action="goodsAction" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-error="handleError" :on-exceed="handleExceed" :limit="1" :headers="headers">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisibleAdd">
                            <img width="100%" :src="addE_stockForm.g_imgurl" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品规格" prop="g_unit">
                        <el-input class="adde_stock_input" v-model="addE_stockForm.g_unit" placeholder="请输入商品规格" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

             <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品类别" prop="c_name">
                        <el-select class="adde_stock_input" v-model="addE_stockForm.c_name" filterable placeholder="请选择商品类别" clearable>
                        <el-option v-for="item in c_namedata" :key="item.c_name" :value="item.c_name">
                        </el-option>
                    </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品进价" prop="e_price">
                        <el-input class="adde_stock_input" v-model="addE_stockForm.e_price" placeholder="请输入商品进价" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="进货数量" prop="e_num">
                        <el-input class="adde_stock_input" v-model="addE_stockForm.e_num" placeholder="请输入进货数量" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="存放位置" prop="w_name">
                         <el-select class="adde_stock_input" v-model="addE_stockForm.w_name" filterable placeholder="请选择存放位置" clearable>
                            <el-option v-for="item in w_namedata" :key="item.w_name" :value="item.w_name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="备注">
                        <el-input class="adde_stock_input" v-model="addE_stockForm.e_note" placeholder="请输入备注" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-row class="btn">
            <!-- 添加按钮 -->
            <el-col :span="2.5" :offset="7">
                <el-button type="primary" round @click="addE_stock" v-preventReClick>添加</el-button>
            </el-col>
            <!-- 更换进货单号按钮 -->
            <el-col :span="2" :offset="1">
                <el-button type="info" round @click="updateE_id" class="updateOtherIdbtn" v-preventReClick>更换进货单号</el-button>
            </el-col>
            <!-- 重置按钮 -->
            <el-col :span="1" :offset="1" class="resetbtn">
                <el-button type="success" round @click="resetAddE_stock" v-preventReClick>重置</el-button>
            </el-col>
        </el-row>
    </el-card>

</div>
</template>

<script>
import './adde_stock.css'
import adde_stock from './adde_stock'
export default adde_stock
</script>
