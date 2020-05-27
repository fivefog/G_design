<template>
  <!-- 添加上架商品 -->
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <!-- <el-breadcrumb-item :to="{ path: 'welcome' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="add-card">
      <!-- 页头区域 -->
      <el-page-header @back="goBack" content="添加商品"></el-page-header>
      <!-- 添加商品表单 -->
      <el-form
        label-position="right"
        label-width="80px"
        :model="addOnShelvesForm"
        :rules="addOnShelvesRules"
        ref="addOnShelvesRef"
        status-icon
      >
        <el-row>
          <el-col :span="9" :offset="6">
            <el-form-item label="商品分类" prop="c_name">
              <el-select
                class="addonshelves_input"
                v-model="addOnShelvesForm.c_name"
                filterable
                placeholder="请选择商品分类"
                clearable
                @clear="clearGoodData"
              >
                <el-option v-for="item in shelvesnameData" :key="item.c_name" :value="item.c_name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9" :offset="6">
            <el-form-item class="addonshelves_input" label="商品编号" prop="g_id">
              <el-input v-model="addOnShelvesForm.g_id"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="9" :offset="6">
            <el-form-item label="货架号" prop="shelvesid">
              <el-select
                class="addonshelves_input"
                v-model="addOnShelvesForm.shelvesid"
                filterable
                placeholder="请选择货架号"
                clearable
              >
                <el-option
                  v-for="item in shelvesidData"
                  :key="item.shelvesid"
                  :value="item.shelvesid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>-->

        <el-row>
          <el-col :span="9" :offset="6">
            <el-form-item label="商品名称" prop="g_name">
              <el-input class="addonshelves_input" v-model="addOnShelvesForm.g_name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="9" :offset="6">
            <el-form-item label="商品大图片" prop="g_imgurl">
              <el-upload
                class="addonshelves_input"
                ref="uploadRef"
                :action="goodsAction"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-success="handleSuccess"
                :before-upload="beforeAvatarUpload"
                :on-remove="handleRemove"
                :on-error="handleError"
                :on-exceed="handleExceed"
                :limit="1"
                :headers="headers"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisibleAdd">
                <img width="100%" :src="addOnShelvesForm.g_imgurl" alt />
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9" :offset="6">
            <el-form-item label="商品轮播图" prop="g_imglist">
              <el-upload
                class="addonshelves_input"
                ref="uploadRef"
                :action="goodsAction"
                list-type="picture-card"
                :on-preview="imglist_handlePictureCardPreview"
                :on-success="imglist_handleSuccess"
                :before-upload="beforeAvatarUpload"
                :on-remove="imglist_handleRemove"
                :on-error="handleError"
                :on-exceed="handleExceed"
                :limit="6"
                :headers="headers"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisibleAdd">
                <img width="100%" :src="addOnShelvesForm.g_imgurl" alt />
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9" :offset="6">
            <el-form-item label="商品单位" prop="g_unit">
              <el-input class="addonshelves_input" v-model="addOnShelvesForm.g_unit" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9" :offset="6">
            <el-form-item label="价格" prop="g_price">
              <el-input
                class="addonshelves_input"
                v-model="addOnShelvesForm.g_price"
                placeholder="请输入商品价格"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="9" :offset="6">
            <el-form-item label="库存数量" prop="g_stock">
              <el-input
                class="addonshelves_input"
                v-model="addOnShelvesForm.g_stock"
                placeholder="请输入库存数量"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="9" :offset="6">
            <el-form-item label="备注">
              <el-input
                class="addonshelves_input"
                v-model="addOnShelvesForm.g_note"
                placeholder="请输入备注"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-row class="btn">
        <!-- 添加按钮 -->
        <el-col :span="2.5" :offset="7">
          <el-button type="primary" round @click="addOnShelves">添加</el-button>
        </el-col>
      
        <!-- 重置按钮 -->
        <el-col :span="1" :offset="1" class="resetbtn">
          <el-button type="success" round @click="resetAddOnShelves" v-preventReClick>重置</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import "./addonshelves.css";

