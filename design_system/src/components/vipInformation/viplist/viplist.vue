<template>
<!-- 会员列表 -->
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>会员信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员信息列表</el-breadcrumb-item>
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
                <el-input placeholder="请输入您要查询的内容" v-model="query.search" clearable @clear="getVipList">
                    <el-button slot="append" icon="el-icon-search" @click="search" v-preventReClick>查询</el-button>
                </el-input>
            </el-col>
            
            <el-col :span="2.5">
                <div class="grid-content bg-purple">
                    <el-button type="success" @click="addVip">添加会员信息</el-button>
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

        <!-- 会员信息表格区域-->
        <el-table :data="vipList"  height="335" style="width: 100%" border stripe class="box-table" @selection-change="handleSelectionChange" @select-all="handleSelectAll" @select="selected">
            <el-table-column type="selection" width="40">
            </el-table-column>

            <el-table-column type="index" label="#" width="40">
            </el-table-column>

            <el-table-column prop="v_id" label="会员号" width="100" fixed>
            </el-table-column>

            <el-table-column prop="username" label="用户名" width="100">
            </el-table-column>

            <el-table-column prop="name" label="姓名" width="110">
            </el-table-column>

            <el-table-column prop="password" label="登录密码" width="100">
            </el-table-column>

            <el-table-column prop="role" label="角色" width="80">
            </el-table-column>

            <el-table-column prop="sex" label="性别" width="70">
            </el-table-column>

            <el-table-column label="消费积分" width="152">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.score" @change="handleScoreChange(scope.row.id,scope.row.score)" :step="10" :min="0" size="small"></el-input-number>
                </template>
            </el-table-column>

            <el-table-column label="会员状态" width="123">
                <template slot-scope="scope">
                    <el-tag type="success" effect="dark" v-if="scope.row.state==='正常'">正常</el-tag>
                    <el-tag type="warning" effect="dark" v-else-if="scope.row.state==='申请退出中'">申请退出中</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="email" label="邮箱" width="180" show-overflow-tooltip>
            </el-table-column>
            
            <el-table-column prop="phone" label="手机号" width="120">
            </el-table-column>

            <el-table-column label="创建时间" width="120">
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

            <el-table-column label="操作" width="180" fixed="right">
                <template slot-scope="scope">
                    <!-- 修改会员信息 -->
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="dialogFormVisibleEdit = true;showEdit(scope.row.id)">修改</el-button>
                    <!-- 删除 -->
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination @size-change="pagesizeChange" @current-change="pagenumChange" :current-page="this.query.pagenum" :page-sizes="[5, 10, 20, 30]" :page-size="this.query.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="this.query.total" background>
        </el-pagination>

        <!-- 修改会员信息的对话框 -->
        <el-dialog title="修改会员信息" :visible.sync="dialogFormVisibleEdit" width="600px" @close="editDialogClosed" status-icon>
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
                <el-form-item label="用户名:" prop="username">
                    <el-input v-model="editForm.username" placeholder="请输入用户名" clearable></el-input>
                </el-form-item>

                <el-form-item label="姓名:" prop="name">
                    <el-input v-model="editForm.name" placeholder="请输入姓名" clearable></el-input>
                </el-form-item>

                <el-form-item label="登录密码:" prop="password">
                    <el-input v-model="editForm.password" show-password placeholder="请输入密码" clearable></el-input>
                </el-form-item>

                <el-form-item label="性别:" prop="sex">
                    <el-select v-model="editForm.sex" placeholder="请选择性别" clearable>
                        <el-option v-for="item in sex" :key="item.value" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="邮箱:" prop="email">
                    <el-input v-model="editForm.email" placeholder="请输入邮箱地址" clearable></el-input>
                </el-form-item>

                <el-form-item label="手机号:" prop="phone">
                    <el-input v-model.number="editForm.phone" placeholder="请输入手机号" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEdit= false">取 消</el-button>
                <el-button type="primary" @click="editVip" v-preventReClick>确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</div>
</template>

<script>
import vipList from './viplist'
export default vipList
</script>
