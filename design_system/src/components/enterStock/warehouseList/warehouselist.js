export default {
    data() {
        //仓库编号自定义规则对象
        let checkW_id = async(rule, value, callback) => {
            //接收检测仓库编号是否重复的Promise函数
            await this.fetchW_idTotal(value)
            callback()
        };

        //仓库名称自定义规则对象
        let checkW_name = async(rule, value, callback) => {

            const name = /^[\u4E00-\u9FA5]{1,30}$/
            if (!name.test(value)) {
                callback(new Error('仓库名称必须为汉字'));
            } else {
                //接收获取仓库名称是否重复的Promise函数
                await this.fetchW_nameTotal(value)
            }
        };

        //仓库位置自定义规则对象
        let checkW_position = async(rule, value, callback) => {

            const name = /^[\u4E00-\u9FA5\d]{1,30}$/
            if (!name.test(value)) {
                callback(new Error('仓库位置必须为汉字或数字'));
            } else {
                callback()
            }
        };

        return {
            w_houseList: [], //仓库信息列表数据
            query: { //仓库信息列表的参数对象
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
            editForm: { //修改仓库信息的表单数据
                w_name: '', //仓库名称
                w_position: '' //仓库位置
            },
            oldW_name: '', //修改前的仓库名称

            multSelectedId: [], //多选数据的id(数组)
            ids: '', //多选数据的id(括号)
            isselectall: false, //是否全选
            searchPage: false, //用于区分获取全部数据的分页和总条数还是获取条件查询的分页和总条数

            dialogFormVisibleEdit: false, //控制修改仓库信息对话框的显示与隐藏
            dialogFormVisibleAdd: false, //控制添加仓库信息对话框的显示与隐藏
            filters: [ //条件查询下拉框数据
                {
                    value: 'w_id',
                    label: '仓库编号'
                }, {
                    value: 'w_name',
                    label: '仓库名称'
                },
                {
                    value: 'w_position',
                    label: '仓库位置'
                },
                {
                    value: 'createtime',
                    label: '创建时间'
                }
            ],
            editFormRules: { //修改仓库信息的校验证规则对象
                w_name: [{
                        required: true,
                        message: '请输入仓库名称',
                        trigger: 'change'
                    }, {
                        min: 1,
                        max: 30,
                        message: '仓库名称的长度在 1 到 30 个字符',
                        trigger: 'change'
                    },
                    { validator: checkW_name, trigger: 'change' }
                ],
                w_position: [{
                        required: true,
                        message: '请输入仓库位置',
                        trigger: 'change'
                    }, {
                        min: 1,
                        max: 30,
                        message: '仓库位置的长度在 1 到 30 个字符',
                        trigger: 'change'
                    },
                    { validator: checkW_position, trigger: 'change' }
                ]
            },
            addW_houseForm: {
                w_id: '', //仓库编号
                w_name: '', //仓库名称
                w_position: '', //仓库位置
                createtime: '' //创建时间
            },
            addW_houseRules: { //修改仓库信息的校验证规则对象
                w_id: [
                    { validator: checkW_id, trigger: 'change' }
                ],
                w_name: [{
                        required: true,
                        message: '请输入仓库名称',
                        trigger: 'change'
                    }, {
                        min: 1,
                        max: 30,
                        message: '仓库名称的长度在 1 到 30 个字符',
                        trigger: 'change'
                    },
                    { validator: checkW_name, trigger: 'change' }
                ],
                w_position: [{
                        required: true,
                        message: '请输入仓库位置',
                        trigger: 'change'
                    }, {
                        min: 1,
                        max: 30,
                        message: '仓库位置的长度在 1 到 30 个字符',
                        trigger: 'change'
                    },
                    { validator: checkW_position, trigger: 'change' }
                ]
            },
        }
    },
    methods: {
        //获取随机的仓库编号
        fetchW_id() {
            let id1 = this.$moment().format('DD')
            let id2 = Math.random().toString().slice(2, 6)
            let w_id = id1 + id2
            this.addW_houseForm.w_id = parseInt(w_id)
                // console.log(this.addW_houseForm.w_id)
        },
        //获取当前日期
        fetchDate() {
            this.addW_houseForm.createtime = this.$moment().format('YYYY-MM-DD')
                // console.log(this.addW_houseForm.createtime)
        },
        //获取计算仓库编号总数的请求(用来检测修改后的仓库编号是否重复)
        async fetchW_idTotal(value) {
            let w_id = value
            try {
                let {
                    data
                } = await this.$http.get('/warehouselist/total', {
                        params: {
                            w_id
                        }
                    })
                    // console.log(data.data) //输出仓库编号总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //仓库编号总数等于0或者修改后的仓库编号等于修改前的仓库编号，返回true(说明仓库编号没重复)
                        if (data.data === 0) {
                            resolve(true)
                        } else {
                            this.fetchW_id() //获取随机的仓库编号
                            reject('该仓库编号已存在！请更换仓库编号')
                        }

                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算仓库名称总数的请求(用来检测修改后的仓库名称是否重复)
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
                        //仓库名称总数等于0或者修改后的仓库名称等于修改前的仓库名称，返回true(说明仓库名称没重复)
                        if (data.data === 0 || w_name === this.oldW_name) {
                            resolve(true)
                        } else {
                            reject('该仓库名称已存在！请重新输入')
                        }

                    })
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
                this.$confirm('您确定批量删除仓库信息吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'

                }).then(async() => { //获取批量删除仓库信息
                    try {
                        let { data } = await this.$http.delete(`/warehouselist/multId/${this.ids}`)
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
        //获取根据条件搜索仓库信息的请求
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

            let w_id, w_name,
                w_position, createtime
            if (filters === 'w_id') {
                w_id = search
            } else if (filters === 'w_name') {
                w_name = search
            } else if (filters === 'w_position') {
                w_position = search
            } else if (filters === 'createtime') {
                createtime = search
            } else if (filters === '') {
                w_id = '',
                    w_name = '',
                    w_position = '',
                    createtime = ''
            }

            try {
                let {
                    data
                } = await this.$http.get(`/warehouselist/${pagenum}/${pagesize}`, {
                        params: {
                            w_id,
                            w_name,
                            w_position,
                            createtime
                        }
                    })
                    // console.log(data)

                if (data.status === 1 && (w_id == '' || w_name == '' || w_position == '' || createtime == '' || filters == '')) {
                    this.fetchAllPage() //获取分页和总条数的请求  
                    this.$message.warning('查询条件或查询内容不能为空')
                } else {
                    this.searchPage = true
                    if (data.status === 1) {
                        this.w_houseList = data.data[0] //分页
                        this.query.total = data.data[1] //总条数
                        this.query.confirmSearch = search //已查询到数据的搜索内容

                        if (this.isTrue === false) {
                            this.query.pagenum = 1 //跳到第一页
                            this.$message.success('查询成功')
                        }
                    } else {
                        this.$message.error('抱歉！无符合此条件的仓库信息！请重新输入')
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

            let w_id = ''
            try {
                let {
                    data
                } = await this.$http.get(`/warehouselist/${pagenum}/${pagesize}`, {
                        params: {
                            w_id
                        }
                    })
                    // console.log(data)
                this.w_houseList = data.data[0] //分页
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

            let w_id = ''
            try {
                let {
                    data
                } = await this.$http.get(`/warehouselist/${pagenum}/${pagesize}`, {
                        params: {
                            w_id
                        }
                    })
                    // console.log(data)
                this.w_houseList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 
                this.query.pagenum = 1

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //搜索框清空后获取仓库信息列表数据
        getW_houseList() {
            this.fetchToolPage() //获取分页和总条数的请求
        },
        //页码改变
        pagenumChange(newPagenum) {
            this.query.pagenum = newPagenum

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索仓库信息的请求  
            }
        },
        //每页显示的数据条数改变
        pagesizeChange(newPagesize) {
            this.query.pagesize = newPagesize

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索仓库信息的请求  
            }
        },
        //根据id展示需要修改的仓库信息
        async showEdit(id) {

            try {
                let {
                    data
                } = await this.$http.get(`/warehouselist/${id}`)

                this.editForm = data.data[0] //获取成功
                    // console.log(this.editForm)

                this.oldW_name = data.data[0].w_name
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //修改仓库信息
        editW_houseList() {
            let { w_name, w_position } = this.editForm //解构修改仓库信息表单数据

            this.$refs.editFormRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取修改仓库信息的请求
                    try { //调用修改仓库信息请求
                        let { data } = await this.$http.patch(`/warehouselist/${this.editForm.id}`, {
                                w_name,
                                w_position
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
        //监听修改仓库信息对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.clearValidate() //移除校验结果
        },
        //根据id删除仓库信息
        handleDelete(id) {
            this.calculate //计算除数与取余数的属性
            let { pagesize, pagenum, remainNum, divisor } = this.query
                // console.log(pagenum)
                // console.log(divisor)
                // console.log(remainNum)
            this.$confirm('您确定删除该仓库信息吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async() => {

                try { //获取根据id删除仓库信息的请求
                    let { data } = await this.$http.delete(`/warehouselist/${id}`)
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
        //添加仓库信息
        addW_house() {

            let {
                w_id,
                w_name,
                w_position,
                createtime,
            } = this.addW_houseForm

            this.$refs.addW_houseRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取添加仓库信息的请求
                    try {
                        let {
                            data
                        } = await this.$http.post('/addwarehouse', {
                            w_id,
                            w_name,
                            w_position,
                            createtime
                        })

                        if (data.status === 1) { //状态码为1时添加成功
                            this.$message.success('添加成功')
                            this.dialogFormVisibleAdd = false //关闭对话框
                            if (this.searchPage === false) {
                                this.fetchAllPage() //获取分页和总条数的请求  
                            } else {
                                this.fetchToolPage() //获取分页和总条数的请求   
                            }

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
        //监听添加仓库信息对话框的打开事件
        addDialogOpen() {
            this.fetchW_id() //获取随机的仓库编号
            this.fetchDate()
        },
        //监听添加仓库信息对话框的关闭事件
        addDialogClosed() {
            this.$refs.addW_houseRef.resetFields() //对添加仓库信息表单进行重置，将其值重置为初始值并移除校验结果 
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