// name: 'addonshelves',
export default {
  data() {
    //上架编号自定义规则对象
    // let checkOn_id = async (rule, value, callback) => {
    //   //接收检测上架编号是否存在的Promise函数
    //   await this.fetchOn_idTotal(value);
    //   callback();
    // };

    //商品编号自定义规则对象
    // let checkG_id = async (rule, value, callback) => {
    //   //接收获取商品编号对应的商品名称和商品规格的Promise函数
    //   await this.fetchG_idData(value);
    //   this.fetchG_id(); //获取出货信息中全部的商品编号
    //   callback();
    // };

    //货架号自定义规则对象
    // let checkShelvesid = async (rule, value, callback) => {
    //   //接收获取货架号是否重复的Promise函数
    //   await this.fetchShelvesidTotal(value);
    //   callback();
    // };

    // //非会员价格自定义规则对象
    // let checkPrice = (rule, value, callback) => {
    //   const price = /^\d+(\.\d{1,2})?$/;
    //   if (!price.test(value)) {
    //     callback(new Error("非会员价格必须为整数或最多带两位小数的数字"));
    //   } else {
    //     callback();
    //   }
    // };

    //商品价格自定义规则对象
    let checkVipPrice = (rule, value, callback) => {
      const price = /^\d+(\.\d{1,2})?$/;
      if (!price.test(value)) {
        callback(new Error("会员价格必须为整数或最多带两位小数的数字"));
      } else {
        callback();
      }
    };

    //库存数量自定义规则对象
    let checkNum = async (rule, value, callback) => {
      const num = /^[\u4E00-\u9FA5\d]{1,30}$/;
      if (!num.test(value)) {
        callback(new Error("上架数量必须为数字或汉字"));
      } else if (!/^[1-9]/.test(value)) {
        callback(new Error("上架数量必须以数字开头且大于0"));
      } else {
        //接收判断上架数量是否大于未上架数量的Promise函数
        await this.fetchNum(value);
      }
    };

    return {
      addOnShelvesForm: {
        g_imglist:'',
        //添加出货表单数据
        // g_id,
        // g_name,
        // g_imgurl,
        // g_unit,
        // c_name,
        // g_price,
        // g_stock,
        // g_attr,
        // g_datetime,
        // g_note
      },
      shelvesnameData: [], //商品类别下拉列表数据

      g_iddata: [], //商品编号下拉列表的全部数据
      shelvesidData: [], //货架号下拉列表数据

      dialogVisibleAdd: false, //控制添加商品图片对话框的显示与隐藏
      goodsAction: this.$action, //商品图片上传的地址
      headers: {
        //商品图片上传的请求头
        superAdminAuthorization: localStorage.getItem("superAdminAuthorization")
      },

      imgurl: "", //商品图片重置前的图片路径
      addOnShelvesRules: {
        //修改信息的校验证规则对象
        // on_id: [{ validator: checkOn_id, trigger: "change" }],
        // g_id: [
        //   {
        //     required: true,
        //     message: "请填写商品编号",
        //     trigger: "change"
        //   },
        //   { validator: checkG_id, trigger: "change" }
        // ],
        // shelvesid: [
        //   {
        //     required: true,
        //     message: "请选择货架号",
        //     trigger: "change"
        //   },
        //   { validator: checkShelvesid, trigger: "change" }
        // ],
        g_name: [
          {
            required: true,
            message: "商品名称不能为空",
            trigger: "change"
          }
        ],
        g_imgurl: [
          {
            required: true,
            message: "请上传商品图片",
            trigger: "change"
          }
        ],
        g_unit: [
          {
            required: true,
            message: "商品单位不能为空",
            trigger: "change"
          }
        ],
        c_name: [
          {
            required: true,
            message: "商品类别不能为空",
            trigger: "change"
          }
        ],
        // price: [
        //   {
        //     required: true,
        //     message: "请输入非会员价格",
        //     trigger: "change"
        //   },
        //   { validator: checkPrice, trigger: "change" }
        // ],
        g_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "change"
          },
          { validator: checkVipPrice, trigger: "change" }
        ],
        g_stock: [
          {
            required: true,
            message: "请输入库存数量",
            trigger: "change"
          },
        
          { validator: checkNum, trigger: "change" }
        ],
        on_datetime: [
          {
            required: true,
            message: "请选择上架日期",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    goBack() {
      //返回上架商品列表
      this.$router.push("/superadminhome/onshelveslist");
    },
    //获取全部的货架类别(商品类别)
    async fetchShelvesname() {
      try {
        let { data } = await this.$http.get("/categorylist");
        // console.log(data.data) //输出全部的货架类别(商品类别)
        this.shelvesnameData = data.data;
      } catch (error) {
        this.$message.error("服务器连接失败");
      }
    },
    //获取随机的上架编号
    // fetchOn_id() {
    //   let id1 = this.$moment().format("YYYYMMDD");
    //   let id2 = Math.random()
    //     .toString()
    //     .slice(2, 6);
    //   let on_id = id1 + id2;
    //   this.addOnShelvesForm.on_id = parseInt(on_id);
    // },
    //获取当前日期
    fetchDate() {
      this.addOnShelvesForm.on_datetime = this.$moment().format("YYYY-MM-DD");
      // console.log(this.addOnShelvesForm.on_datetime)
    },
    //获取商品编号对应的商品名称和商品规格的请求
    // async fetchG_idData(value) {
    //     let g_id = value
    //     try {
    //         let {
    //             data
    //         } = await this.$http.get('/outstocklist/query', {
    //                 params: {
    //                     g_id
    //                 }
    //             })
    //             // console.log(data.data) //输出商品编号对应的信息
    //         let { g_name, g_unit, c_name } = data.data
    //         return new Promise((resolve, reject) => {
    //             if (data.status === 1) {
    //                 this.addOnShelvesForm.g_name = g_name
    //                 this.addOnShelvesForm.g_unit = g_unit
    //                 this.addOnShelvesForm.c_name = c_name
    //                 this.fetchShelvesid() //获取商品类别对应的全部货架号
    //                 resolve(true)
    //             } else {
    //                 this.addOnShelvesForm.g_name = ''
    //                 this.addOnShelvesForm.g_unit = ''
    //                 this.addOnShelvesForm.c_name = ''
    //                 this.shelvesidData = []
    //                 reject('该商品编号不存在！请重新选择')
    //             }
    //         })

    //     } catch (error) {
    //         this.$message.error('服务器连接失败')
    //     }
    // },
    //获取出货信息中全部的商品编号
    async fetchG_id() {
      try {
        let { data } = await this.$http.get("/outstocklist");
        // console.log(data.data) //输出出货信息中全部的商品编号
        this.g_iddata = data.data;
      } catch (error) {
        this.$message.error("服务器连接失败");
      }
    },
    //获取计算上架编号总数的请求(用来检测修改后的上架编号是否已经存在)
    async fetchOn_idTotal(value) {
      let on_id = value;
      try {
        let { data } = await this.$http.get("/onshelveslist/total", {
          params: {
            on_id
          }
        });
        // console.log(data.data) //输出上架编号总数
        if (data.status === 1) {
          return new Promise((resolve, reject) => {
            //上架编号总数等于0返回true(说明上架编号没重复)
            if (data.data === 0) {
              resolve(true);
            } else {
              reject("该上架编号已存在！请更换上架编号");
            }
          });
        }
      } catch (error) {
        this.$message.error("服务器连接失败");
      }
    },
    //获取根据商品编号查询出货数量、上架数量的请求(判断上架数量数量是否大于未上架数量)
    async fetchNum(value) {
      let { g_id } = this.addOnShelvesForm;
      value = parseInt(value); //字符串转换为整数(修改后的上架数量)
      let un_num; //未上架数量

      // console.log(typeof(g_id))
      if (typeof g_id !== "string") {
        try {
          let { data } = await this.$http.get(`/onshelveslist/num/${g_id}`);
          // console.log(data.data) //输出出货数量、上架数量

          return new Promise((resolve, reject) => {
            if (data.status === 1 && data.data.length > 0) {
              if (data.data[1] !== undefined) {
                let o_num = data.data[0].o_num; //出货数量
                let on_num = data.data[1].on_num; //上架数量
                un_num = o_num - (on_num + value); //未上架数量
              } else {
                let o_num = data.data[0].o_num; //出货数量
                un_num = o_num - value; //未上架数量
              }

              // console.log(un_num)
              if (un_num >= 0) {
                resolve(true);
              } else {
                reject("上架数量大于未上架数量！请重新输入");
              }
            } else {
              resolve(true);
            }
          });
        } catch (error) {
          this.$message.error("服务器连接失败");
        }
      }
    },
    //获取计算货架号总数的请求(用来检测修改后的货架号是否在货架信息列表中存在)
    async fetchShelvesidTotal(value) {
      let shelvesid = value;
      let shelvesname = this.addOnShelvesForm.c_name;
      try {
        let { data } = await this.$http.get(`/shelveslist/total/${shelvesid}`, {
          params: {
            shelvesid,
            shelvesname
          }
        });
        // console.log(data.data) //输出货架号总数
        if (data.status === 1) {
          return new Promise((resolve, reject) => {
            //全部货架号总数等于0说明该货架号不存在
            if (data.data[0] === 0) {
              reject("该货架号不存在！请重新选择");
            } //商品类别对应的全部货架号总数等于0说明该货架类别与商品类别不一致
            else if (data.data[1] === 0) {
              reject("该货架类别与商品类别不一致！请重新选择货架号");
            } else {
              resolve(true);
            }
          });
        }
      } catch (error) {
        this.$message.error("服务器连接失败");
      }
    },
    //获取商品类别对应的全部货架号的请求
    async fetchShelvesid() {
      let shelvesname = this.addOnShelvesForm.c_name;
      console.log("s", shelvesname);

      try {
        let { data } = await this.$http.get("/shelveslist/query", {
          params: {
            shelvesname
          }
        });
        console.log("货架", data); //输出商品类别对应的货架号
        this.shelvesidData = data.data;
      } catch (error) {
        this.$message.error("服务器连接失败");
      }
    },
    //获取删除服务器里已上传的图片的请求(为了添加后清空图片或重置时使用)
    async fetchDeleteOldImg() {
      let imgurl = this.imgurl; //要删除的图片路径
      // console.log(imgurl)
      try {
        await this.$http.delete("/upload/oldimg", {
          params: {
            imgurl
          }
        });
      } catch (error) {
        this.$message.error("服务器连接失败");
      }
    },

    //获取删除服务器里已上传的图片的请求（为了handleRemove时使用）
    async fetchDeleteImg(file) {
      let imgurl = file.response.data.url; //要删除的图片路径
      // console.log(imgurl)
      try {
        let { data } = await this.$http.delete("/upload/oldimg", {
          params: {
            imgurl
          }
        });
        // console.log(data)
        if (data.status === 1) {
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败");
        }
      } catch (error) {
        this.$message.error("服务器连接失败");
      }
    },
    //清空商品名称和商品规格
    clearGoodData() {
      this.addOnShelvesForm.g_name = "";
      this.addOnShelvesForm.g_unit = "";
      this.addOnShelvesForm.c_name = "";
      this.shelvesidData = [];
      this.fetchG_id(); //获取出货信息中全部的商品编号
    },
    //添加商品
    async addOnShelves() {
      console.log("添加商品");

      // this.fetchG_id() //获取出货信息中全部的商品编号
      // this.fetchShelvesid() //获取全部的货架号
      this.fetchDate(); //获取当前日期

      let {
        g_id,
        g_name,
        g_imgurl,
        g_imglist,
        g_unit,
        c_name,
        g_price,
        g_stock,
        g_attr,
        g_datetime,
        g_note
      } = this.addOnShelvesForm;

      this.$refs.addOnShelvesRef.validate(async valid => {
        //校验
        if (valid) {
          //校验成功获取添加上架商品的请求
          try {
            let { data } = await this.$http.post("/addonshelves", {
              g_id,
              g_name,
              g_imgurl,
              g_imglist,
              g_unit,
              c_name,
              g_price,
              g_stock,
              g_attr,
              g_datetime,
              g_note
            });
         

            if (data.status === 1) {
              //状态码为1时添加成功
              this.$message.success("添加成功");
              this.$refs.addOnShelvesRef.resetFields(); //对添加出货表单进行重置，将其值重置为初始值并移除校验结果
              this.$refs.uploadRef.clearFiles(); //清空已上传的图片
              this.addOnShelvesForm.g_note = ""; //清空备注
              // this.fetchOn_id() //获取随机的上架编号
              this.imgurl = ""; //清空要删除的图片地址
              this.imglist = ''; //清空要删除的轮播图地址
            } else {
              this.$message.error("添加失败");
            }
          } catch (error) {
            this.$message.error("服务器连接失败");
          }
        } else {
          //校验失败
          this.$message.warning("输入有误！请重新输入");
          return false;
        }
      });
    },
    async handleSuccess(res) {
      //文件上传成功时的钩子
      this.addOnShelvesForm.g_imgurl = res.data.url; //上传成功后的商品图片路径
      // console.log(this.addOnShelvesForm.g_imgurl)
      this.imgurl = res.data.url;
      this.$message.success("上传成功");
    },
     //轮播图 文件上传成功时的钩子
    async imglist_handleSuccess(res) {
      // console.log('轮播图上传：',res,' aaa ',this.addOnShelvesForm)
      if(this.addOnShelvesForm.g_imglist){
        this.addOnShelvesForm.g_imglist += ','+res.data.url; //上传成功后的商品图片路径

      }else{
        this.addOnShelvesForm.g_imglist = res.data.url; //上传成功后的商品图片路径
      }
      
      this.imglist = res.data.url;
      this.$message.success("上传成功");
    },
    handleError() {
      //文件上传失败时的钩子
      this.$message.error("上传图片失败");
    },
    handleRemove(file) {
      //图片移除文件时的钩子
      //console.log(file.response.data.url)
      this.fetchDeleteImg(file); //获取删除服务器里已上传的图片的请求
      this.addOnShelvesForm.g_imgurl = ""; //清除商品图片路径
    },
    // 轮播图
    imglist_handleRemove(file) {
      //图片移除文件时的钩子
      //console.log(file.response.data.url)
      this.fetchDeleteImg(file); //获取删除服务器里已上传的图片的请求
      this.addOnShelvesForm.g_imglist = ""; //清除商品图片路径
    },
    beforeAvatarUpload(file) {
      //上传文件之前的钩子
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    handlePictureCardPreview(file) {
      // console.log(file)
      this.addOnShelvesForm.g_imgurl = file.url;
      this.dialogVisibleAdd = true;
    },
    // 轮播图
     imglist_handlePictureCardPreview(file) {
      this.addOnShelvesForm.g_imglist = file.url;
      this.dialogVisibleAdd = true;
    },
    handleExceed() {
      //文件超出个数限制时的钩子
      this.$message.warning("抱歉！仅能上传一张图片");
    },
    resetAddOnShelves() {
      //重置
      this.$refs.addOnShelvesRef.resetFields(); //对添加出货表单进行重置，将其值重置为初始值并移除校验结果
      this.$refs.uploadRef.clearFiles(); //清空已上传的图片
      this.fetchDeleteOldImg(); //删除服务器里已上传的图片
      this.addOnShelvesForm.on_note = ""; //清空备注
      this.$message.success("重置成功");
      this.fetchOn_id(); //获取随机的上架编号
      this.fetchG_id(); //获取出货信息中全部的商品编号
      this.fetchShelvesid(); //获取全部的货架号
      this.shelvesidData = [];
    },
    //更换上架编号
    updateOn_id() {
      this.fetchOn_id(); //获取随机的上架编号
      this.$message.success("更换成功");
    },
    // 刷新时删除服务器里已上传的图片
    removeImg() {
      this.fetchDeleteOldImg(); //删除服务器里已上传的图片
    }
  },

  created() {
    this.fetchShelvesname(); //获取全部的货架类别(商品类别)
    this.fetchOn_id(); //获取随机的上架编号
    this.fetchG_id(); //获取出货信息中全部的商品编号
    this.fetchShelvesid(); //获取全部的货架号

    // 添加当浏览器刷新或关闭时触发的监听事件
    window.addEventListener("beforeunload", this.removeImg);
  },
  watch: {
    //监听路由变化
    $route(to) {
      // console.log(to.meta.title)
      if (to.meta.title === "添加上架商品") {
        this.fetchG_id(); //获取出货信息中全部的商品编号
        this.fetchShelvesid(); //获取全部的货架号
      }
    }
  }
};
</script>
