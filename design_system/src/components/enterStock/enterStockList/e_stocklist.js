export default {
    data() {
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
            enterStockList: [], //进货信息列表数据
            query: { //进货信息列表的参数对象
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
            editForm: { //修改进货信息的表单数据
                g_id: '', //商品编号
                s_id: '', //供应商编号
                g_name: '', //商品名称
                g_imgurl: '', //商品图片
                g_unit: '', //商品规格
                c_name: '', //商品类别
                e_price: '', //商品进价
                e_num: '', //进货数量
                e_totolprice: '', //进货单总金额
                w_name: '', //存放位置
                e_note: '' //备注
            },
            s_iddata: [], //供应商编号下拉列表的全部数据
            c_namedata: [], //商品类别下拉列表的全部数据
            w_namedata: [], //存放位置下拉列表的全部数据

            validate: false, //是否校验
            newtotolprice: '', //修改后的进货单总金额
            multSelectedId: [], //多选数据的id(数组)
            ids: '', //多选数据的id(括号)
            isselectall: false, //是否全选
            searchPage: false, //用于区分获取全部数据的分页和总条数还是获取条件查询的分页和总条数

            dialogFormVisibleEdit: false, //控制修改进货信息对话框的显示与隐藏
            goodsAction: this.$action, //商品图片上传的地址
            headers: { //商品图片上传的请求头
                superAdminAuthorization: localStorage.getItem('superAdminAuthorization')
            },
            imgurl: '', //商品图片更换前的旧图片路径
            filters: [ //条件查询下拉框数据
                {
                    value: 'e_id',
                    label: '进货单号'
                },
                {
                    value: 'g_id',
                    label: '商品编号'
                },
                {
                    value: 's_id',
                    label: '供应商编号'
                }, {
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
                    value: 'e_price',
                    label: '商品进价'
                },
                {
                    value: 'e_num',
                    label: '进货数量'
                },
                {
                    value: 'e_totolprice',
                    label: '进货单总金额'
                },
                {
                    value: 'w_name',
                    label: '存放位置'
                },
                {
                    value: 'e_datetime',
                    label: '进货日期'
                }
            ],
            editFormRules: { //修改进货信息的校验证规则对象
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
                ],
                e_datetime: [{
                    required: true,
                    message: '请选择进货日期',
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

                if (data.status === 1) {
                    return new Promise(resolve => {
                        this.editForm.g_name = g_name
                        this.editForm.g_unit = g_unit
                        this.editForm.c_name = c_name
                        resolve(true)
                    })
                } else {
                    // 如果未校验
                    if (this.validate === false) {
                        this.editForm.g_name = ''
                        this.editForm.g_unit = ''
                        this.editForm.c_name = ''
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
                this.$confirm('您确定批量删除进货信息吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'

                }).then(async() => { //获取批量删除进货信息和服务器已上传的图片的请求
                    try {
                        let { data } = await this.$http.delete(`/enterstocklist/multId/${this.ids}`)
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
        //获取根据条件搜索进货信息的请求
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

            let e_id, g_id, s_id, g_name, g_unit, c_name, e_price, e_num, e_totolprice, w_name, e_datetime
            if (filters === 'e_id') {
                e_id = search
            } else if (filters === 'g_id') {
                g_id = search
            } else if (filters === 's_id') {
                s_id = search
            } else if (filters === 'g_name') {
                g_name = search
            } else if (filters === 'g_unit') {
                g_unit = search
            } else if (filters === 'c_name') {
                c_name = search
            } else if (filters === 'e_price') {
                e_price = search
            } else if (filters === 'e_num') {
                e_num = search
            } else if (filters === 'e_totolprice') {
                e_totolprice = search
            } else if (filters === 'w_name') {
                w_name = search
            } else if (filters === 'e_datetime') {
                e_datetime = search
            } else if (filters === '') {
                e_id = '',
                    g_id = '',
                    s_id = '',
                    g_name = '',
                    g_unit = '',
                    c_name = '',
                    e_price = '',
                    e_num = '',
                    e_totolprice = '',
                    w_name = '',
                    e_datetime = ''
            }

            try {
                let {
                    data
                } = await this.$http.get(`/enterstocklist/${pagenum}/${pagesize}`, {
                        params: {
                            e_id,
                            g_id,
                            s_id,
                            g_name,
                            g_unit,
                            c_name,
                            e_price,
                            e_num,
                            e_totolprice,
                            w_name,
                            e_datetime
                        }
                    })
                    // console.log(data)

                if (data.status === 1 && (e_id == '' || g_id == '' || s_id == '' || g_name == '' || g_unit == '' || c_name == '' || e_price == '' || e_num == '' || e_totolprice == '' || w_name == '' || e_datetime == '' || filters == '')) {
                    this.fetchAllPage() //获取分页和总条数的请求  
                    this.$message.warning('查询条件或查询内容不能为空')
                } else {
                    this.searchPage = true
                    if (data.status === 1) {
                        this.enterStockList = data.data[0] //分页
                        this.query.total = data.data[1] //总条数
                        this.query.confirmSearch = search //已查询到数据的搜索内容

                        if (this.isTrue === false) {
                            this.query.pagenum = 1 //跳到第一页
                            this.$message.success('查询成功')
                        }
                    } else {
                        this.$message.error('抱歉！无符合此条件的进货信息！请重新输入')
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
                } = await this.$http.get(`/enterstocklist/${pagenum}/${pagesize}`, {
                        params: {
                            g_name
                        }
                    })
                    // console.log(data)
                this.enterStockList = data.data[0] //分页
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
                } = await this.$http.get(`/enterstocklist/${pagenum}/${pagesize}`, {
                        params: {
                            g_name
                        }
                    })
                    // console.log(data)
                this.enterStockList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 
                this.query.pagenum = 1

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //搜索框清空后获取进货信息列表数据
        getEnterStockList() {
            this.fetchToolPage() //获取分页和总条数的请求
        },
        //页码改变
        pagenumChange(newPagenum) {
            this.query.pagenum = newPagenum

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索进货信息的请求  
            }
        },
        //每页显示的数据条数改变
        pagesizeChange(newPagesize) {
            this.query.pagesize = newPagesize

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索进货信息的请求  
            }
        },
        //根据id展示需要修改的进货信息
        async showEdit(id) {
            this.validate = false
            this.fetchS_id() //获取全部供应商编号
            this.fetchC_name() //获取全部的商品类别
            this.fetchW_name() //获取全部的仓库名称
            try {
                let {
                    data
                } = await this.$http.get(`/enterstocklist/${id}`)

                this.editForm = data.data[0] //获取成功
                    // console.log(this.editForm)

                //处理进货日期（e_datetime）的日期格式
                this.editForm.e_datetime = this.$moment(data.data[0].e_datetime).format('YYYY-MM-DD')
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //用户确认选定的日期时触发
        timeChange(e_datetime) {
            //处理时间选择器的日期格式并传值给进货日期（e_datetime）
            this.editForm.e_datetime = this.$moment(e_datetime).format('YYYY-MM-DD')
                // console.log(this.editForm.e_datetime)
        },
        //修改进货信息
        editEnterStock() {
            this.validate = true //已校验
            this.fetchTotolPrice //获取计算修改后的进货单总金额的属性
            let e_totolprice = this.newtotolprice //修改后的进货单总金额
                // console.log(e_totolprice)
            this.fetchS_id() //获取全部供应商编号
            this.fetchC_name() //获取全部的商品类别
            this.fetchW_name() //获取全部的仓库名称
            let { g_id, s_id, g_name, g_imgurl, g_unit, c_name, e_price, e_num, w_name, e_datetime, e_note } = this.editForm //解构修改进货信息表单数据

            this.$refs.editFormRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取修改进货信息的请求
                    try { //调用修改进货信息请求
                        let { data } = await this.$http.patch(`/enterstocklist/${this.editForm.id}`, {
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
        //监听修改进货信息对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields() //对修改进货信息表单进行重置，将其值重置为初始值并移除校验结果
            this.cancelEnterStock()
        },
        // 取消修改进货信息
        async cancelEnterStock() {
            // console.log(this.editForm.id)
            let { g_imgurl } = this.editForm //解构修改进货信息表单数据

            try { //调用修改商品图片的请求
                let { data } = await this.$http.patch(`/enterstocklist/${this.editForm.id}`, {
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
        //根据id删除进货信息和服务器已上传的图片的请求
        handleDelete(id) {
            this.calculate //计算除数与取余数的属性
            let { pagesize, pagenum, remainNum, divisor } = this.query
                // console.log(pagenum)
                // console.log(divisor)
                // console.log(remainNum)
            this.$confirm('您确定删除该进货信息吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async() => {

                try { //获取根据id删除进货信息的请求
                    let { data } = await this.$http.delete(`/enterstocklist/${id}`)
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
        //添加进货信息
        addEnterStock() {
            this.$router.push('addenterstock')
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
    watch: {
        //监听路由变化
        validate(val) {
            if (val === true) {
                setTimeout(() => {
                    this.validate = false
                }, 1000);
            }
        },
        //监听query的变化
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
        //计算修改后的进货单总金额(商品进价*进货数量)
        fetchTotolPrice() {
            let { e_num, e_price } = this.editForm
            return this.newtotolprice = parseInt(e_num) * e_price
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