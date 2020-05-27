export default {
    data() {
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
            outStockList: [], //出货信息列表数据
            query: { //出货信息列表的参数对象
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
            editForm: { //修改出货信息的表单数据
                g_id: '', //商品编号
                g_name: '', //商品名称
                g_imgurl: '', //商品图片
                g_unit: '', //商品规格
                c_name: '', //商品类别
                o_price: '', //商品预售价
                o_num: '', //出货数量
                o_totolprice: '', //出货单总金额
                o_datetime: '', //出货日期
                o_note: '' //备注
            },
            g_iddata: [], //商品编号下拉列表的全部数据
            oldG_id: '', //修改前的商品编号
            oldO_num: '', //修改前的出货数量
            newtotolprice: '', //修改后的出货单总金额
            multSelectedId: [], //多选数据的id(数组)
            ids: '', //多选数据的id(括号)
            isselectall: false, //是否全选
            searchPage: false, //用于区分获取全部数据的分页和总条数还是获取条件查询的分页和总条数

            dialogFormVisibleEdit: false, //控制修改出货信息对话框的显示与隐藏
            goodsAction: this.$action, //商品图片上传的地址
            headers: { //商品图片上传的请求头
                superAdminAuthorization: localStorage.getItem('superAdminAuthorization')
            },
            imgurl: '', //商品图片更换前的旧图片路径
            filters: [ //条件查询下拉框数据
                {
                    value: 'o_id',
                    label: '出货单号'
                },
                {
                    value: 'g_id',
                    label: '商品编号'
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
                    value: 'o_price',
                    label: '商品预售价'
                },
                {
                    value: 'o_num',
                    label: '出货数量'
                },
                {
                    value: 'o_totolprice',
                    label: '出货单总金额'
                },
                {
                    value: 'o_datetime',
                    label: '出货日期'
                }
            ],
            editFormRules: { //修改出货信息的校验证规则对象
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
                ],
                o_datetime: [{
                    required: true,
                    message: '请选择出货日期',
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
                } = await this.$http.get('/enterstocklist/query', {
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
                        resolve(true)
                    } else {
                        this.editForm.g_name = ''
                        this.editForm.g_unit = ''
                        this.editForm.c_name = ''
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
        //获取根据商品编号查询进货数量,出货数量的请求(判断出货数量是否大于库存数量)
        async fetchNum(value) {
            let { g_id } = this.editForm
            value = parseInt(value) //字符串转换为整数(修改后的出货数量)
            let oldO_num = parseInt(this.oldO_num) //字符串转换为整数(修改前的出货数量)
            let stocknum //库存数量

            // console.log(typeof(g_id))
            if (typeof(g_id) !== "string") {
                try {
                    let {
                        data
                    } = await this.$http.get(`/stocklist/${g_id}`)
                        // console.log(data.data) //输出进货数量,出货数量

                    return new Promise((resolve, reject) => {
                        if (data.status === 1 && data.data.length > 0) {

                            if (data.data[1] !== undefined) {

                                if (g_id === this.oldG_id) {
                                    let e_num = data.data[0].e_num //进货数量
                                    let o_num = data.data[1].o_num //出货数量
                                    stocknum = e_num - (o_num - oldO_num + value) //库存数量
                                } else {
                                    let e_num = data.data[0].e_num //进货数量
                                    let o_num = data.data[1].o_num //出货数量
                                    stocknum = e_num - (value + o_num) //库存数量
                                }

                            } else {
                                let e_num = data.data[0].e_num //进货数量
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
        //清空商品名称、商品规格、商品类别
        clearGoodData() {
            this.editForm.g_name = ''
            this.editForm.g_unit = ''
            this.editForm.c_name = ''
            this.fetchG_id() //获取全部的商品编号
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
                this.$confirm('您确定批量删除出货信息吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'

                }).then(async() => { //获取批量删除出货信息和服务器已上传的图片的请求
                    try {
                        let { data } = await this.$http.delete(`/outstocklist/multId/${this.ids}`)
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
        //获取根据条件搜索出货信息的请求
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

            let o_id, g_id, g_name, g_unit, c_name, o_price, o_num, o_totolprice, o_datetime
            if (filters === 'o_id') {
                o_id = search
            } else if (filters === 'g_id') {
                g_id = search
            } else if (filters === 'g_name') {
                g_name = search
            } else if (filters === 'g_unit') {
                g_unit = search
            } else if (filters === 'c_name') {
                c_name = search
            } else if (filters === 'o_price') {
                o_price = search
            } else if (filters === 'o_num') {
                o_num = search
            } else if (filters === 'o_totolprice') {
                o_totolprice = search
            } else if (filters === 'o_datetime') {
                o_datetime = search
            } else if (filters === '') {
                o_id = '',
                    g_id = '',
                    g_name = '',
                    g_unit = '',
                    c_name = '',
                    o_price = '',
                    o_num = '',
                    o_totolprice = '',
                    o_datetime = ''
            }

            try {
                let {
                    data
                } = await this.$http.get(`/outstocklist/${pagenum}/${pagesize}`, {
                        params: {
                            o_id,
                            g_id,
                            g_name,
                            g_unit,
                            c_name,
                            o_price,
                            o_num,
                            o_totolprice,
                            o_datetime
                        }
                    })
                    // console.log(data)

                if (data.status === 1 && (o_id == '' || g_id == '' || g_name == '' || g_unit == '' || c_name == '' || o_price == '' || o_num == '' || o_totolprice == '' || o_datetime == '' || filters == '')) {
                    this.fetchAllPage() //获取分页和总条数的请求  
                    this.$message.warning('查询条件或查询内容不能为空')
                } else {
                    this.searchPage = true
                    if (data.status === 1) {
                        this.outStockList = data.data[0] //分页
                        this.query.total = data.data[1] //总条数
                        this.query.confirmSearch = search //已查询到数据的搜索内容

                        if (this.isTrue === false) {
                            this.query.pagenum = 1 //跳到第一页
                            this.$message.success('查询成功')
                        }
                    } else {
                        this.$message.error('抱歉！无符合此条件的出货信息！请重新输入')
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
                } = await this.$http.get(`/outstocklist/${pagenum}/${pagesize}`, {
                        params: {
                            g_name
                        }
                    })
                    // console.log(data)
                this.outStockList = data.data[0] //分页
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
                } = await this.$http.get(`/outstocklist/${pagenum}/${pagesize}`, {
                        params: {
                            g_name
                        }
                    })
                    // console.log(data)
                this.outStockList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 
                this.query.pagenum = 1

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //搜索框清空后获取出货信息列表数据
        getOutStockList() {
            this.fetchToolPage() //获取分页和总条数的请求
        },
        //页码改变
        pagenumChange(newPagenum) {
            this.query.pagenum = newPagenum

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索出货信息的请求  
            }
        },
        //每页显示的数据条数改变
        pagesizeChange(newPagesize) {
            this.query.pagesize = newPagesize

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索出货信息的请求  
            }
        },
        //根据id展示需要修改的出货信息
        async showEdit(id) {
            this.fetchG_id() //获取全部的商品编号
            try {
                let {
                    data
                } = await this.$http.get(`/outstocklist/${id}`)

                this.editForm = data.data[0] //获取成功
                    // console.log(this.editForm)
                this.oldG_id = data.data[0].g_id
                this.oldO_num = data.data[0].o_num

                //处理出货日期（o_datetime）的日期格式
                this.editForm.o_datetime = this.$moment(data.data[0].o_datetime).format('YYYY-MM-DD')
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //用户确认选定的日期时触发
        timeChange(o_datetime) {
            //处理时间选择器的日期格式并传值给出货日期（o_datetime）
            this.editForm.o_datetime = this.$moment(o_datetime).format('YYYY-MM-DD')
                // console.log(this.editForm.o_datetime)
        },
        //修改出货信息
        editOutStock() {
            this.fetchG_id() //获取全部的商品编号
            this.fetchTotolPrice //获取计算修改后的出货单总金额的属性
            let o_totolprice = this.newtotolprice //修改后的出货单总金额
                // console.log(o_totolprice)
            let { g_id, g_name, g_imgurl, g_unit, c_name, o_price, o_num, o_datetime, o_note } = this.editForm //解构修改出货信息表单数据

            this.$refs.editFormRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取修改出货信息的请求
                    try { //调用修改出货信息请求
                        let { data } = await this.$http.patch(`/outstocklist/${this.editForm.id}`, {
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
        //监听修改出货信息对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields() //对修改出货信息表单进行重置，将其值重置为初始值并移除校验结果
            this.cancelOutStock()
        },
        // 取消修改出货信息
        async cancelOutStock() {
            // console.log(this.editForm.id)
            let { g_imgurl } = this.editForm //解构修改出货信息表单数据

            try { //调用修改商品图片的请求
                let { data } = await this.$http.patch(`/outstocklist/${this.editForm.id}`, {
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
        //根据id删除出货信息和服务器已上传的图片的请求
        handleDelete(id) {
            this.calculate //计算除数与取余数的属性
            let { pagesize, pagenum, remainNum, divisor } = this.query
                // console.log(pagenum)
                // console.log(divisor)
                // console.log(remainNum)
            this.$confirm('您确定删除该出货信息吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'

            }).then(async() => {

                try { //获取根据id删除出货信息的请求
                    let { data } = await this.$http.delete(`/outstocklist/${id}`)
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
        //添加出货信息
        addOutStock() {
            this.$router.push('addoutstock')
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
        //计算修改后的出货单总金额(商品预售价*出货数量)
        fetchTotolPrice() {
            let { o_num, o_price } = this.editForm
            return this.newtotolprice = parseInt(o_num) * o_price
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