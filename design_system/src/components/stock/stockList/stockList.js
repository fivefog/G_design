export default {
    data() {
        return {
            stockList: [], //库存信息列表数据
            query: { //库存信息列表的参数对象
                filters: '', //筛选条件
                search: '', //搜索内容
                confirmSearch: '', //已查询到数据的搜索内容
                pagenum: 1, //当前页码
                pagesize: 10, //每页显示的数据条数  
                total: 0 //总条数
            },
            disabled: true, //控制是否禁用批量修改按钮
            isTrue: false, //是否查询到内容并有改变页码或条数
            multSelectedG_id: [], //多选数据的g_id(数组)
            g_ids: '', //多选数据的g_id(括号)
            newStockwaring: 0, //批量库存预警值的计时器
            searchPage: false, //用于区分获取全部数据的分页和总条数还是获取条件查询的分页和总条数

            filters: [ //条件查询下拉框数据
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
            ]
        }
    },
    methods: {
        async handleS_waringChange(g_id, stockwaring) { //库存预警值改变时
            // console.log(g_id)
            // console.log(stockwaring)
            try { //调用修改信息请求
                let { data } = await this.$http.patch(`/stocklist/${g_id}`, {
                        stockwaring
                    })
                    // console.log(data)
                if (data.status === 1) {
                    this.$message.success('修改成功')
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
        },
        //当选择项发生变化时会触发该事件
        handleSelectionChange(val) {
            this.multSelectedG_id = val.map(item => {
                return item.g_id
            })

            if (this.multSelectedG_id.length === 0) {
                this.disabled = true //禁用批量修改按钮
            } else {
                this.disabled = false //不禁用批量修改按钮
            }

            let g_ids = '('
            for (let key of this.multSelectedG_id) { //把多选的id放进括号里
                g_ids += `${key},`
            }
            g_ids = g_ids.replace(/,$/, ')')
            this.g_ids = g_ids
        },
        //批量修改库存预警值按钮
        multEditS_Waring() {
            if (this.multSelectedG_id.length === 0) {
                this.disabled = true //禁用批量修改按钮
                this.newStockwaring = 0 //库存预警值清零
            } else {
                this.$confirm('您确定批量修改库存预警值吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'

                }).then(async() => { //获取批量修改库存预警值请求
                    // console.log(this.newStockwaring)

                    let stockwaring = this.newStockwaring
                    try {
                        let { data } = await this.$http.patch(`/stocklist/mulG_id/${this.g_ids}`, {
                                stockwaring
                            })
                            // console.log(data)
                        if (data.status === 1) {
                            this.$message.success('修改成功')
                            this.newStockwaring = 0 //库存预警值清零
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
                }).catch(() => {
                    this.$message.info('已取消修改');
                })
            }
        },
        //获取根据条件搜索库存信息的请求
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

            let g_id, g_name, g_unit, c_name
            if (filters === 'g_id') {
                g_id = search
            } else if (filters === 'g_name') {
                g_name = search
            } else if (filters === 'g_unit') {
                g_unit = search
            } else if (filters === 'c_name') {
                c_name = search
            } else if (filters === '') {
                g_id = '',
                    g_name = '',
                    g_unit = '',
                    c_name = ''
            }

            try {
                let {
                    data
                } = await this.$http.get(`/stocklist/${pagenum}/${pagesize}`, {
                        params: {
                            g_id,
                            g_name,
                            g_unit,
                            c_name
                        }
                    })
                    // console.log(data)

                if (data.status === 1 && (g_id == '' || g_name == '' || g_unit == '' || c_name == '' || filters == '')) {
                    this.fetchAllPage() //获取分页和总条数的请求  
                    this.$message.warning('查询条件或查询内容不能为空')
                } else {
                    this.searchPage = true
                    if (data.status === 1) {
                        this.stockList = data.data[0] //分页
                        this.query.total = data.data[1] //总条数
                        this.query.confirmSearch = search //已查询到数据的搜索内容

                        if (this.isTrue === false) {
                            this.query.pagenum = 1 //跳到第一页
                            this.$message.success('查询成功')
                        }
                    } else {
                        this.$message.error('抱歉！无符合此条件的库存信息！请重新输入')
                        this.fetchAllPage() //获取分页和总条数的请求  
                    }
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        async fetchAllPage() { //获取分页和总条数的请求(改变页码、每页条数、修改、修改时使用)
            this.searchPage = false

            let {
                pagenum,
                pagesize
            } = this.query

            let g_name = ''
            try {
                let {
                    data
                } = await this.$http.get(`/stocklist/${pagenum}/${pagesize}`, {
                        params: {
                            g_name
                        }
                    })
                    // console.log(data)
                this.stockList = data.data[0] //分页
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
                } = await this.$http.get(`/stocklist/${pagenum}/${pagesize}`, {
                        params: {
                            g_name
                        }
                    })
                    // console.log(data)
                this.stockList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 
                this.query.pagenum = 1

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //搜索框清空后获取库存信息列表数据
        getStockList() {
            this.fetchToolPage() //获取分页和总条数的请求
        },
        //页码改变
        pagenumChange(newPagenum) {
            this.query.pagenum = newPagenum

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索库存信息的请求  
            }
        },
        //每页显示的数据条数改变
        pagesizeChange(newPagesize) {
            this.query.pagesize = newPagesize

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索库存信息的请求  
            }
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
    }
}