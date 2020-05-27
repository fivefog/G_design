<template>
  <!-- 订单信息列表 -->
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单信息列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 订单信息表格区域-->
      <el-table :data="goodsList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div v-for="(item,i) in props.row" :key="i">
              <span style="width:100%;text-align:center;color:#A9C4F3;">{{'商品'+(i+1)}}</span>
              <el-form label-position="left" inline class="demo-table-expand">
              
                <el-form-item label="商品名称">
                  <span>{{ item.g_name }}</span>
                </el-form-item>
                <el-form-item label="选择规格">
                  <span>{{ item.select_attr }}</span>
                </el-form-item>
                <el-form-item label="商品 ID">
                  <span>{{ item.g_id }}</span>
                </el-form-item>
                <el-form-item label="订单状态">
                  <span>{{ item.status == 1?'待发货':item.status == 2?'待收货':item.status == 3?'待评价': item.status == 4?'已完成':''}}</span>
                </el-form-item>
                <el-form-item label="商品数量">
                  <span>{{ item.num }}</span>
                </el-form-item>
                <el-form-item label="实际支付">
                  <span>{{ item.single_total}}</span>
                </el-form-item>
                <el-form-item label="收货 ID">
                  <span>{{item.addr_id }}</span>
                </el-form-item>
                <el-form-item label="订单备注">
                  <span>{{ item.g_note }}</span>
                </el-form-item>
                <el-form-item label="快递单号">
                  <span>{{item.tacking_num }}</span>
                </el-form-item>
                <el-form-item label="快递公司">
                  <span>{{ item.tacking_company }}</span>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="订单号" prop="[0].order_id"></el-table-column>
        <el-table-column label="用户信息" prop="[0].user_phone"></el-table-column>
        <el-table-column label="下单时间" prop="[0].add_time"></el-table-column>
        <el-table-column label="状态管理">
          <template slot-scope="props">
            <el-select
              :value="props.row[0].status==1?'待发货':props.row[0].status==2?'待收货':props.row[0].status==3?'待评价':props.row[0].status==4?'已完成':''"
              @change="status_change($event,props.row)"
              clearable
              placeholder="订单状态"
            >
              <el-option
                v-for="op_item in options"
                :key="op_item.value"
                :label="op_item.label"
                :value="op_item.label"
              ></el-option>
            </el-select>
            <!-- 发货操作 -->
            <el-button
              type="text"
              @click="dialogFormVisible = true,delivery(props.row[0].order_id)"
              style="margin-left:10px"
              v-if="props.row[0].status == 1"
            >发货</el-button>

            <el-dialog title="快递信息" :visible.sync="dialogFormVisible">
              <el-form :model="delivery_form">
                <el-form-item label="快递单号" :label-width="formLabelWidth">
                  <el-input v-model="delivery_form.tacking_num" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="快递公司" :label-width="formLabelWidth">
                  <el-select v-model="delivery_form.tacking_company" placeholder="请选择快递">
                    <el-option label="中通快递" value="中通"></el-option>
                    <el-option label="德邦快速" value="德邦"></el-option>
                    <el-option label="韵达快速" value="韵达"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="delivery_sure(),dialogFormVisible = false">确 定</el-button>
              </div>
            </el-dialog>
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
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #6f8aaf !important;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-dropdown-link {
  cursor: pointer;
  color: rgb(123, 214, 226);
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
<script>
import orderlist from "./orderlist";
export default orderlist;
</script>
