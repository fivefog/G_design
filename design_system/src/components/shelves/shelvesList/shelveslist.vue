<template>
<!-- 类别信息列表 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品类目列表</el-breadcrumb-item>
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
                <el-input placeholder="请输入您要查询的内容" v-model="query.search" clearable @clear="getShelvesList">
                    <el-button slot="append" icon="el-icon-search" @click="search" v-preventReClick>查询</el-button>
                </el-input>
            </el-col>

            <el-col :span="2.5">
                <div class="grid-content bg-purple">
                    <el-button type="success" @click="dialogFormVisibleAdd = true">添加货架信息</el-button>
                </div>
            </el-col>

            <el-col :span="2.5">
                <div class="grid-content bg-purple">
                    <el-button type="primary" @click="multDelete" :disabled="disabled"  v-preventReClick>批量删除</el-button>
                </div>
            </el-col>

            <!-- <el-col :span="5" class="time">
                <span>时间格式：YYYY-MM-DD</span>
            </el-col> -->
        </el-row>

        <!-- 货架信息表格区域-->
        <el-table :data="shelvesList" height="335" style="width: 100%" border stripe class="box-table" @selection-change="handleSelectionChange" @select-all="handleSelectAll" @select="selected">
            <el-table-column type="selection">
            </el-table-column>

            <el-table-column type="index" label="#" width="40">
            </el-table-column>

            <el-table-column prop="shelvesid" label="货架号" width="130" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="shelvesname" label="货架类别" width="130" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="创建时间">
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

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <!-- 修改货架名称 -->
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="dialogFormVisibleEdit = true;showEdit(scope.row.id)">修改</el-button>
                    <!-- 删除 -->
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination @size-change="pagesizeChange" @current-change="pagenumChange" :current-page="this.query.pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="this.query.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="this.query.total" background>
        </el-pagination>

        <!-- 添加货架信息的对话框 -->
        <el-dialog title="添加货架信息" :visible.sync="dialogFormVisibleAdd" width="600px" @open="addDialogOpen" @close="addDialogClosed" status-icon>
            <el-form :model="addShelvesForm" :rules="addShelvesRules" ref="addShelvesRef" label-width="120px">
                <el-form-item label="货架号:" prop="shelvesid">
                    <el-input v-model="addShelvesForm.shelvesid" disabled></el-input>
                </el-form-item>

                <el-form-item label="货架类别:" prop="shelvesname">
                  <el-select v-model="addShelvesForm.shelvesname" filterable placeholder="请选择货架类别" clearable>
                        <el-option v-for="item in shelvesnameData" :key="item.c_name" :value="item.c_name">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd=false">取 消</el-button>
                <el-button type="primary" @click="addShelves" v-preventReClick>确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改货架类别的对话框 -->
        <el-dialog title="修改货架类别" :visible.sync="dialogFormVisibleEdit" width="600px" @close="editDialogClosed" status-icon>
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
                <el-form-item label="货架类别:" prop="shelvesname">
                    <el-select v-model="editForm.shelvesname" filterable placeholder="请选择货架类别" clearable>
                        <el-option v-for="item in shelvesnameData" :key="item.c_name" :value="item.c_name">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEdit=false">取 消</el-button>
                <el-button type="primary" @click="editShelvesList" v-preventReClick>确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</div>
</template>

<script>
import shelveslist from './shelveslist'
export default shelveslist
</script>
