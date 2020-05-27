export default {
    name: 'addoutstock',
    data() {
        //出货单号自定义规则对象
        let checkO_id = async(rule, value, callback) => {
            //接收检测出货单号是否存在的Promise函数
            await this.fetchO_idTotal(value)
            callback()
        };

        //商品编号自定义规则对象
        let checkG_id = async(rule, value, callback) => {
            //接收获取商品编号对应的商品名称和商品规格的Promise函数
            await this.fetchG_idData(value)
            this.fetchG_id() //获取全部的商品编号
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

        //出货数量自定义规则对象
        let checkNum = async(rule, value, callback) => {
            const num = /^[\u4E00-\u9FA5\d]{1,30}$/
            if (!num.test(value)) {
                callback(new Error('出货数量必须为数字或汉字'));
            } else if (!/^[1-9]/.test(value)) {
                callback(new Error('出货数量必须以数字开头且大于0'));
            } else {
                //接收判断出货数量是否大于库存数量的Promise函数
                await this.fetchNum(value)
            }
        };

        return {
            addO_stockForm: { //添加出货表单数据
                o_id: '', //出货单号
                g_id: '', //商品编号
                g_name: '', //商品名称
                g_imgurl: '', //商品图片
                g_unit: '', //商品规格
                c_name: '', //商品类别
                o_price: '', //商品预售价
                o_num: '', //出货数量
                o_totolprice: '', //出货总金额
                o_datetime: '', //出货日期
                o_note: '' //备注
            },
            g_iddata: [], //商品编号下拉列表的全部数据

            isTrue: false,
            dialogVisibleAdd: false, //控制添加商品图片对话框的显示与隐藏
            goodsAction: this.$action, //商品图片上传的地址
            headers: { //商品图片上传的请求头
                superAdminAuthorization: localStorage.getItem('superAdminAuthorization')
            },

            imgurl: '', //商品图片重置前的图片路径
            addO_stockRules: { //修改信息的校验证规则对象
                o_id: [
                    { validator: checkO_id, trigger: 'change' }
                ],
                g_id: [{
                        required: true,
                        message: '请选择商品编号',
                        trigger: 'change'
                    },
                    { validator: checkG_id, trigger: 'change' }
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
                o_price: [{
                        required: true,
                        message: '请输入商品进价',
                        trigger: 'change'
                    },
                    { validator: checkPrice, trigger: 'change' }
                ],
                o_num: [{
                        required: true,
                        message: '请输入出货数量',
                        trigger: 'change'
                    }, {
                        min: 1,
                        max: 30,
                        message: '出货数量的长度在 1 到 30 个字符',
                        trigger: 'change'
                    },
                    { validator: checkNum, trigger: 'change' }
                ]
            },
        }
    },
    methods: {
        goBack() { //返回出货信息列表
            this.$router.push('/superadminhome/outstocklist')
        },
        // 获取随机的出货单号
        fetchO_id() {
            let id1 = this.$moment().format('YYYYMMDD')
            let id2 = Math.random().toString().slice(2, 6)
            let o_id = id1 + id2
            this.addO_stockForm.o_id = parseInt(o_id)
                // console.log(this.addO_stockForm.o_id)
        },
        //获取当前日期
        fetchDate() {
            this.addO_stockForm.o_datetime = this.$moment().format('YYYY-MM-DD')
                // console.log(this.addO_stockForm.o_datetime)
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
                return new Promise((resolve, reject) => {
                    if (data.status === 1) {
                        this.addO_stockForm.g_name = g_name
                        this.addO_stockForm.g_unit = g_unit
                        this.addO_stockForm.c_name = c_name
                        resolve(true)
                    } else {
                        this.addO_stockForm.g_name = ''
                        this.addO_stockForm.g_unit = ''
                        this.addO_stockForm.c_name = ''
                        reject('该商品编号不存在！请重新选择')
                    }
                })

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取全部的商品编号
        async fetchG_id() {
            try {
                let {
                    data
                } = await this.$http.get('/enterstocklist')
                    // console.log(data.data) //输出全部的商品编号
                this.g_iddata = data.data
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取根据商品编号查询出货数量,出货数量的请求(判断出货数量是否大于库存数量)
        async fetchNum(value) {
            let { g_id } = this.addO_stockForm
            value = parseInt(value) //字符串转换为整数(修改后的出货数量)
            let stocknum //库存数量

            // console.log(typeof(g_id))
            if (typeof(g_id) !== "string") { //如果g_id的类型不是字符串
                try {
                    let {
                        data
                    } = await this.$http.get(`/stocklist/${g_id}`)
                        // console.log(data.data) //输出出货数量,出货数量

                    return new Promise((resolve, reject) => {
                        if (data.status === 1 && data.data.length > 0) {
                            if (data.data[1] !== undefined) {

                                let e_num = data.data[0].e_num //出货数量
                                let o_num = data.data[1].o_num //出货数量
                                stocknum = e_num - (value + o_num) //库存数量

                            } else {
                                let e_num = data.data[0].e_num //出货数量
                                stocknum = e_num - value //库存数量
                            }

                            // console.log(stocknum)
                            if (stocknum >= 0) {
                                resolve(true)
                            } else {
                                reject('出货数量大于库存数量！请重新输入')
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
        //获取计算出货单号总数的请求(用来检测修改后的出货单号是否已经存在)
        async fetchO_idTotal(value) {
            let o_id = value
            try {
                let {
                    data
                } = await this.$http.get('/outstocklist/total', {
                        params: {
                            o_id
                        }
                    })
                    // console.log(data.data) //输出出货单号总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //出货单号总数等于0返回true(说明出货单号没重复)
                        if (data.data === 0) {
                            resolve(true)
                        } else {
                            reject('该出货单号已存在！请更换出货单号')
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
        //清空商品名称、商品规格、商品类别
        clearGoodData() {
            this.addO_stockForm.g_name = ''
            this.addO_stockForm.g_unit = ''
            this.addO_stockForm.c_name = ''
            this.fetchG_id() //获取全部的商品编号
        },
        async addO_stock() { //添加出货信息
            this.fetchTotolPrice //获取计算出货总金额的属性
            this.fetchG_id() //获取全部商品编号
            this.fetchDate() //获取当前日期

            let {
                o_id,
                g_id,
                g_name,
                g_imgurl,
                g_unit,
                c_name,
                o_price,
                o_num,
                o_totolprice,
                o_datetime,
                o_note
            } = this.addO_stockForm

            this.$refs.addO_stockRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取添加出货信息的请求
                    try {
                        let {
                            data
                        } = await this.$http.post('/addoutstock', {
                                o_id,
                                g_id,
                                g_name,
                                g_imgurl,
                                g_unit,
                                c_name,
                                o_price,
                                o_num,
                                o_totolprice,
                                o_datetime,
                                o_note
                            })
                            // console.log(data)
                        if (data.status === 1) { //状态码为1时添加成功
                            this.$message.success('添加成功')
                            this.$refs.addO_stockRef.resetFields() //对添加出货表单进行重置，将其值重置为初始值并移除校验结果
                            this.$refs.uploadRef.clearFiles() //清空已上传的图片
                            this.addO_stockForm.o_note = '' //清空备注
                            this.fetchO_id() //获取随机的出货单号
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
            this.addO_stockForm.g_imgurl = res.data.url //上传成功后的商品图片路径
                // console.log(this.addO_stockForm.g_imgurl)
            this.imgurl = res.data.url
            this.$message.success('上传成功')
        },
        handleError() { //文件上传失败时的钩子
            this.$message.error('上传图片失败')
        },
        handleRemove(file) { //图片移除文件时的钩子
            //console.log(file.response.data.url)
            this.fetchDeleteImg(file) //获取删除服务器里已上传的图片的请求
            this.addO_stockForm.g_imgurl = '' //清除商品图片路径
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
            this.addO_stockForm.g_imgurl = file.url;
            this.dialogVisibleAdd = true;
        },
        handleExceed() { //文件超出个数限制时的钩子
            this.$message.warning('抱歉！仅能上传一张图片');
        },
        resetAddO_stock() { //重置
            this.$refs.addO_stockRef.resetFields() //对添加出货表单进行重置，将其值重置为初始值并移除校验结果 
            this.$refs.uploadRef.clearFiles() //清空已上传的图片
            this.fetchDeleteOldImg() //删除服务器里已上传的图片
            this.addO_stockForm.o_note = '' //清空备注
            this.$message.success('重置成功')
            this.fetchG_id() //获取全部商品编号
            this.fetchO_id() //获取随机的出货单号
            this.fetchDate() //获取当前日期
        },
        //更换出货单号
        updateO_id() {
            this.fetchO_id() //获取随机的出货单号
            this.$message.success('更换成功')
        },
        // 刷新时删除服务器里已上传的图片
        removeImg() {
            this.fetchDeleteOldImg() //删除服务器里已上传的图片
        }
    },
    created() {
        this.fetchO_id() //获取随机的出货单号
        this.fetchG_id() //获取全部商品编号

        // 添加当浏览器刷新或关闭时触发的监听事件
        window.addEventListener('beforeunload', this.removeImg)
    },
    watch: { //监听路由变化
        $route(to) {
            // console.log(to.meta.title)
            if (to.meta.title === '添加出货信息') {
                this.fetchG_id() //获取全部商品编号
            }
        }
    },
    computed: {
        //计算出货总金额(商品进价*出货数量)
        fetchTotolPrice() {
            let { o_num, o_price } = this.addO_stockForm
            return this.addO_stockForm.o_totolprice = parseInt(o_num) * o_price
        }
    }
}