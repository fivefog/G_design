<template>
<!-- 添加销售信息 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>销售管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加销售信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="add-card">
        <!-- 页头区域 -->
        <el-page-header @back="goBack" content="添加销售信息">
        </el-page-header>
        <!-- 添加销售信息表单 -->
        <el-form label-position="right" label-width="80px" :model="addSaleForm" :rules="addSaleRules" ref="addSaleRef" status-icon>
            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="销售单号" prop="saleid">
                        <el-input v-model="addSaleForm.saleid" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="员工号" prop="s_id">
                        <el-select v-model="addSaleForm.s_id" filterable placeholder="请选择员工号" clearable>
                            <el-option v-for="item in s_iddata" :key="item.s_id" :value="item.s_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品编号" prop="g_id">
                        <el-select v-model="addSaleForm.g_id" filterable placeholder="请选择商品编号" clearable @clear="clearGoodData">
                            <el-option v-for="item in g_iddata" :key="item.g_id" :value="item.g_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品名称" prop="g_name">
                        <el-input v-model="addSaleForm.g_name" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品图片" prop="g_imgurl">
                        <el-upload ref="uploadRef" :action="goodsAction" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-success="handleSuccess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-error="handleError" :on-exceed="handleExceed" :limit="1" :headers="headers">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisibleAdd">
                            <img width="100%" :src="addSaleForm.g_imgurl" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品规格" prop="g_unit">
                        <el-input v-model="addSaleForm.g_unit" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品类别" prop="c_name">
                        <el-input v-model="addSaleForm.c_name" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="消费角色" prop="s_role">
                        <el-select v-model="addSaleForm.s_role" placeholder="请选择消费角色" clearable @clear="clearV_id">
                            <el-option v-for="item in s_role" :key="item.value" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="销售价格" prop="s_price">
                        <el-select v-model="addSaleForm.s_price" filterable placeholder="请选择销售价格" clearable>
                            <el-option v-for="(item,index) in s_priceData" :key="index" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="销售数量" prop="s_num">
                        <el-input v-model="addSaleForm.s_num" placeholder="请输入销售数量" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="会员号" prop="v_id">
                        <el-select v-model="addSaleForm.v_id" filterable placeholder="请选择会员号" clearable>
                            <el-option v-for="item in v_iddata" :key="item.v_id" :value="item.v_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="备注">
                        <el-input v-model="addSaleForm.s_note" placeholder="请输入备注" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-row class="btn">
            <!-- 添加按钮 -->
            <el-col :span="2.5" :offset="7">
                <el-button type="primary" round @click="addSale" v-preventReClick>添加</el-button>
            </el-col>
            <!-- 更换销售单号按钮 -->
            <el-col :span="2" :offset="1">
                <el-button type="info" round @click="updateSaleid" class="updateOtherIdbtn" v-preventReClick>更换销售单号</el-button>
            </el-col>
            <!-- 重置按钮 -->
            <el-col :span="1" :offset="1" class="resetbtn">
                <el-button type="success" round @click="resetAddSale" v-preventReClick>重置</el-button>
            </el-col>
        </el-row>
    </el-card>

</div>
</template>

<script>
import addsale from './addsale'
export default addsale
</script>
