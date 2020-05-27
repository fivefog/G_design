export default {
    name: 'addsale',
    data() {
        //销售单号自定义规则对象
        let checkSaleid = async(rule, value, callback) => {
            //接收检测销售单号是否存在的Promise函数
            await this.fetchSaleidTotal(value)
            callback()
        };

        //员工号自定义规则对象
        let checkS_id = async(rule, value, callback) => {
            //接收获取员工号是否存在的Promise函数
            await this.fetchS_idTotal(value)
            this.fetchS_id() //获取全部的员工号
            callback()
        };

        //商品编号自定义规则对象
        let checkG_id = async(rule, value, callback) => {
            //接收获取商品编号对应的商品名称和商品规格的Promise函数
            await this.fetchG_idData(value)
            this.fetchG_id() //获取上架商品中全部的商品编号

            if (this.addSaleForm.s_role === '会员') {
                //接收获取商品编号对应的会员价格的Promise函数
                await this.fetchV_price1(value)
            } else if (this.addSaleForm.s_role === '非会员') {
                //接收获取商品编号对应的非会员价格的Promise函数
                await this.fetchPrice1(value)
            }
            callback()
        };

        //消费角色自定义规则对象
        let checkRole = async(rule, value, callback) => {
            if (value === '会员') {
                this.fetchV_id() //获取全部的会员号
                this.fetchV_price() //获取全部的会员价格
            } else {
                this.v_iddata = [] //使会员号下拉列表数据为空
                this.addSaleForm.v_id = '' //清空会员号
                this.fetchPrice() //获取全部的非会员价格
            }
            callback()
        };

        //会员号自定义规则对象
        let checkV_id = async(rule, value, callback) => {
            if (this.addSaleForm.s_role === '会员' && !value) {
                callback(new Error('请选择会员号'));
            } else {
                //接收获取会员号是否存在的Promise函数
                await this.fetchV_idTotal(value)
            }
        };

        //销售价格自定义规则对象
        let checkPrice = async(rule, value, callback) => {

            if (this.addSaleForm.s_role === '会员') {
                //接收获取会员价格是否存在的Promise函数
                await this.fetchV_priceTotal(value)
            } else if (this.addSaleForm.s_role === '非会员') {
                //接收获取非会员价格是否存在的Promise函数
                await this.fetchPriceTotal(value)
            }
            callback();
        };

        //销售数量自定义规则对象
        let checkNum = async(rule, value, callback) => {
            const num = /^[\u4E00-\u9FA5\d]{1,30}$/
            if (!num.test(value)) {
                callback(new Error('销售数量必须为数字或汉字'));
            } else if (!/^[1-9]/.test(value)) {
                callback(new Error('销售数量必须以数字开头且大于0'));
            } else {
                //接收判断销售数量是否大于上架商品剩余数量的Promise函数
                await this.fetchNum(value)
            }
        };
        return {
            addSaleForm: { //添加销售信息表单数据
                saleid: '', //销售单号
                s_id: '', //员工号
                g_id: '', //商品编号
                g_name: '', //商品名称
                g_imgurl: '', //商品图片
                g_unit: '', //商品规格
                c_name: '', //商品类别
                s_price: '', //销售价格
                s_num: '', //销售数量
                s_totolprice: '', //销售单总金额
                s_role: '', //消费角色
                v_id: '', //会员号
                s_datetime: '', //销售日期
                s_note: '' //备注
            },
            s_iddata: [], //员工号下拉列表的全部数据
            g_iddata: [], //商品编号下拉列表的全部数据
            v_iddata: [], //会员号下拉列表的全部数据
            s_priceData: [], //销售价格下拉列表的全部数据

            dialogVisibleAdd: false, //控制添加商品图片对话框的显示与隐藏
            s_role: [{ //消费角色下拉框数据
                    value: '会员'
                },
                {
                    value: '非会员'
                }
            ],

            goodsAction: this.$action, //商品图片上传的地址
            headers: { //商品图片上传的请求头
                superAdminAuthorization: localStorage.getItem('superAdminAuthorization')
            },

            imgurl: '', //商品图片重置前的图片路径
            addSaleRules: { //修改信息的校验证规则对象
                saleid: [
                    { validator: checkSaleid, trigger: 'change' }
                ],
                s_id: [{
                        required: true,
                        message: '请选择员工号',
                        trigger: 'change'
                    },
                    { validator: checkS_id, trigger: 'change' }
                ],
                g_id: [{
                        required: true,
                        message: '请选择商品编号',
                        trigger: 'change'
                    },
                    { validator: checkG_id, trigger: 'change' }
                ],
                v_id: [
                    { validator: checkV_id, trigger: 'change' }
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
                s_price: [{
                        required: true,
                        message: '请选择销售价格',
                        trigger: 'change'
                    },
                    { validator: checkPrice, trigger: 'change' }
                ],
                s_num: [{
                        required: true,
                        message: '请输入销售数量',
                        trigger: 'change'
                    }, {
                        min: 1,
                        max: 30,
                        message: '销售数量的长度在 1 到 30 个字符',
                        trigger: 'change'
                    },
                    { validator: checkNum, trigger: 'change' }
                ],
                s_role: [{
                        required: true,
                        message: '请选择消费角色',
                        trigger: 'change'
                    },
                    { validator: checkRole, trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        goBack() { //返回销售信息列表
            this.$router.push('/superadminhome/salelist')
        },
        // 获取随机的销售单号
        fetchSaleid() {
            let id1 = this.$moment().format('YYYYMMDD')
            let id2 = Math.random().toString().slice(2, 6)
            let saleid = id1 + id2
            this.addSaleForm.saleid = parseInt(saleid)
                // console.log(this.addSaleForm.saleid)
        },
        //获取当前日期
        fetchDate() {
            this.addSaleForm.s_datetime = this.$moment().format('YYYY-MM-DD')
                // console.log(this.addSaleForm.s_datetime)
        },
        //获取商品编号对应的商品名称和商品规格的请求
        async fetchG_idData(value) {
            let g_id = value
            try {
                let {
                    data
                } = await this.$http.get('/onshelveslist/query', {
                        params: {
                            g_id
                        }
                    })
                    // console.log(data.data) //输出商品编号对应的信息
                let { g_name, g_unit, c_name } = data.data
                return new Promise((resolve, reject) => {
                    if (data.status === 1) {
                        this.addSaleForm.g_name = g_name
                        this.addSaleForm.g_unit = g_unit
                        this.addSaleForm.c_name = c_name
                        resolve(true)
                    } else {
                        this.addSaleForm.g_name = ''
                        this.addSaleForm.g_unit = ''
                        this.addSaleForm.c_name = ''
                        reject('该商品编号不存在！请重新选择')
                    }
                })

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取上架商品中全部的商品编号
        async fetchG_id() {
            try {
                let {
                    data
                } = await this.$http.get('/onshelveslist')
                    // console.log(data.data) //输出上架商品中全部的商品编号
                this.g_iddata = data.data
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //获取商品编号对应的会员价格的请求
        async fetchV_price() {
            let g_id = this.addSaleForm.g_id
            try {
                let {
                    data
                } = await this.$http.get('/onshelveslist/queryv_price', {
                        params: {
                            g_id
                        }
                    })
                    // console.log(data.data) //输出商品编号对应的员价格
                if (data.status === 1) {
                    this.s_priceData = data.data
                }

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取商品编号对应的会员价格的请求
        async fetchV_price1(value) {
            let g_id = value
            try {
                let {
                    data
                } = await this.$http.get('/onshelveslist/queryv_price', {
                        params: {
                            g_id
                        }
                    })
                    // console.log(data.data) //输出商品编号对应的会员价格

                return new Promise(resolve => {
                    if (data.status === 1) {
                        this.s_priceData = data.data
                        resolve(true)
                    }
                })

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取商品编号对应的非会员价格的请求
        async fetchPrice() {
            let g_id = this.addSaleForm.g_id
            try {
                let {
                    data
                } = await this.$http.get('/onshelveslist/queryprice', {
                        params: {
                            g_id
                        }
                    })
                    // console.log(data.data) //输出商品编号对应的非会员价格

                if (data.status === 1) {
                    this.s_priceData = data.data
                }

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取商品编号对应的非会员价格的请求
        async fetchPrice1(value) {
            let g_id = value
            try {
                let {
                    data
                } = await this.$http.get('/onshelveslist/queryprice', {
                        params: {
                            g_id
                        }
                    })
                    // console.log(data.data) //输出商品编号对应的非会员价格

                return new Promise(resolve => {
                    if (data.status === 1) {
                        this.s_priceData = data.data
                        resolve(true)
                    }
                })

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算会员价格总数的请求(用来检测修改后的会员价格是否存在)
        async fetchV_priceTotal(value) {
            let vipprice = value
            let { g_id } = this.addSaleForm
            try {
                let {
                    data
                } = await this.$http.get('/onshelveslist/total', {
                    params: {
                        g_id,
                        vipprice
                    }
                })

                // console.log( data.data) //输出会员价格总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //  会员价格总数等于0说明该会员价格不存在
                        if (data.data === 0) {
                            reject('该销售价格不存在！请重新选择')
                        } else {
                            resolve(true)
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算非会员价格总数的请求(用来检测修改后的非会员价格是否存在)
        async fetchPriceTotal(value) {
            let price = value
            let { g_id } = this.addSaleForm
            try {
                let {
                    data
                } = await this.$http.get('/onshelveslist/total', {
                        params: {
                            g_id,
                            price
                        }
                    })
                    // console.log(data.data) //输出非会员价格总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //非会员价格总数等于0说明该非会员价格不存在
                        if (data.data === 0 && g_id !== '') {
                            reject('该销售价格不存在！请重新选择')
                        } else {
                            resolve(true)
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算员工号总数的请求(用来检测修改后的员工号是否存在)
        async fetchS_idTotal(value) {
            let s_id = value
            try {
                let {
                    data
                } = await this.$http.get('/myselfupdate/s_idTotal', {
                        params: {
                            s_id
                        }
                    })
                    // console.log(data.data) //输出员工号总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //员工号总数等于0说明该员工号不存在
                        if (data.data === 0) {
                            reject('该员工号不存在！请重新选择')
                        } else {
                            resolve(true)
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取全部的员工号
        async fetchS_id() {
            try {
                let {
                    data
                } = await this.$http.get('/myselfquery')
                    // console.log(data.data) //输出全部的员工号
                this.s_iddata = data.data
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算会员号总数的请求(用来检测修改后的会员号是否存在)
        async fetchV_idTotal(value) {
            let v_id = value
            try {
                let {
                    data
                } = await this.$http.get('/viplist/v_idTotal', {
                        params: {
                            v_id
                        }
                    })
                    // console.log(data.data) //输出会员号总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //会员号总数等于0说明该会员号不存在
                        if (data.data === 0) {
                            reject('该会员号不存在！请重新选择')
                        } else {
                            resolve(true)
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取全部的会员号
        async fetchV_id() {
            try {
                let {
                    data
                } = await this.$http.get('/viplist')
                    // console.log(data.data) //输出全部的会编号
                this.v_iddata = data.data
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算销售单号总数的请求(用来检测修改后的销售单号是否已经存在)
        async fetchSaleidTotal(value) {
            let saleid = value
            try {
                let {
                    data
                } = await this.$http.get('/salelist/total', {
                        params: {
                            saleid
                        }
                    })
                    // console.log(data.data) //输出销售单号总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //销售单号总数等于0返回true(说明销售单号没重复)
                        if (data.data === 0) {
                            resolve(true)
                        } else {
                            reject('该销售单号已存在！请更换销售单号')
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取根据商品编号查询上架数量、销售数量、销售数量的请求(判断销售数量是否大于上架商品剩余数量)
        async fetchNum(value) {
            let { g_id } = this.addSaleForm
            value = parseInt(value) //字符串转换为整数(修改后的销售数量)
            let r_num //上架商品剩余数量

            // console.log(typeof(g_id))
            if (typeof(g_id) !== "string") {
                try {
                    let {
                        data
                    } = await this.$http.get(`/onshelveslist/allnum/${g_id}`)
                        // console.log(data.data) //输出上架数量、销售数量、销售数量

                    return new Promise((resolve, reject) => {
                        if (data.status === 1 && data.data.length > 0) {

                            if (data.data[2] !== undefined) {
                                let on_num = data.data[0].on_num //上架数量
                                let down_num = data.data[1].down_num //销售数量
                                let s_num = data.data[2].s_num //销售数量
                                r_num = on_num - (s_num + value + down_num) //上架商品剩余数量

                            } else if (data.data[1] !== undefined) {
                                let on_num = data.data[0].on_num //上架数量
                                let down_num = data.data[1].down_num //下架数量
                                r_num = on_num - (value + down_num) //上架商品剩余数量

                                if (isNaN(r_num) === true) {
                                    let on_num = data.data[0].on_num //上架数量
                                    let s_num = data.data[1].s_num //销售数量
                                    r_num = on_num - (s_num + value) //上架商品剩余数量

                                }
                                // console.log(isNaN(r_num)) //判断r_num是不是不是数字

                            } else {
                                let on_num = data.data[0].on_num //上架数量
                                r_num = on_num - value //上架商品剩余数量
                            }

                            // console.log(r_num)
                            if (r_num >= 0) {
                                resolve(true)
                            } else {
                                reject('销售数量大于上架商品剩余数量！请重新输入')
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
            this.addSaleForm.g_name = ''
            this.addSaleForm.g_unit = ''
            this.addSaleForm.c_name = ''
            this.fetchG_id() //获取上架商品中全部的商品编号
            this.fetchS_id() //获取全部的员工号
        },
        //清空会员号
        clearV_id() {
            this.v_iddata = [] //使会员号下拉列表数据为空
            this.s_priceData = [] //使销售价格下拉列表数据为空
            this.addSaleForm.v_id = '' //清空会员号
        },
        async addSale() { //添加销售信息
            this.fetchDate() //获取当前日期
            this.fetchTotolPrice //获取计算销售单总金额的属性
            this.fetchG_id() //获取上架商品中全部的商品编号
            this.fetchS_id() //获取全部的员工号

            let {
                saleid,
                s_id,
                g_id,
                g_name,
                g_imgurl,
                g_unit,
                c_name,
                s_price,
                s_num,
                s_totolprice,
                s_role,
                v_id,
                s_datetime,
                s_note
            } = this.addSaleForm

            this.$refs.addSaleRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取添加销售信息的请求
                    try {
                        let {
                            data
                        } = await this.$http.post('/addsale', {
                                saleid,
                                s_id,
                                g_id,
                                g_name,
                                g_imgurl,
                                g_unit,
                                c_name,
                                s_price,
                                s_num,
                                s_totolprice,
                                s_role,
                                v_id,
                                s_datetime,
                                s_note
                            })
                            // console.log(data)
                        if (data.status === 1) { //状态码为1时添加成功
                            this.$message.success('添加成功')
                            this.$refs.addSaleRef.resetFields() //对添加销售信息表单进行重置，将其值重置为初始值并移除校验结果
                            this.$refs.uploadRef.clearFiles() //清空已上传的图片
                            this.addSaleForm.s_note = '' //清空备注
                            this.fetchSaleid() //获取随机的销售单号
                            this.imgurl = '' //清空要删除的图片地址
                            this.v_iddata = [] //使会员号下拉列表数据为空
                            this.s_priceData = [] //使销售价格下拉列表数据为空
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
            this.addSaleForm.g_imgurl = res.data.url //上传成功后的商品图片路径
                // console.log(this.addSaleForm.g_imgurl)
            this.imgurl = res.data.url
            this.$message.success('上传成功')
        },
        handleError() { //文件上传失败时的钩子
            this.$message.error('上传图片失败')
        },
        handleRemove(file) { //图片移除文件时的钩子
            //console.log(file.response.data.url)
            this.fetchDeleteImg(file) //获取删除服务器里已上传的图片的请求
            this.addSaleForm.g_imgurl = '' //清除商品图片路径
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
            this.addSaleForm.g_imgurl = file.url;
            this.dialogVisibleAdd = true;
        },
        handleExceed() { //文件超出个数限制时的钩子
            this.$message.warning('抱歉！仅能上传一张图片');
        },
        resetAddSale() { //重置
            this.$refs.addSaleRef.resetFields() //对添加销售信息表单进行重置，将其值重置为初始值并移除校验结果 
            this.$refs.uploadRef.clearFiles() //清空已上传的图片
            this.fetchDeleteOldImg() //删除服务器里已上传的图片
            this.addSaleForm.s_note = '' //清空备注
            this.$message.success('重置成功')
            this.fetchSaleid() //获取随机的销售单号
            this.fetchG_id() //获取上架商品中全部的商品编号
            this.fetchS_id() //获取全部的员工号
            this.v_iddata = [] //使会员号下拉列表数据为空
            this.s_priceData = [] //使销售价格下拉列表数据为空
        },
        //更换销售单号
        updateSaleid() {
            this.fetchSaleid() //获取随机的销售单号
            this.$message.success('更换成功')
        },
        // 刷新时删除服务器里已上传的图片
        removeImg() {
            this.fetchDeleteOldImg() //删除服务器里已上传的图片
        }
    },
    created() {
        this.fetchSaleid() //获取随机的销售单号
        this.fetchG_id() //获取上架商品中全部的商品编号
        this.fetchS_id() //获取全部的员工号

        // 添加当浏览器刷新或关闭时触发的监听事件
        window.addEventListener('beforeunload', this.removeImg)
    },
    computed: {
        //计算修改后的销售单总金额(销售价格*销售数量)
        fetchTotolPrice() {
            let { s_num, s_price } = this.addSaleForm
            return this.addSaleForm.s_totolprice = parseInt(s_num) * s_price
        }
    },
    watch: { //监听路由变化
        $route(to) {
            // console.log(to.meta.title)
            if (to.meta.title === '添加销售信息') {
                this.fetchG_id() //获取上架商品中全部的商品编号
                this.fetchS_id() //获取全部的员工号
            }
        }
    }
}