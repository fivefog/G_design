export default {
    data() {
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
                //接收判断退货数量是否大于剩余数量的Promise函数
                await this.fetchNum(value)
            }
        };

        return {
            returnGoodsList: [], //退货信息列表数据
            query: { //退货信息列表的参数对象
                filters: '', //筛选条件
                search: '', //搜索内容
                confirmSearch: '', //已查询到数据的搜索内容
                pagenum: 1, //当前页码
                pagesize: 10, //每页显示的数据条数  
                total: 0, //总条数
                remainNum: 0, //余数
                divisor: 1, //除数
            },
            disabled: true, //控制是否禁用批量删除按钮
            isTrue: false, //是否查询到内容并有改变页码或条数
            editForm: { //修改退货信息的表单数据
                g_id: '', //商品编号
                s_id: '', //供应商编号
                g_name: '', //商品名称
                g_imgurl: '', //商品图片
                g_unit: '', //商品规格
                c_name: '', //商品类别
                e_price: '', //商品进价
                r_num: '', //退货数量
                r_totolprice: '', //退货单总金额
                r_datetime: '', //退货日期
                r_note: '' //备注
            },
            confirmG_id: '', //确认过的商品编号
            g_iddata: [], //商品编号下拉列表的全部数据
            s_iddata: [], //供应商编号下拉列表的全部数据
            e_pricedata: [], //商品进价下拉列表的全部数据
            oldG_id: '', //修改前的商品编号
            oldR_num: '', //修改前的退货数量
            newtotolprice: '', //修改后的退货单总金额
            multSelectedId: [], //多选数据的id(数组)
            ids: '', //多选数据的id(括号)
            isselectall: false, //是否全选
            searchPage: false, //用于区分获取全部数据的分页和总条数还是获取条件查询的分页和总条数

            dialogFormVisibleEdit: false, //控制修改退货信息对话框的显示与隐藏
            goodsAction: this.$action, //商品图片上传的地址
            headers: { //商品图片上传的请求头
                superAdminAuthorization: localStorage.getItem('superAdminAuthorization')
            },
            imgurl: '', //商品图片更换前的旧图片路径
            filters: [ //条件查询下拉框数据
                {
                    value: 'r_id',
                    label: '退货单号'
                },
                {
                    value: 'g_id',
                    label: '商品编号'
                },
                {
                    value: 's_id',
                    label: '供应商编号'
                },
                {
                    value: 'g_name',
                    label: '商品名称'
                },
                {
                    value: 'g_unit',
                    label: '商品规格'
                },
                {
                    value: 'c_name',
                    label: '商品类别'
                },
                {
                    value: 'r_price',
                    label: '商品进价'
                },
                {
                    value: 'r_num',
                    label: '退货数量'
                },
                {
                    value: 'r_totolprice',
                    label: '退货单总金额'
                },
                {
                    value: 'r_datetime',
                    label: '退货日期'
                }
            ],
            editFormRules: { //修改退货信息的校验证规则对象
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
                ],
                r_datetime: [{
                    required: true,
                    message: '请选择退货日期',
                    trigger: 'change'
                }]
            }
        }
    },
    methods: {
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
                        this.editForm.g_name = g_name
                        this.editForm.g_unit = g_unit
                        this.editForm.c_name = c_name
                        this.confirmG_id = g_id
                        resolve(true)
                    } else {
                        this.editForm.g_name = ''
                        this.editForm.g_unit = ''
                        this.editForm.c_name = ''
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
        //获取根据商品编号查询下架商品数量,退货数量的请求(判断退货数量是否大于剩余数量)
        async fetchNum(value) {
            let { g_id } = this.editForm
            value = parseInt(value) //字符串转换为整数(修改后的退货数量)
            let oldR_num = parseInt(this.oldR_num) //字符串转换为整数(修改前的退货数量)
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

                                if (g_id === this.oldG_id) {
                                    let down_num = data.data[0].down_num //下架商品数量
                                    let r_num = data.data[1].r_num //退货数量
                                    num = down_num - (r_num - oldR_num + value) //剩余数量
                                } else {
                                    let down_num = data.data[0].down_num //下架商品数量
                                    let r_num = data.data[1].r_num //退货数量
                                    num = down_num - (value + r_num) //剩余数量
                                }


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
            let { g_id } = this.editForm
            try {
                let {
                    data
                } = await this.$http.get('/enterstocklist/querye_price', {
                    params: {
                        g_id,
                        s_id
                    }
                })

                // console.log( data.data) //输出通过商品编号和供应商编号查对应的商品进价

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
            let { g_id, s_id } = this.editForm
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
            let { g_id, s_id } = this.editForm

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
        //获取删除更换前服务器里的旧图片的请求
        async fetchDeleteOldImg() {

            let imgurl = this.imgurl //商品图片更换前的旧图片路径
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
                    this.$message.success('更换成功')
                } else {
                    this.editForm.g_imgurl = ''
                    this.$message.error('更换失败')
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //清空商品名称、商品规格、商品类别、供应商编号下拉列表、商品进价下拉列表
        clearGoodData() {
            this.editForm.g_name = ''
            this.editForm.g_unit = ''
            this.editForm.c_name = ''
            this.s_iddata = []
            this.e_pricedata = []
            this.fetchG_id() //获取全部商品编号
        },
        //当选择项发生变化时会触发该事件
        handleSelectionChange(val) {
            this.multSelectedId = val.map(item => {
                return item.id
            })

            if (this.multSelectedId.length === 0) {
                this.disabled = true //禁用批量删除按钮
            } else {
                this.disabled = false //不禁用批量删除按钮
            }

            let ids = '('
            for (let key of this.multSelectedId) { //把多选的id放进括号里
                ids += `${key},`
            }
            ids = ids.replace(/,$/, ')')
            this.ids = ids
        },
        //手动勾选全选Checkbox时触发的事件
        handleSelectAll(selection) {
            this.calculate //计算除数与取余数的属性
            let { pagenum, divisor } = this.query
            if (selection.length > 0 && divisor === pagenum) { //已全选
                if (pagenum === 1) {
                    this.isselectall = 1
                } else {
                    this.isselectall = true
                }
            } else {
                this.isselectall = false
            }
            // console.log(this.isselectall)
        },
        // 手动勾选数据行的 Checkbox 时触发的事件
        selected(selection) {
            this.calculate //计算除数与取余数的属性
            let { pagesize, pagenum, remainNum, divisor } = this.query
                // console.log(selection.length)
                // console.log(pagesize)
                // console.log(pagenum)
                // console.log(divisor)
                // console.log(remainNum)
            if ((selection.length === pagesize || selection.length === remainNum) && divisor === pagenum) {
                if (pagenum === 1) {
                    this.isselectall = 1
                } else {
                    this.isselectall = true
                }
            } else {
                this.isselectall = false
            }
            // console.log(this.isselectall)
        },
        //批量删除按钮
        multDelete() {
            if (this.multSelectedId.length === 0) {
                this.disabled = true //禁用批量删除按钮
            } else {
                this.$confirm('您确定批量删除退货信息吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'

                }).then(async() => { //获取批量删除退货信息和服务器已上传的图片的请求
                    try {
                        let { data } = await this.$http.delete(`/returngoodslist/multId/${this.ids}`)
                            // console.log(data)
                        if (data.status === 1) {
                            //当已全选时
                            if (this.isselectall === true) {
                                this.query.pagenum -= 1
                                if (this.searchPage === false) {
                                    this.fetchAllPage() //获取分页和总条数的请求  
                                } else {
                                    this.search() //获取根据条件搜索的请求    
                                    this.isTrue = true
                                }

                            } else if (this.isselectall === 1) {
                                this.fetchToolPage() //获取分页和总条数的请求  

                            } else {
                                if (this.searchPage === false) {
                                    this.fetchAllPage() //获取分页和总条数的请求  
                                } else {
                                    this.search() //获取根据条件搜索的请求    
                                    this.isTrue = true
                                }

                            }
                            this.$message.success('删除成功')
                        } else {
                            this.$message.error('删除失败')
                        }
                    } catch (error) {
                        this.$message.error('服务器连接失败')
                    }
                }).catch(() => {
                    this.$message.info('已取消删除');
                })
            }
        },
        //获取根据条件搜索退货信息的请求
        async search() {
            let {
                filters,
                search,
                pagenum,
                pagesize
            } = this.query

            if (this.isTrue === false) {
                pagenum = 1
            }

            let g_id, g_name, g_unit, c_name, e_price, r_num, r_totolprice, r_datetime
            if (filters === 'g_id') {
                g_id = search
            } else if (filters === 'g_name') {
                g_name = search
            } else if (filters === 'g_unit') {
                g_unit = search
            } else if (filters === 'c_name') {
                c_name = search
            } else if (filters === 'r_price') {
                e_price = search
            } else if (filters === 'r_num') {
                r_num = search
            } else if (filters === 'r_totolprice') {
                r_totolprice = search
            } else if (filters === 'r_datetime') {
                r_datetime = search
            } else if (filters === '') {
                g_id = '',
                    g_name = '',
                    g_unit = '',
                    c_name = '',
                    e_price = '',
                    r_num = '',
                    r_totolprice = '',
                    r_datetime = ''
            }

            try {
                let {
                    data
                } = await this.$http.get(`/returngoodslist/${pagenum}/${pagesize}`, {
                        params: {
                            g_id,
                            g_name,
                            g_unit,
                            c_name,
                            e_price,
                            r_num,
                            r_totolprice,
                            r_datetime
                        }
                    })
                    // console.log(data)

                if (data.status === 1 && (g_id == '' || g_name == '' || g_unit == '' || c_name == '' || e_price == '' || r_num == '' || r_totolprice == '' || r_datetime == '' || filters == '')) {
                    this.fetchAllPage() //获取分页和总条数的请求 
                    this.$message.warning('查询条件或查询内容不能为空')
                } else {
                    this.searchPage = true
                    if (data.status === 1) {
                        this.returnGoodsList = data.data[0] //分页
                        this.query.total = data.data[1] //总条数
                        this.query.confirmSearch = search //已查询到数据的搜索内容

                        if (this.isTrue === false) {
                            this.query.pagenum = 1 //跳到第一页
                            this.$message.success('查询成功')
                        }
                    } else {
                        this.$message.error('抱歉！无符合此条件的退货信息！请重新输入')
                        this.fetchAllPage() //获取分页和总条数的请求 
                    }
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        async fetchAllPage() { //获取分页和总条数的请求(改变页码、每页条数、修改、删除时使用)
            this.searchPage = false

            let {
                pagenum,
                pagesize
            } = this.query

            let g_name = ''
            try {
                let {
                    data
                } = await this.$http.get(`/returngoodslist/${pagenum}/${pagesize}`, {
                        params: {
                            g_name
                        }
                    })
                    // console.log(data)
                this.returnGoodsList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        async fetchToolPage() { //获取分页和总条数的请求 
            this.searchPage = false
            this.isTrue = false

            let {
                pagesize
            } = this.query

            let pagenum = 1

            let g_name = ''
            try {
                let {
                    data
                } = await this.$http.get(`/returngoodslist/${pagenum}/${pagesize}`, {
                        params: {
                            g_name
                        }
                    })
                    // console.log(data)
                this.returnGoodsList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 
                this.query.pagenum = 1

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //搜索框清空后获取退货信息列表数据
        getReturnGoodsList() {
            this.fetchToolPage() //获取分页和总条数的请求
        },
        //页码改变
        pagenumChange(newPagenum) {
            this.query.pagenum = newPagenum

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求 

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索退货信息的请求  
            }
        },
        //每页显示的数据条数改变
        pagesizeChange(newPagesize) {
            this.query.pagesize = newPagesize

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求   

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索退货信息的请求  
            }
        },
        //根据id展示需要修改的退货信息
        async showEdit(id) {
            this.fetchG_id() //获取全部的商品编号

            try {
                let {
                    data
                } = await this.$http.get(`/returngoodslist/${id}`)

                this.editForm = data.data[0] //获取成功
                    // console.log(data.data[0])
                this.oldG_id = data.data[0].g_id
                this.oldR_num = data.data[0].r_num

                //处理退货日期（r_datetime）的日期格式
                this.editForm.r_datetime = this.$moment(data.data[0].r_datetime).format('YYYY-MM-DD')
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //用户确认选定的日期时触发
        timeChange(r_datetime) {
            //处理时间选择器的日期格式并传值给退货日期（r_datetime）
            this.editForm.r_datetime = this.$moment(r_datetime).format('YYYY-MM-DD')
                // console.log(this.editForm.r_datetime)
        },
        //修改退货信息
        editReturnGoods() {
            this.fetchTotolPrice //获取计算修改后的退货单总金额的属性
            let r_totolprice = this.newtotolprice //修改后的退货单总金额
                // console.log(r_totolprice)
            this.fetchG_id() //获取全部的商品编号
            let { g_id, s_id, g_name, g_imgurl, g_unit, c_name, e_price, r_num, r_datetime, r_note } = this.editForm //解构修改退货信息表单数据

            this.$refs.editFormRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取修改退货信息的请求
                    try { //调用修改退货信息请求
                        let { data } = await this.$http.patch(`/returngoodslist/${this.editForm.id}`, {
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
                        if (data.status === 1) {
                            this.$message.success('修改成功')
                            this.dialogFormVisibleEdit = false //关闭对话框
                            if (this.searchPage === false) {
                                this.fetchAllPage() //获取分页和总条数的请求  
                            } else {
                                this.search() //获取根据条件搜索的请求    
                                this.isTrue = true
                            }
                        } else {
                            this.$message.error('修改失败')
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
        //监听修改退货信息对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields() //对修改退货信息表单进行重置，将其值重置为初始值并移除校验结果
            this.cancelReturnGoods()
        },
        // 取消修改退货信息
        async cancelReturnGoods() {
            // console.log(this.editForm.id)
            let { g_imgurl } = this.editForm //解构修改退货信息表单数据

            try { //调用修改商品图片的请求
                let { data } = await this.$http.patch(`/returngoodslist/${this.editForm.id}`, {
                        g_imgurl
                    })
                    // console.log(data)
                if (data.status === 1) {
                    if (this.searchPage === false) {
                        this.fetchAllPage() //获取分页和总条数的请求  
                    } else {
                        this.search() //获取根据条件搜索的请求    
                        this.isTrue = true
                    }
                    this.dialogFormVisibleEdit = false //关闭对话框
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //根据id删除退货信息和服务器已上传的图片的请求
        handleDelete(id) {
            this.calculate //计算除数与取余数的属性
            let { pagesize, pagenum, remainNum, divisor } = this.query
                // console.log(pagenum)
                // console.log(divisor)
                // console.log(remainNum)
            this.$confirm('您确定删除该退货信息吗?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'

            }).then(async() => {

                try { //获取根据id删除退货信息的请求
                    let { data } = await this.$http.delete(`/returngoodslist/${id}`)
                        // console.log(data)
                    if (data.status === 1) {
                        // 余数为1或当前条数为1且除数等于当前页码且页码不为1时
                        if ((remainNum === 1 || pagesize === 1) && divisor === pagenum) {
                            this.query.pagenum -= 1
                            if (this.searchPage === false) {
                                this.fetchAllPage() //获取分页和总条数的请求  
                            } else {
                                if (pagenum === 1) {
                                    this.fetchToolPage() //获取分页和总条数的请求  
                                } else {
                                    this.search() //获取根据条件搜索的请求  
                                    this.isTrue = true
                                }
                            }

                        } else {
                            if (this.searchPage === false) {
                                this.fetchAllPage() //获取分页和总条数的请求  
                            } else {
                                this.search() //获取根据条件搜索的请求    
                                this.isTrue = true
                            }

                        }
                        this.$message.success('删除成功')
                    } else {
                        this.$message.error('删除失败')
                    }
                } catch (error) {
                    this.$message.error('服务器连接失败')
                }
            }).catch(() => {
                this.$message.info('已取消删除');
            })
        },
        //添加退货信息
        addReturnGoods() {
            this.$router.push('addr_goods')
        },

        async handleSuccess(res) { //文件上传成功时的钩子
            this.editForm.g_imgurl = res.data.url //更换成功后的商品图片路径
                // console.log(this.editForm.g_imgurl)
            this.fetchDeleteOldImg() //获取删除更换前服务器里的旧图片的请求
        },
        handleError() { //文件上传失败时的钩子
            this.$message.error('上传失败')
        },
        handleRemove(file) { //文件列表移除文件时的钩子
            file
        },
        beforeAvatarUpload(file) { //上传文件之前的钩子
            this.imgurl = this.editForm.g_imgurl //商品图片更换前的旧图片路径

            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
        }
    },
    created() {
        this.fetchToolPage() //获取分页和总条数的请求
    },
    //监听query的变化
    watch: {
        query: {
            handler(val) {
                // console.log(val)
                // console.log('s1', val.search)
                // console.log('s2', val.confirmSearch)
                if (val.search !== val.confirmSearch && val.confirmSearch !== '') {
                    this.query.confirmSearch = ''
                    this.fetchToolPage() //获取分页和总条数的请求
                }
            },
            deep: true //对象内部属性的监听(深度监听)
        }
    },
    computed: {
        //计算修改后的退货单总金额(商品进价*退货数量)
        fetchTotolPrice() {
            let { r_num, e_price } = this.editForm
            return this.newtotolprice = parseInt(r_num) * e_price
        },
        //计算除数与取余数
        calculate() {
            let { pagesize, total } = this.query
            this.query.remainNum = total % pagesize //取余数（总条数%当前条数）
            if (this.query.remainNum !== 0) {
                this.query.divisor = parseInt(total / pagesize) + 1 //整除（总条数/当前条数）
            } else {
                this.query.divisor = parseInt(total / pagesize) //整除（总条数/当前条数）
            }
        }
    }
}