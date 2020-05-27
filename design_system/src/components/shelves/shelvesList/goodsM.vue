<template>
  <!-- 货架信息列表 -->
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>

      <el-breadcrumb-item>商品信息列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="12" class="box-searchRow">
        <el-col :span="1.1" class="condition">
          <span>条件查询:</span>
        </el-col>

        <el-col :span="3">
          <el-select v-model="query.filters" placeholder="请选择条件" clearable>
            <el-option
              v-for="item in filters"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="8">
          <el-input
            placeholder="请输入您要查询的内容"
            v-model="query.search"
            clearable
            @clear="getShelvesList"
          >
            <el-button slot="append" icon="el-icon-search" @click="search" v-preventReClick>查询</el-button>
          </el-input>
        </el-col>

        <el-col :span="2.5">
          <div class="grid-content bg-purple">
            <el-button type="success" @click="addGoodsM">添加商品信息</el-button>
          </div>
        </el-col>

        <el-col :span="2.5">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="multDelete" :disabled="disabled" v-preventReClick>批量删除</el-button>
          </div>
        </el-col>

       
      </el-row>

      <!-- 商品信息表格区域-->
      <el-table
        :data="shelvesList"
        height="335"
        style="width: 100%"
        border
        stripe
        class="box-table"
        @selection-change="handleSelectionChange"
        @select-all="handleSelectAll"
        @select="selected"
      >
        <el-table-column type="selection"></el-table-column>

        <el-table-column align="center" type="index" label="#" width="40"></el-table-column>

        <el-table-column align="center" prop="g_id" label="商品编号" width="120" show-overflow-tooltip></el-table-column>

        <el-table-column
          align="center"
          prop="c_name"
          label="商品类别"
          width="120"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          align="center"
          prop="g_name"
          label="商品名称"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="g_imgurl"
          label="商品大图"
          width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope" v-if="scope.row.g_imgurl">
            <el-image style="width: 100px; height: 100px" :src="scope.row.g_imgurl" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="g_imglist"
          label="轮播图"
          width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope" v-if="scope.row.g_imglist">
           
            <el-image style="width: 100px; height: 100px"  :src="scope.row.g_imglist[0]" fit="cover"></el-image>
            <!-- <el-image
              style="width: 100px; height: 100px"
              v-for="imgCell in scope.row.g_imglist"
              :src="imgCell"
              :key="imgCell"
              fit="cover"
            ></el-image> -->
          </template>
        </el-table-column>
        <el-table-column align="center" prop="g_unit" label="单位" width="50" show-overflow-tooltip></el-table-column>
        <el-table-column
          align="center"
          prop="g_price"
          label="商品单价"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="g_stock"
          label="商品库存"
          width="50"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="g_attr"
          label="商品属性"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="g_note" label="备注" width="120" show-overflow-tooltip></el-table-column>

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
            <!-- 设置属性规格 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="dialogFormVisibleAdd=true;showEdit(scope.row.g_id)"
            >属性</el-button>
            <!-- 修改商品信息 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="dialogFormVisibleEdit = true;showEdit(scope.row.g_id)"
            >修改</el-button>
            <!-- 删除 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="pagesizeChange"
        @current-change="pagenumChange"
        :current-page="this.query.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="this.query.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.query.total"
        background
      ></el-pagination>

      <!-- 添加货架信息的对话框 -->
      <el-dialog
        title="添加商品信息"
        :visible.sync="dialogFormVisibleAdd"
        width="600px"
        @open="addDialogOpen"
        @close="addDialogClosed"
        status-icon
      >
        <el-form
          :model="addShelvesForm"
          :rules="addShelvesRules"
          ref="addShelvesRef"
          label-width="120px"
        >
          <el-form-item label="商品编号" prop="shelvesid">
            <el-input v-model="addShelvesForm.g_id" disabled></el-input>
          </el-form-item>

          <!-- <el-form-item label="商品名称" prop="g_name">
            <el-input v-model="addShelvesForm.g_name" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品图片" prop="g_name">
            <el-input v-model="addShelvesForm.shelvesid" disabled></el-input>
          </el-form-item>
          <el-form-item label="单位" prop="g_name">
            <el-input v-model="addShelvesForm.shelvesid" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="g_name">
            <el-input v-model="addShelvesForm.shelvesid" disabled></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="g_name">
            <el-input v-model="addShelvesForm.shelvesid" disabled></el-input>
          </el-form-item>
          <el-form-item label="库存" prop="g_name">
            <el-input v-model="addShelvesForm.shelvesid" disabled></el-input>
          </el-form-item>
          <el-form-item label="规格" prop="g_name">
            <el-input v-model="addShelvesForm.shelvesid" disabled></el-input>
          </el-form-item>
          <el-form-item label="下单备注" prop="g_name">
            <el-input v-model="addShelvesForm.shelvesid" disabled></el-input>
          </el-form-item>-->

          <el-form-item label="商品类别:" prop="shelvesname">
            <el-select
              v-model="addShelvesForm.shelvesname"
              filterable
              placeholder="请选择货架类别"
              clearable
            >
              <el-option v-for="item in shelvesnameData" :key="item.c_name" :value="item.c_name"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAdd=false">取 消</el-button>
          <el-button type="primary" @click="addShelves" v-preventReClick>确 定</el-button>
        </div>
      </el-dialog>
      <!-- 属性规格的对话框 -->
      <el-dialog
        title="设置商品属性规格"
        :visible.sync="dialogFormVisibleAdd"
        width="600px"
        @close="editDialogClosed"
        status-icon
      >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
          <el-form-item
            v-for="(domain, index) in g_attrArr"
            :label="'规则' + index"
            :key="domain.key"
            :prop="'g_attrArr' + [index] "
          >
            <el-input v-model="g_attrArr[index]" style="width:208px ;margin-right:10px"></el-input>
            <el-button @click.prevent="removeDomain(g_attrArr[index])">删除规则{{index}}</el-button>
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in g_attrArr"
            :label="domain"
            :key="index+'00'"
            :prop="'g_attrKey' + [index] "
          >
            <el-input
              v-model="g_attrKey[index]"
              placeholder="请输入规则值，空格分隔"
              style="width:208px ;margin-right:10px"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="addDomain">新增规则</el-button>
          </el-form-item>

          <el-form-item label="商品名称" prop="g_name">
            <el-input v-model="editForm.g_name" disabled></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAdd=false">取 消</el-button>
          <el-button type="primary" @click="editShelvesList" v-preventReClick>确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改商品信息的对话框 -->
      <el-dialog
        title="修改商品信息"
        :visible.sync="dialogFormVisibleEdit"
        width="600px"
        @close="editDialogClosed"
        status-icon
      >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
          <el-form-item label="商品分类:" prop="shelvesname">
            <el-select v-model="editForm.c_name" filterable placeholder="请选择商品分类" clearable>
              <el-option v-for="item in shelvesnameData" :key="item.c_name" :value="item.c_name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称" prop="g_name">
            <el-input v-model="editForm.g_name"></el-input>
          </el-form-item>
          <el-form-item label="商品大图" prop="g_imgurl">
            <el-upload
              class="avatar-uploader"
              :action="goodsAction"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :on-error="handleError"
            >
              <img v-if="editForm.g_imgurl" :src="editForm.g_imgurl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="商品轮播图" prop="g_imglist">
            <!-- <el-upload
              v-if="editForm.g_imglist"
              :show-file-list="false"
              :action="goodsAction"
              :on-success="imglist_handleSuccess"
              :before-upload="imglist_beforeAvatarUpload"
              :on-remove="handleRemove"
              :on-error="handleError"
              :on-preview="handlePictureCardPreview"
            >
              <img  class="avatar" style="display:inline-block" v-if="editForm.g_imglist" :src="editForm.g_imglist[0]" />
            </el-upload> -->
            <el-upload
              list-type="picture-card"
              :action="goodsAction"
              :before-upload="imglist_beforeAvatarUpload"
              :on-success="imglist_handleSuccess"
              :on-remove="handleRemove"
              :on-error="handleError"
              :on-preview="handlePictureCardPreview"
              :on-change="imglist_onChange"
            >
              
              <i class="el-icon-plus" ></i>
            </el-upload>
            <!-- 预览图片 -->
            <!-- <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="editForm.g_imglist" alt />
            </el-dialog> -->
          </el-form-item>
          <el-form-item label="单位" prop="g_unit">
            <el-input v-model="editForm.g_unit"></el-input>
          </el-form-item>

          <el-form-item label="价格" prop="g_price">
            <el-input v-model="editForm.g_price"></el-input>
          </el-form-item>
          <el-form-item label="库存" prop="g_stock">
            <el-input v-model="editForm.g_stock"></el-input>
          </el-form-item>
          <el-form-item label="规格" prop="g_attr">
            <el-input v-model="editForm.g_attr"></el-input>
          </el-form-item>
          <el-form-item label="下单备注" prop="g_note">
            <el-input v-model="editForm.g_note"></el-input>
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
import goodsM from "./goodsM";
export default goodsM;
</script>
<style lang="scss" scoped>
</style>