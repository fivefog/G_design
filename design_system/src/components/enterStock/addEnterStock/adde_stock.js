export default {
    name: 'addenterstock',
    data() {
        //进货单号自定义规则对象
        let checkE_id = async(rule, value, callback) => {
            //接收检测进货单号是否存在的Promise函数
            await this.fetchE_idTotal(value)
            callback()
        };

        //商品编号自定义规则对象
        let checkG_id = async(rule, value, callback) => {
            if (!/^\d{1,13}$/.test(value)) {
                callback(new Error('商品编号必须为不超过13位的数字'));
            } else {
                //接收获取商品编号对应的商品名称和商品规格的Promise函数
                await this.fetchG_idData(value)
            }
        };

        //供应商编号自定义规则对象
        let checkS_id = async(rule, value, callback) => {
            //接收检测供应商编号是否存在的Promise函数
            await this.fetchS_idTotal(value)
            this.fetchS_id() //获取全部供应商编号
            callback()
        };

        //商品名称自定义规则对象
        let checkG_name = (rule, value, callback) => {
            const name = /^[\u4E00-\u9FA5]{1,30}$/
            if (!name.test(value)) {
                callback(new Error('商品名称必须为汉字'));
            } else {
                callback();
            }
        };

        //商品规格自定义规则对象
        let checkUnit = (rule, value, callback) => {
            if (!/^[\u4E00-\u9FA5\w/ *]{1,30}$/.test(value)) {
                callback(new Error('商品规格必须为汉字或数字、字母、下划线、/、*'));
            } else {
                callback();
            }
        };

        //商品类别自定义规则对象
        let checkC_name = async(rule, value, callback) => {
            //接收检测商品类别是否存在的Promise函数
            await this.fetchC_nameTotal(value)
            this.fetchC_name() //获取全部的商品类别
            callback()
        };


        //商品进价自定义规则对象
        let checkPrice = (rule, value, callback) => {
            const price = /^\d+(\.\d{1,2})?$/
            if (!price.test(value)) {
                callback(new Error('商品进价必须为整数或最多带两位小数的数字'));
            } else {
                callback();
            }
        };

        //进货数量自定义规则对象
        let checkNum = (rule, value, callback) => {
            const num = /^[\u4E00-\u9FA5\d]{1,30}$/
            if (!num.test(value)) {
                callback(new Error('进货数量必须为数字或汉字'));
            } else if (!/^[1-9]/.test(value)) {
                callback(new Error('进货数量必须以数字开头且大于0'));
            } else {
                callback();
            }
        };

        //存放位置自定义规则对象
        let checkW_name = async(rule, value, callback) => {
            //接收检测存放位置是否存在的Promise函数
            await this.fetchW_nameTotal(value)
            this.fetchW_name() //获取全部的仓库名称
            callback()
        };

        return {
            addE_stockForm: { //添加进货表单数据
                e_id: '', //进货单号
                g_id: '', //商品编号
                s_id: '', //供应商编号
                g_name: '', //商品名称
                g_imgurl: '', //商品图片
                g_unit: '', //商品规格
                c_name: '', //商品类别
                e_price: '', //商品进价
                e_num: '', //进货数量
                e_totolprice: '', //进货总金额
                e_datetime: '', //进货日期
                w_name: '', //存放位置 
                e_note: '' //备注
            },
            s_iddata: [], //供应商编号下拉列表的全部数据
            c_namedata: [], //商品类别下拉列表的全部数据
            w_namedata: [], //存放位置下拉列表的全部数据

            validate: false, //是否校验
            dialogVisibleAdd: false, //控制添加商品图片对话框的显示与隐藏
            goodsAction: this.$action, //商品图片上传的地址
            headers: { //商品图片上传的请求头
                superAdminAuthorization: localStorage.getItem('superAdminAuthorization')
            },

            imgurl: '', //商品图片重置前的图片路径
            addE_stockRules: { //修改信息的校验证规则对象
                e_id: [
                    { validator: checkE_id, trigger: 'change' }
                ],
                g_id: [{
                        required: true,
                        message: '请输入商品编号',
                        trigger: 'change'
                    },
                    { validator: checkG_id, trigger: 'change' }
                ],
                s_id: [{
                        required: true,
                        message: '请选择供应商编号',
                        trigger: 'change'
                    },
                    { validator: checkS_id, trigger: 'change' }
                ],
                g_name: [{
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'change'
                    }, {
                        min: 1,
                        max: 30,
                        message: '商品名称的长度在 1 到 30 个字符',
                        trigger: 'change'
                    },
                    { validator: checkG_name, trigger: 'change' }
                ],
                g_imgurl: [{
                    required: true,
                    message: '请上传商品图片',
                    trigger: 'change'
                }],
                g_unit: [{
                        required: true,
                        message: '请输入商品规格',
                        trigger: 'change'
                    },
                    {
                        min: 1,
                        max: 30,
                        message: '商品规格的长度在 1 到 30 个字符',
                        trigger: 'change'
                    },
                    { validator: checkUnit, trigger: 'change' }
                ],
                c_name: [{
                        required: true,
                        message: '请选择商品类别',
                        trigger: 'change'
                    },
                    { validator: checkC_name, trigger: 'change' }
                ],
                e_price: [{
                        required: true,
                        message: '请输入商品进价',
                        trigger: 'change'
                    },
                    { validator: checkPrice, trigger: 'change' }
                ],
                e_num: [{
                        required: true,
                        message: '请输入进货数量',
                        trigger: 'change'
                    }, {
                        min: 1,
                        max: 30,
                        message: '进货数量的长度在 1 到 30 个字符',
                        trigger: 'change'
                    },
                    { validator: checkNum, trigger: 'change' }
                ],
                w_name: [{
                        required: true,
                        message: '请选择存放位置',
                        trigger: 'change'
                    },
                    { validator: checkW_name, trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        goBack() { //返回进货信息列表
            this.$router.push('/superadminhome/enterstocklist')
        },
        // 获取随机的进货单号
        fetchE_id() {
            let id1 = this.$moment().format('YYYYMMDD')
            let id2 = Math.random().toString().slice(2, 6)
            let e_id = id1 + id2
            this.addE_stockForm.e_id = parseInt(e_id)
                // console.log(this.addE_stockForm.e_id)
        },
        //获取当前日期
        fetchDate() {
            this.addE_stockForm.e_datetime = this.$moment().format('YYYY-MM-DD')
                // console.log(this.addE_stockForm.e_datetime)
        },
        //获取商品编号对应的商品名称和商品规格的请求
        async fetchG_idData(value) {
            let g_id = value
            try {
                let {
                    data
                } = await this.$http.get('/enterstocklist/query', {
                        params: {
                            g_id
                        }
                    })
                    // console.log(data.data) //输出商品编号对应的信息
                let { g_name, g_unit, c_name } = data.data

                if (data.status === 1) {
                    return new Promise(resolve => {
                        this.addE_stockForm.g_name = g_name
                        this.addE_stockForm.g_unit = g_unit
                        this.addE_stockForm.c_name = c_name
                        resolve(true)
                    })
                } else {
                    // 如果未校验
                    if (this.validate === false) {
                        this.addE_stockForm.g_name = ''
                        this.addE_stockForm.g_unit = ''
                        this.addE_stockForm.c_name = ''
                    }
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算供应商编号总数的请求(用来检测修改后的供应商编号是否在供应商列表中存在)
        async fetchS_idTotal(value) {
            let s_id = value
            try {
                let {
                    data
                } = await this.$http.get('/supplierlist/total', {
                        params: {
                            s_id
                        }
                    })
                    // console.log(data.data) //输出供应商编号总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //供应商编号总数等于0说明该供应商编号不存在
                        if (data.data === 0) {
                            reject('该供应商编号不存在！请重新选择')
                        } else {
                            resolve(true)
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取全部的供应商编号
        async fetchS_id() {
            try {
                let {
                    data
                } = await this.$http.get('/supplierlist')
                    // console.log(data.data) //输出全部的供应商编号
                this.s_iddata = data.data
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算商品类别总数的请求(用来检测修改后的商品类别是否在商品分类列表中存在)
        async fetchC_nameTotal(value) {
            let c_name = value
            try {
                let {
                    data
                } = await this.$http.get('/categorylist/total', {
                        params: {
                            c_name
                        }
                    })
                    // console.log(data.data) //输出商品类别总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //商品类别总数等于0说明该商品类别不存在
                        if (data.data === 0) {
                            reject('该商品类别不存在！请重新选择')
                        } else {
                            resolve(true)
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取全部的商品类别
        async fetchC_name() {
            try {
                let {
                    data
                } = await this.$http.get('/categorylist')
                    // console.log(data.data) //输出全部的商品类别
                this.c_namedata = data.data
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算仓库名称总数的请求(用来检测修改后的仓库名称是否在仓库信息列表中存在)
        async fetchW_nameTotal(value) {
            let w_name = value
            try {
                let {
                    data
                } = await this.$http.get('/warehouselist/total', {
                        params: {
                            w_name
                        }
                    })
                    // console.log(data.data) //输出仓库名称总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //仓库名称总数等于0说明该存放位置不存在
                        if (data.data === 0) {
                            this.validate = true
                            reject('该存放位置不存在！请重新选择')
                        } else {
                            resolve(true)
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取全部的仓库名称
        async fetchW_name() {
            try {
                let {
                    data
                } = await this.$http.get('/warehouselist')
                    // console.log(data.data) //输出全部的仓库名称
                this.w_namedata = data.data
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算进货单号总数的请求(用来检测修改后的进货单号是否已经存在)
        async fetchE_idTotal(value) {
            let e_id = value
            try {
                let {
                    data
                } = await this.$http.get('/enterstocklist/total', {
                        params: {
                            e_id
                        }
                    })
                    // console.log(data.data) //输出进货单号总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //进货单号总数等于0返回true(说明进货单号没重复)
                        if (data.data === 0) {
                            resolve(true)
                        } else {
                            reject('该进货单号已存在！请更换进货单号')
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取删除服务器里已上传的图片的请求(为了添加后清空图片或重置时使用)
        async fetchDeleteOldImg() {

            let imgurl = this.imgurl //要删除的图片路径
                // console.log(imgurl)
            try {
                await this.$http.delete('/upload/oldimg', {
                    params: {
                        imgurl
                    }
                })
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //获取删除服务器里已上传的图片的请求（为了handleRemove时使用）
        async fetchDeleteImg(file) {

            let imgurl = file.response.data.url //要删除的图片路径
                // console.log(imgurl)
            try {
                let {
                    data
                } = await this.$http.delete('/upload/oldimg', {
                        params: {
                            imgurl
                        }
                    })
                    // console.log(data)
                if (data.status === 1) {
                    this.$message.success('删除成功')
                } else {
                    this.$message.error('删除失败')
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        async addE_stock() { //添加进货信息
            this.validate = true //已校验
            this.fetchDate() //获取当前日期
            this.fetchS_id() //获取全部供应商编号
            this.fetchC_name() //获取全部的商品类别
            this.fetchW_name() //获取全部的仓库名称

            this.fetchTotolPrice //获取计算进货总金额的属性
            let {
                e_id,
                g_id,
                s_id,
                g_name,
                g_imgurl,
                g_unit,
                c_name,
                e_price,
                e_num,
                e_totolprice,
                w_name,
                e_datetime,
                e_note
            } = this.addE_stockForm

            this.$refs.addE_stockRef.validate(async(valid) => { //校验
                // this.validate = true //已校验
                if (valid) { //校验成功获取添加进货信息的请求
                    try {
                        let {
                            data
                        } = await this.$http.post('/addenterstock', {
                                e_id,
                                g_id,
                                s_id,
                                g_name,
                                g_imgurl,
                                g_unit,
                                c_name,
                                e_price,
                                e_num,
                                e_totolprice,
                                w_name,
                                e_datetime,
                                e_note
                            })
                            // console.log(data)
                        if (data.status === 1) { //状态码为1时添加成功
                            this.$message.success('添加成功')
                            this.$refs.addE_stockRef.resetFields() //对添加进货表单进行重置，将其值重置为初始值并移除校验结果
                            this.$refs.uploadRef.clearFiles() //清空已上传的图片
                            this.fetchE_id() //获取随机的进货单号
                            this.imgurl = '' //清空要删除的图片地址
                        } else {
                            this.$message.error('添加失败')
                        }
                    } catch (error) {
                        this.$message.error('服务器连接失败')
                    }
                } else { //校验失败
                    this.$message.warning('输入有误！请重新输入')
                    return false;
                }
            })
        },
        async handleSuccess(res) { //文件上传成功时的钩子
            this.addE_stockForm.g_imgurl = res.data.url //上传成功后的商品图片路径
                // console.log(this.addE_stockForm.g_imgurl)
            this.imgurl = res.data.url
            this.$message.success('上传成功')
        },
        handleError() { //文件上传失败时的钩子
            this.$message.error('上传图片失败')
        },
        handleRemove(file) { //图片移除文件时的钩子
            //console.log(file.response.data.url)
            this.fetchDeleteImg(file) //获取删除服务器里已上传的图片的请求
            this.addE_stockForm.g_imgurl = '' //清除商品图片路径
        },
        beforeAvatarUpload(file) { //上传文件之前的钩子
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
        handlePictureCardPreview(file) {
            // console.log(file)
            this.addE_stockForm.g_imgurl = file.url;
            this.dialogVisibleAdd = true;
        },
        handleExceed() { //文件超出个数限制时的钩子
            this.$message.warning('抱歉！仅能上传一张图片');
        },
        resetAddE_stock() { //重置
            this.$refs.addE_stockRef.resetFields() //对添加进货表单进行重置，将其值重置为初始值并移除校验结果
            this.$refs.uploadRef.clearFiles() //清空已上传的图片
            this.fetchDeleteOldImg() //删除服务器里已上传的图片
            this.addE_stockForm.e_note = '' //备注
            this.$message.success('重置成功')
            this.fetchE_id() //获取随机的进货单号
            this.fetchS_id() //获取全部供应商编号
            this.fetchC_name() //获取全部的商品类别
            this.fetchW_name() //获取全部的仓库名称
            this.validate = false
        },
        //更换进货单号
        updateE_id() {
            this.fetchE_id() //获取随机的进货单号
            this.$message.success('更换成功')
        },
        // 刷新时删除服务器里已上传的图片
        removeImg() {
            this.fetchDeleteOldImg() //删除服务器里已上传的图片
        }
    },
    created() {
        this.fetchE_id() //获取随机的进货单号
        this.fetchS_id() //获取全部供应商编号
        this.fetchC_name() //获取全部的商品类别
        this.fetchW_name() //获取全部的仓库名称

        // 添加当浏览器刷新或关闭时触发的监听事件
        window.addEventListener('beforeunload', this.removeImg)
    },
    watch: { //监听路由变化
        $route(to) {
            // console.log(to.meta.title)
            if (to.meta.title === '添加进货信息') {
                this.fetchS_id() //获取全部供应商编号
                this.fetchC_name() //获取全部的商品类别
                this.fetchW_name() //获取全部的仓库名称
                this.validate = false
            }
        },
        validate(val) {
            if (val === true) {
                // 一次性计时器进行延迟
                setTimeout(() => {
                    this.validate = false
                }, 1000);
            }
        }
    },
    computed: {
        //计算进货总金额(商品进价*进货数量)
        fetchTotolPrice() {
            let { e_num, e_price } = this.addE_stockForm
            return this.addE_stockForm.e_totolprice = parseInt(e_num) * e_price
        }
    }
}