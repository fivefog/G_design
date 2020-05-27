<template>
<!-- 供应商列表 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>供应商信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>供应商信息列表</el-breadcrumb-item>
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
                <el-input placeholder="请输入您要查询的内容" v-model="query.search" clearable @clear="getSupplierList" ref="searchRef">
                    <el-button slot="append" icon="el-icon-search" @click="search" v-preventReClick>查询</el-button>
                </el-input>
            </el-col>

            <el-col :span="2.5">
                <div class="grid-content bg-purple">
                    <el-button type="success" @click="addSupplier">添加供应商信息</el-button>
                </div>
            </el-col>

            <el-col :span="2.5">
                <div class="grid-content bg-purple">
                  <el-button type="primary" @click="multDelete" :disabled="disabled"  v-preventReClick>批量删除</el-button>
                </div>
            </el-col>

            <el-col :span="5" class="time">
                 <span>时间格式：YYYY-MM-DD</span>
            </el-col>
        </el-row>

        <!-- 供应商信息表格区域-->
        <el-table :data="supplierList" height="335" style="width: 100%" border stripe class="box-table" @selection-change="handleSelectionChange" @select-all="handleSelectAll" @select="selected">
            <el-table-column type="selection" width="40">
            </el-table-column>

            <el-table-column type="index" label="#" width="45">
            </el-table-column>

            <el-table-column prop="s_id" label="供应商编号" width="110" fixed show-overflow-tooltip >
            </el-table-column>

            <el-table-column prop="s_name" label="公司名称" width="200" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="s_contact" label="负责人姓名" width="110" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="s_email" label="邮箱" width="180" show-overflow-tooltip>
            </el-table-column>
            
            <el-table-column prop="s_phone" label="联系电话" width="120">
            </el-table-column>

            <el-table-column prop="s_area" label="公司地区" width="200" show-overflow-tooltip >
            </el-table-column>

            <el-table-column prop="s_adress" label="详细地址" width="130" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="创建时间" width="110">
                <!-- 
                    如果单元的内容不是文本 需要给该内容外层加容器template
                    template内部要用数据 设置slot-scope属性
                该属性的值是要用数据createtime的数据源

                slot-scope的值scope其实就是el-table绑定的数据
                scope.row->数组中的每个对象
                 -->
                <template slot-scope="scope">
                    <!-- 处理日期 格式-->
                    {{scope.row.createtime | fmtdata}}
                </template>
            </el-table-column>

            <el-table-column label="操作"  width="180" fixed="right">
                <template slot-scope="scope">
                    <!-- 修改供应商信息 -->
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="dialogFormVisibleEdit = true;showEdit(scope.row.id)">修改</el-button>
                    <!-- 删除 -->
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination @size-change="pagesizeChange" @current-change="pagenumChange" :current-page="this.query.pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="this.query.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="this.query.total" background>
        </el-pagination>

        <!-- 修改供应商信息的对话框 -->
        <el-dialog title="修改供应商信息" :visible.sync="dialogFormVisibleEdit" width="600px" @close="editDialogClosed" status-icon>
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
                <el-form-item label="公司名称:" prop="s_name">
                    <el-input v-model="editForm.s_name" clearable></el-input>
                </el-form-item>

                <el-form-item label="负责人姓名:" prop="s_contact">
                    <el-input v-model="editForm.s_contact" clearable></el-input>
                </el-form-item>

                <el-form-item label="邮箱:" prop="s_email">
                    <el-input v-model="editForm.s_email" placeholder="请输入邮箱地址" clearable></el-input>
                </el-form-item>

                <el-form-item label="联系电话:" prop="s_phone">
                    <el-input v-model.number="editForm.s_phone" clearable></el-input>
                </el-form-item>

                <el-form-item label="公司地区:" prop="s_area">
                    <el-cascader size="large" :options="options" v-model="selectedArea" @change="handleAreaChange" clearable>
                    </el-cascader>
                </el-form-item>

                <el-form-item label="公司详细地址:" prop="s_adress">
                    <el-input v-model="editForm.s_adress"  placeholder="请输入详细地址" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEdit= false">取 消</el-button>
                <el-button type="primary" @click="editSupplier" v-preventReClick>确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</div>
</template>

<script>
import supplierList from './supplierlist'
export default supplierList
</script>