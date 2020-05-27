<template>
<!-- 销售信息列表 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>销售管理</el-breadcrumb-item>
        <el-breadcrumb-item>销售信息列表</el-breadcrumb-item>
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
                <el-input placeholder="请输入您要查询的内容" v-model="query.search" clearable @clear="getsaleList">
                    <el-button slot="append" icon="el-icon-search" @click="search" v-preventReClick>查询</el-button>
                </el-input>
            </el-col>
            
            <el-col :span="2.5">
                <div class="grid-content bg-purple">
                    <el-button type="success" @click="addsaleList">添加销售信息</el-button>
                </div>
            </el-col>

            <el-col :span="2.5">
                <div class="grid-content bg-purple">
                    <el-button type="primary" @click="multDelete" :disabled="disabled" v-preventReClick>批量删除</el-button>
                </div>
            </el-col>

            <el-col :span="5" class="time">
                <span>时间格式：YYYY-MM-DD</span>
            </el-col>
        </el-row>

        <!-- 销售信息表格区域-->
        <el-table :data="saleList" height="335" style="width: 100%" border stripe class="box-table" @selection-change="handleSelectionChange" @select-all="handleSelectAll" @select="selected">
            <el-table-column type="selection" width="40">
            </el-table-column>

            <el-table-column type="index" label="#" width="40">
            </el-table-column>

            <el-table-column prop="saleid" label="销售单号" width="130" show-overflow-tooltip fixed>
            </el-table-column>

            <el-table-column prop="s_id" label="员工号" width="100" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="g_id" label="商品编号" width="100" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="g_name" label="商品名称" width="130" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="商品图片" width="125">
                <template slot-scope="scope">
                    <img :src="scope.row.g_imgurl" width="100" height="100">
                </template>
            </el-table-column>

            <el-table-column prop="g_unit" label="商品规格" width="150" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="c_name" label="商品类别" width="100" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="销售价格/元" width="115" show-overflow-tooltip>
                <!--显示两位小数 -->
                <template slot-scope="scope">
                    {{scope.row.s_price | rounding}}
                </template>
            </el-table-column>

            <el-table-column prop="s_num" label="销售数量" width="90" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="销售单总金额/元" width="130" show-overflow-tooltip>
                <!--显示两位小数 -->
                <template slot-scope="scope">
                    {{scope.row.s_totolprice | rounding}}
                </template>
            </el-table-column>

            <el-table-column prop="s_role" label="消费角色" width="80" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="会员号" width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.v_id===''">无</el-tag>
                    <span v-else>{{scope.row.v_id}}</span>
                </template>
            </el-table-column>

            <el-table-column label="销售日期" width="110">
                <!-- 
                    如果单元的内容不是文本 需要给该内容外层加容器template
                    template内部要用数据 设置slot-scope属性
                该属性的值是要用数据createtime的数据源

                slot-scope的值scope其实就是el-table绑定的数据
                scope.row->数组中的每个对象
                 -->
                <template slot-scope="scope">
                    <!-- 处理日期 格式-->
                    {{scope.row.s_datetime | fmtdata}}
                </template>
            </el-table-column>

            <el-table-column prop="s_note" label="备注" width="120" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="操作" width="180" fixed="right">
                <template slot-scope="scope">
                    <!-- 修改销售销售信息 -->
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="dialogFormVisibleEdit = true;showEdit(scope.row.id)">修改</el-button>
                    <!-- 删除 -->
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination @size-change="pagesizeChange" @current-change="pagenumChange" :current-page="this.query.pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="this.query.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="this.query.total" background>
        </el-pagination>

        <!-- 修改销售信息的对话框 -->
        <el-dialog title="修改销售信息" :visible.sync="dialogFormVisibleEdit" width="600px" @close="editDialogClosed" status-icon>
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
                <el-form-item label="员工号:" prop="s_id">
                    <el-select v-model="editForm.s_id" filterable placeholder="请选择员工号" clearable>
                        <el-option v-for="item in s_iddata" :key="item.s_id" :value="item.s_id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品编号:" prop="g_id">
                    <el-select v-model="editForm.g_id" filterable placeholder="请选择商品编号" clearable @clear="clearGoodData">
                        <el-option v-for="item in g_iddata" :key="item.g_id" :value="item.g_id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品名称:" prop="g_name">
                    <el-input v-model="editForm.g_name" disabled></el-input>
                </el-form-item>

                <el-form-item label="商品图片:">
                    <el-upload class="avatar-uploader" :action="goodsAction" :show-file-list="false" :on-success="handleSuccess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :on-error="handleError" :headers="headers">
                        <img v-if="editForm.g_imgurl" :src="editForm.g_imgurl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="商品规格:" prop="g_unit">
                    <el-input v-model="editForm.g_unit" disabled></el-input>
                </el-form-item>

                <el-form-item label="商品类别:" prop="c_name">
                    <el-input v-model="editForm.c_name" disabled></el-input>
                </el-form-item>

                <el-form-item label="消费角色:" prop="s_role">
                    <el-select v-model="editForm.s_role" placeholder="请选择消费角色" clearable @clear="clearV_id">
                        <el-option v-for="item in s_role" :key="item.value" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="销售价格:" prop="s_price">
                    <el-select v-model="editForm.s_price" filterable placeholder="请选择销售价格" clearable>
                            <el-option v-for="(item,index) in s_priceData" :key="index" :value="item">
                            </el-option>
                        </el-select>
                </el-form-item>

                <el-form-item label="销售数量:" prop="s_num">
                    <el-input v-model="editForm.s_num" placeholder="请输入销售数量" clearable></el-input>
                </el-form-item>

                <el-form-item label="会员号:" prop="v_id">
                    <el-select v-model="editForm.v_id" filterable placeholder="请选择会员号" clearable>
                        <el-option v-for="item in v_iddata" :key="item.v_id" :value="item.v_id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="销售日期:" prop="s_datetime">
                    <el-date-picker v-model="editForm.s_datetime" type="date" placeholder="请选择销售日期" @change="timeChange">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="备注:">
                    <el-input v-model="editForm.s_note" placeholder="请输入备注" clearable></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelsaleList">取 消</el-button>
                <el-button type="primary" @click="editsaleList" v-preventReClick>确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</div>
</template>

<script>
import salelist from './salelist'
export default salelist
</script>
