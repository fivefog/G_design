export default {
    data() {
        //货架类别自定义规则对象
        let checkShelvesname = async(rule, value, callback) => {

            //接收获取货架类别是否重复的Promise函数
            await this.fetchShelvesnameTotal(value)
            this.fetchShelvesname() //获取全部的货架类别(商品类别)
            callback()
        };

        return {
            shelvesList: [], //货架信息列表数据
            query: { //货架信息列表的参数对象
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
            editForm: { //修改货架类别的表单数据
                shelvesname: '' //货架类别
            },
            shelvesnameData: [], //货架类别下拉列表数据
            allShelvesid: [], //全部货架号
            multSelectedId: [], //多选数据的id(数组)
            ids: '', //多选数据的id(括号)
            isselectall: false, //是否全选
            searchPage: false, //用于区分获取全部数据的分页和总条数还是获取条件查询的分页和总条数

            dialogFormVisibleEdit: false, //控制修改货架类别对话框的显示与隐藏
            dialogFormVisibleAdd: false, //控制添加货架信息对话框的显示与隐藏
            filters: [ //条件查询下拉框数据
                {
                    value: 'shelvesid',
                    label: '货架号'
                }, {
                    value: 'shelvesname',
                    label: '货架类别'
                },
                {
                    value: 'createtime',
                    label: '创建时间'
                }
            ],
            editFormRules: { //修改货架类别的校验证规则对象
                shelvesname: [{
                        required: true,
                        message: '请选择货架类别',
                        trigger: 'change'
                    },
                    { validator: checkShelvesname, trigger: 'change' }
                ]
            },
            addShelvesForm: {
                shelvesid: '', //货架号
                shelvesname: '', //货架类别
                createtime: '' //创建时间
            },
            addShelvesRules: { //修改货架类别的校验证规则对象
                shelvesname: [{
                        required: true,
                        message: '请选择货架类别',
                        trigger: 'change'
                    },
                    { validator: checkShelvesname, trigger: 'change' }
                ]
            },
        }
    },
    methods: {
        //获取当前日期
        fetchDate() {
            this.addShelvesForm.createtime = this.$moment().format('YYYY-MM-DD')
                // console.log(this.addShelvesForm.createtime)
        },
        //获取递增的货架号
        async fetchShelvesid() {

            try {
                let {
                    data
                } = await this.$http.get('/shelveslist/maxId')
                    // console.log(data.data) //输出最大的货架号
                let { shelvesid } = data.data[0]
                if (shelvesid === null) {
                    shelvesid = 0
                }

                // 筛选出((该位置索引+1)-该位置索引)大于1的数值
                let id = this.allShelvesid.filter((item, index, arr) => {
                    arr[index] = item //返回为true
                    return arr[index + 1] - arr[index] > 1
                });

                // console.log(id)
                // console.log(this.allShelvesid)

                //如果id的长度为0
                if (id.length === 0) {
                    this.allShelvesid.forEach((item, index, arr) => {
                        arr[index] = item //返回为true
                            //如果第一个数不是1时
                        if (arr[0] !== 1) {
                            shelvesid = 1
                        } else if (index === arr.length - 1) {
                            shelvesid += 1
                        }
                    });

                } else {
                    this.allShelvesid.forEach((item, index, arr) => {
                        arr[index] = item //返回为true
                            //如果第一个数不是1时
                        if (arr[0] !== 1) {
                            shelvesid = 1
                        } else if (arr[index + 1] - arr[index] > 1) {
                            shelvesid = id[0] + 1
                        }
                    });
                }
                // console.log(shelvesid)
                this.addShelvesForm.shelvesid = shelvesid
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取全部的货架号
        async fetchAllShelvesid() {
            try {
                let {
                    data
                } = await this.$http.get('/shelveslist')
                    // console.log(data.data) //输出全部的货架号

                this.allShelvesid = data.data
                this.fetchShelvesid() //获取递增的货架号
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算货架类别总数的请求(用来检测修改后的货架类别是否在商品类别信息列表中存在)
        async fetchShelvesnameTotal(value) {
            let c_name = value
            try {
                let {
                    data
                } = await this.$http.get('/categorylist/total', {
                        params: {
                            c_name
                        }
                    })
                    // console.log(data.data) //输出货架类别总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //货架类别总数等于0说明该货架类别不存在
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
        //获取全部的货架类别(商品类别)
        async fetchShelvesname() {
            try {
                let {
                    data
                } = await this.$http.get('/categorylist')
                    // console.log(data.data) //输出全部的货架类别(商品类别)
                this.shelvesnameData = data.data
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
        //手动勾选数据行的 Checkbox 时触发的事件
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
                this.$confirm('您确定批量删除货架信息吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'

                }).then(async() => { //获取批量删除货架信息
                    try {
                        let { data } = await this.$http.delete(`/shelveslist/multId/${this.ids}`)
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
        //获取根据条件搜索货架信息的请求
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

            let shelvesid, shelvesname, createtime
            if (filters === 'shelvesid') {
                shelvesid = search
            } else if (filters === 'shelvesname') {
                shelvesname = search
            } else if (filters === 'createtime') {
                createtime = search
            } else if (filters === '') {
                shelvesid = '',
                    shelvesname = '',
                    createtime = ''
            }

            try {
                let {
                    data
                } = await this.$http.get(`/shelveslist/${pagenum}/${pagesize}`, {
                        params: {
                            shelvesid,
                            shelvesname,
                            createtime
                        }
                    })
                    // console.log(data)

                if (data.status === 1 && (shelvesid == '' || shelvesname == '' || createtime == '' || filters == '')) {
                    this.fetchAllPage() //获取分页和总条数的请求  
                    this.$message.warning('查询条件或查询内容不能为空')
                } else {
                    this.searchPage = true
                    if (data.status === 1) {
                        this.shelvesList = data.data[0] //分页
                        this.query.total = data.data[1] //总条数
                        this.query.confirmSearch = search //已查询到数据的搜索内容

                        if (this.isTrue === false) {
                            this.query.pagenum = 1 //跳到第一页
                            this.$message.success('查询成功')
                        }
                    } else {
                        this.$message.error('抱歉！无符合此条件的货架信息！请重新输入')
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

            let shelvesid = ''
            try {
                let {
                    data
                } = await this.$http.get(`/shelveslist/${pagenum}/${pagesize}`, {
                        params: {
                            shelvesid
                        }
                    })
                    // console.log(data)
                this.shelvesList = data.data[0] //分页
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

            let shelvesid = ''
            try {
                let {
                    data
                } = await this.$http.get(`/shelveslist/${pagenum}/${pagesize}`, {
                        params: {
                            shelvesid
                        }
                    })
                    // console.log(data)
                this.shelvesList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 
                this.query.pagenum = 1

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //搜索框清空后获取货架信息列表数据
        getShelvesList() {
            this.fetchToolPage() //获取分页和总条数的请求
        },
        //页码改变
        pagenumChange(newPagenum) {
            this.query.pagenum = newPagenum

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索货架信息的请求  
            }
        },
        //每页显示的数据条数改变
        pagesizeChange(newPagesize) {
            this.query.pagesize = newPagesize

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索货架信息的请求  
            }
        },
        //根据id展示需要修改的货架信息
        async showEdit(id) {
            this.fetchShelvesname() //获取全部的货架类别(商品类别)

            try {
                let {
                    data
                } = await this.$http.get(`/shelveslist/${id}`)

                this.editForm = data.data[0] //获取成功
                    // console.log(this.editForm)

                this.oldShelvesid = data.data[0].shelvesname
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //修改货架类别
        editShelvesList() {
            this.fetchShelvesname() //获取全部的货架类别(商品类别)
            let { shelvesname } = this.editForm //解构修改货架类别表单数据

            this.$refs.editFormRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取修改货架类别的请求
                    try { //调用修改货架类别请求
                        let { data } = await this.$http.patch(`/shelveslist/${this.editForm.id}`, {
                                shelvesname
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
        //监听修改货架类别对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields() //对修改货架类别表单进行重置，将其值重置为初始值并移除校验结果 
        },
        //根据id删除货架信息
        handleDelete(id) {
            this.calculate //计算除数与取余数的属性
            let { pagesize, pagenum, remainNum, divisor } = this.query
                // console.log(pagenum)
                // console.log(divisor)
                // console.log(remainNum)
            this.$confirm('您确定删除该货架信息吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async() => {

                try { //获取根据id删除货架信息的请求
                    let { data } = await this.$http.delete(`/shelveslist/${id}`)
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
        //添加货架信息
        addShelves() {
            this.fetchShelvesname() //获取全部的货架类别(商品类别)
            let {
                shelvesid,
                shelvesname,
                createtime,
            } = this.addShelvesForm

            this.$refs.addShelvesRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取添加管理员信息的请求
                    try {
                        let {
                            data
                        } = await this.$http.post('/addshelves', {
                            shelvesid,
                            shelvesname,
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
                    this.$message.warning('输入有误！请重新输入！')
                    return false;
                }
            })
        },
        //监听添加货架信息对话框的打开事件
        addDialogOpen() {
            this.fetchAllShelvesid() //获取全部的货架号
            this.fetchShelvesname() //获取全部的货架类别(商品类别)
            this.fetchDate()
        },
        //监听添加货架信息对话框的关闭事件
        addDialogClosed() {
            this.$refs.addShelvesRef.resetFields() //对添加货架信息表单进行重置，将其值重置为初始值并移除校验结果
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