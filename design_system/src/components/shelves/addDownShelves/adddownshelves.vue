<template>
<!-- 添加下架商品 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加下架商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="add-card">
        <!-- 页头区域 -->
        <el-page-header @back="goBack" content="添加下架商品">
        </el-page-header>
        <!-- 添加下架商品表单 -->
        <el-form label-position="right" label-width="80px" :model="addDownShelvesForm" :rules="addDownShelvesRules" ref="addDownShelvesRef" status-icon>
            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="下架编号" prop="down_id">
                        <el-input v-model="addDownShelvesForm.down_id" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品编号" prop="g_id">
                        <el-select v-model="addDownShelvesForm.g_id" filterable placeholder="请选择商品编号" clearable @clear="clearGoodData">
                            <el-option v-for="item in g_iddata" :key="item.g_id" :value="item.g_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品名称" prop="g_name">
                        <el-input v-model="addDownShelvesForm.g_name" disabled></el-input>
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
                            <img width="100%" :src="addDownShelvesForm.g_imgurl" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品规格" prop="g_unit">
                        <el-input v-model="addDownShelvesForm.g_unit" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="商品类别" prop="c_name">
                        <el-input v-model="addDownShelvesForm.c_name" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="下架数量" prop="down_num">
                        <el-input v-model="addDownShelvesForm.down_num" placeholder="请输入下架数量" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="9" :offset="6">
                    <el-form-item label="备注">
                        <el-input v-model="addDownShelvesForm.down_note" placeholder="请输入备注" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-row class="btn">
            <!-- 添加按钮 -->
            <el-col :span="2.5" :offset="7">
                <el-button type="primary" round @click="addDownShelves" v-preventReClick>添加</el-button>
            </el-col>
            <!-- 更换下架编号按钮 -->
            <el-col :span="2" :offset="1">
                <el-button type="info" round @click="updateDown_id" class="updateOtherIdbtn" v-preventReClick>更换下架编号</el-button>
            </el-col>
            <!-- 重置按钮 -->
            <el-col :span="1" :offset="1" class="resetbtn">
                <el-button type="success" round @click="resetAddDownShelves" v-preventReClick>重置</el-button>
            </el-col>
        </el-row>
    </el-card>

</div>
</template>

<script>
import adddownshelves from './adddownshelves'
export default adddownshelves
</script>
