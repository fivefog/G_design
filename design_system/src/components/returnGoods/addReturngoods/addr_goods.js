export default {
    name: 'addreturngoods',
    data() {
        //退货单号自定义规则对象
        let checkR_id = async(rule, value, callback) => {
            //接收检测退货单号是否存在的Promise函数
            await this.fetchR_idTotal(value)
            callback()
        };

        //商品编号自定义规则对象
        let checkG_id = async(rule, value, callback) => {
            //接收获取商品编号对应的商品名称和商品规格的Promise函数
            await this.fetchG_idData(value)

            //接收获取商品编号对应的供应商编号的Promise函数
            await this.fetchS_id(value)

            //获取通过商品编号和供应商编号查对应的商品进价的Promise函数
            await this.fetchE_price1(value)
            this.fetchG_id() //获取全部商品编号
            callback()
        };


        //供应商编号自定义规则对象
        let checkS_id = async(rule, value, callback) => {
            //获取通过商品编号和供应商编号查对应的商品进价并校验供应商编号是否存在的Promise函数
            await this.fetchE_price(value)
            callback()
        };

        //商品进价自定义规则对象
        let checkPrice = async(rule, value, callback) => {
            //获取检验商品进价是否存在的Promise函数
            await this.fetchE_priceTotal(value)

            //获取通过商品编号和供应商编号查对应的商品进价的Promise函数
            await this.fetchE_price1(value)
            callback();

        };

        //退货数量自定义规则对象
        let checkNum = async(rule, value, callback) => {

            const num = /^[\u4E00-\u9FA5\d]{1,30}$/
            if (!num.test(value)) {
                callback(new Error('退货数量必须为数字或汉字'));
            } else if (!/^[1-9]/.test(value)) {
                callback(new Error('退货数量必须以数字开头且大于0'));
            } else {
                //接收判断退货数量是否大于库存数量的Promise函数
                await this.fetchNum(value)
            }
        };

        return {
            addR_goodsForm: { //添加退货表单数据
                r_id: '', //退货单号
                g_id: '', //商品编号
                s_id: '', //供应商编号
                g_name: '', //商品名称
                g_imgurl: '', //商品图片
                g_unit: '', //商品规格
                c_name: '', //商品类别
                e_price: '', //商品进价
                r_num: '', //退货数量
                r_totolprice: '', //退货总金额
                r_datetime: '', //退货日期
                r_note: '' //备注
            },
            confirmG_id: '', //确认过的商品编号
            g_iddata: [], //商品编号下拉列表的全部数据
            s_iddata: [], //供应商编号下拉列表的全部数据
            e_pricedata: [], //商品进价下拉列表的全部数据

            dialogVisibleAdd: false, //控制添加商品图片对话框的显示与隐藏
            goodsAction: this.$action, //商品图片上传的地址
            headers: { //商品图片上传的请求头
                superAdminAuthorization: localStorage.getItem('superAdminAuthorization')
            },

            imgurl: '', //商品图片重置前的图片路径
            addR_goodsRules: { //修改信息的校验证规则对象
                r_id: [
                    { validator: checkR_id, trigger: 'change' }
                ],
                g_id: [{
                        required: true,
                        message: '请选择商品编号',
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
                    message: '商品名称不能为空',
                    trigger: 'change'
                }],
                g_imgurl: [{
                    required: true,
                    message: '请上传商品图片',
                    trigger: 'change'
                }],
                g_unit: [{
                    required: true,
                    message: '商品规格不能为空',
                    trigger: 'change'
                }],
                c_name: [{
                    required: true,
                    message: '商品类别不能为空',
                    trigger: 'change'
                }],
                e_price: [{
                        required: true,
                        message: '请选择商品进价',
                        trigger: 'change'
                    },
                    { validator: checkPrice, trigger: 'change' }
                ],
                r_num: [{
                        required: true,
                        message: '请输入退货数量',
                        trigger: 'change'
                    }, {
                        min: 1,
                        max: 30,
                        message: '退货数量的长度在 1 到 30 个字符',
                        trigger: 'change'
                    },
                    { validator: checkNum, trigger: 'change' }
                ]
            },
        }
    },
    methods: {
        goBack() { //返回退货信息列表
            this.$router.push('/superadminhome/r_goodslist')
        },
        // 获取随机的退货单号
        fetchR_id() {
            let id1 = this.$moment().format('YYYYMMDD')
            let id2 = Math.random().toString().slice(2, 6)
            let r_id = id1 + id2
            this.addR_goodsForm.r_id = parseInt(r_id)
                // console.log(this.addR_goodsForm.r_id)
        },
        //获取当前日期
        fetchDate() {
            this.addR_goodsForm.r_datetime = this.$moment().format('YYYY-MM-DD')
                // console.log(this.addR_goodsForm.r_datetime)
        },
        //获取商品编号对应的商品名称和商品规格的请求
        async fetchG_idData(value) {
            let g_id = value
            try {
                let {
                    data
                } = await this.$http.get('/downshelveslist/query', {
                        params: {
                            g_id
                        }
                    })
                    // console.log(data.data) //输出商品编号对应的信息
                let { g_name, g_unit, c_name } = data.data

                return new Promise((resolve, reject) => {
                    if (data.status === 1) {
                        this.addR_goodsForm.g_name = g_name
                        this.addR_goodsForm.g_unit = g_unit
                        this.addR_goodsForm.c_name = c_name
                        this.confirmG_id = g_id
                        resolve(true)
                    } else {
                        this.addR_goodsForm.g_name = ''
                        this.addR_goodsForm.g_unit = ''
                        this.addR_goodsForm.c_name = ''
                        this.confirmG_id = ''
                        this.s_iddata = []
                        this.e_pricedata = []
                        reject('该商品编号不存在！请重新选择')
                    }
                })

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取根据商品编号查询下架商品数量,退货数量的请求(判断退货数量是否大于剩余数量)
        async fetchNum(value) {
            let { g_id } = this.addR_goodsForm
            value = parseInt(value) //字符串转换为整数(修改后的退货数量)
            let num //剩余数量

            // console.log(typeof(g_id))
            if (typeof(g_id) !== "string") {
                try {
                    let {
                        data
                    } = await this.$http.get(`/returngoodslist/num/${g_id}`)
                        // console.log(data.data) //输出下架商品数量,退货数量

                    return new Promise((resolve, reject) => {
                        if (data.status === 1 && data.data.length > 0) {

                            if (data.data[1] !== undefined) {

                                let down_num = data.data[0].down_num //下架商品数量
                                let r_num = data.data[1].r_num //退货数量
                                num = down_num - (value + r_num) //剩余数量

                            } else {
                                let down_num = data.data[0].down_num //下架商品数量
                                num = down_num - value //剩余数量
                            }

                            // console.log(num)
                            if (num >= 0) {
                                resolve(true)
                            } else {
                                reject('退货数量大于下架商品剩余数量！请重新输入')
                            }
                        } else {
                            resolve(true)
                        }
                    })
                } catch (error) {
                    this.$message.error('服务器连接失败')
                }
            }
        },
        //获取计算退货单号总数的请求(用来检测修改后的退货单号是否已经存在)
        async fetchR_idTotal(value) {
            let r_id = value
            try {
                let {
                    data
                } = await this.$http.get('/returngoodslist/total', {
                        params: {
                            r_id
                        }
                    })
                    // console.log(data.data) //输出退货单号总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //退货单号总数等于0返回true(说明退货单号没重复)
                        if (data.data === 0) {
                            resolve(true)
                        } else {
                            reject('该退货单号已存在！请更换退货单号')
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取全部的商品编号
        async fetchG_id() {
            try {
                let {
                    data
                } = await this.$http.get('/downshelveslist')
                    // console.log(data.data) //输出全部的商品编号
                this.g_iddata = data.data
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取商品编号对应的供应商编号的请求
        async fetchS_id(value) {
            let g_id = value
            try {
                let {
                    data
                } = await this.$http.get('/enterstocklist/querys_id', {
                        params: {
                            g_id
                        }
                    })
                    // console.log(data.data) //输出商品编号对应的供应商编号

                return new Promise(resolve => {
                    if (data.status === 1 && g_id === this.confirmG_id) {
                        this.s_iddata = data.data
                        resolve(true)
                    }
                })

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取通过商品编号和供应商编号查对应的商品进价的请求
        async fetchE_price(value) {
            let s_id = value
            let { g_id } = this.addR_goodsForm
            try {
                let {
                    data
                } = await this.$http.get('/enterstocklist/querye_price', {
                        params: {
                            g_id,
                            s_id
                        }
                    })
                    // console.log(data.data) //输出通过商品编号和供应商编号查对应的商品进价

                return new Promise((resolve, reject) => {
                    if (data.status === 1 && g_id === this.confirmG_id) {
                        if (data.data.length > 0) {
                            this.e_pricedata = data.data
                            resolve(true)
                        } else {
                            reject('该供应商编号与商品编号不匹配！请重新选择')
                        }
                    }
                })

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取通过商品编号和供应商编号查对应的商品进价的请求
        async fetchE_price1() {
            let { g_id, s_id } = this.addR_goodsForm
            try {
                let {
                    data
                } = await this.$http.get('/enterstocklist/querye_price', {
                        params: {
                            g_id,
                            s_id
                        }
                    })
                    // console.log(data.data) //输出通过商品编号和供应商编号查对应的商品进价

                return new Promise((resolve) => {
                    if (data.status === 1) {
                        if (data.data.length > 0) {
                            this.e_pricedata = data.data
                            resolve(true)
                        } else {
                            this.e_pricedata = []
                        }
                    }
                })

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算商品进价总数的请求(用来检测修改后的商品进价是否在进货信息列表中存在)
        async fetchE_priceTotal(value) {
            let e_price = value
            let { g_id, s_id } = this.addR_goodsForm
            try {
                let {
                    data
                } = await this.$http.get('/enterstocklist/total', {
                        params: {
                            g_id,
                            e_price,
                            s_id
                        }
                    })
                    // console.log(data.data) //输出商品进价总数
                if (data.status === 1 && g_id === this.confirmG_id) {
                    return new Promise((resolve, reject) => {
                        //供应商编号总数等于0说明该商品进价不存在
                        if (data.data === 0) {
                            reject('该商品进价与商品编号不匹配！请重新选择')
                        } else {
                            resolve(true)
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
        //清空商品名称、商品规格、商品类别、供应商编号下拉列表、商品进价下拉列表
        clearGoodData() {
            this.addR_goodsForm.g_name = ''
            this.addR_goodsForm.g_unit = ''
            this.addR_goodsForm.c_name = ''
            this.s_iddata = []
            this.e_pricedata = []
            this.fetchG_id() //获取全部商品编号
        },
        async addR_goods() { //添加退货信息
            this.fetchTotolPrice //获取计算退货总金额的属性
            this.fetchG_id() //获取全部商品编号
            this.fetchDate() //获取当前日期

            let {
                r_id,
                g_id,
                s_id,
                g_name,
                g_imgurl,
                g_unit,
                c_name,
                e_price,
                r_num,
                r_totolprice,
                r_datetime,
                r_note
            } = this.addR_goodsForm

            this.$refs.addR_goodsRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取添加退货信息的请求
                    try {
                        let {
                            data
                        } = await this.$http.post('/addreturngoods', {
                                r_id,
                                g_id,
                                s_id,
                                g_name,
                                g_imgurl,
                                g_unit,
                                c_name,
                                e_price,
                                r_num,
                                r_totolprice,
                                r_datetime,
                                r_note
                            })
                            // console.log(data)
                        if (data.status === 1) { //状态码为1时添加成功
                            this.$message.success('添加成功')
                            this.$refs.addR_goodsRef.resetFields() //对添加退货表单进行重置，将其值重置为初始值并移除校验结果
                            this.$refs.uploadRef.clearFiles() //清空已上传的图片
                            this.addR_goodsForm.r_note = '' //清空备注
                            this.fetchR_id() //获取随机的退货单号
                            this.s_iddata = []
                            this.e_pricedata = []
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
            this.addR_goodsForm.g_imgurl = res.data.url //上传成功后的商品图片路径
                // console.log(this.addR_goodsForm.g_imgurl)
            this.imgurl = res.data.url
            this.$message.success('上传成功')
        },
        handleError() { //文件上传失败时的钩子
            this.$message.error('上传图片失败')
        },
        handleRemove(file) { //图片移除文件时的钩子
            //console.log(file.response.data.url)
            this.fetchDeleteImg(file) //获取删除服务器里已上传的图片的请求
            this.addR_goodsForm.g_imgurl = '' //清除商品图片路径
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
            this.addR_goodsForm.g_imgurl = file.url;
            this.dialogVisibleAdd = true;
        },
        handleExceed() { //文件超出个数限制时的钩子
            this.$message.warning('抱歉！仅能上传一张图片');
        },
        resetAddR_goods() { //重置
            this.$refs.addR_goodsRef.resetFields() //对添加退货表单进行重置，将其值重置为初始值并移除校验结果 
            this.$refs.uploadRef.clearFiles() //清空已上传的图片
            this.fetchDeleteOldImg() //删除服务器里已上传的图片
            this.addR_goodsForm.r_note = '' //清空备注
            this.$message.success('重置成功')
            this.fetchR_id() //获取随机的退货单号
            this.fetchG_id() //获取全部商品编号
            this.s_iddata = []
            this.e_pricedata = []
        },
        //更换退货单号
        updateR_id() {
            this.fetchR_id() //获取随机的退货单号
            this.$message.success('更换成功')
        },
        // 刷新时删除服务器里已上传的图片
        removeImg() {
            this.fetchDeleteOldImg() //删除服务器里已上传的图片
        }
    },
    created() {
        this.fetchR_id() //获取随机的退货单号
        this.fetchG_id() //获取全部商品编号

        // 添加当浏览器刷新或关闭时触发的监听事件
        window.addEventListener('beforeunload', this.removeImg)
    },
    watch: { //监听路由变化
        $route(to) {
            // console.log(to.meta.title)
            if (to.meta.title === '添加退货信息') {
                this.fetchG_id() //获取全部商品编号
            }
        }
    },
    computed: {
        //计算退货总金额(商品进价*退货数量)
        fetchTotolPrice() {
            let { r_num, e_price } = this.addR_goodsForm
            return this.addR_goodsForm.r_totolprice = parseInt(r_num) * e_price
        }
    }
}