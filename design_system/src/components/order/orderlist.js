export default {
    data() {
        return {
            options: [{ //状态管理
                id: 11,
                value: 1,
                label: '待发货'
            }, {
                id: 22,
                value: 2,
                label: '待收货'
            }, {
                id: 33,
                value: 3,
                label: '待评价'
            }, {
                id: 44,
                value: 4,
                label: '已完成'
            }],
            value: '',
            // 发货的抽屉
            table: false,
            dialog: false,
            loading: false,
            currentOrder_id:'', //当前选择的订单编号
            delivery_form: {
                tacking_num: '',
                tacking_company: '',
                // date1: '',
                // date2: '',
                delivery: false,
                // type: [],
                // resource: '',
                // desc: ''
            },
            dialogTableVisible: false,
            dialogFormVisible: false,
            formLabelWidth: '80px',
            timer: null,
            // 抽屉end
            goodsList: [], //订单列表数据
            query: { //未上架商品列表的参数对象
                filters: '', //筛选条件
                search: '', //搜索内容
                confirmSearch: '', //已查询到数据的搜索内容
                pagenum: 1, //当前页码
                pagesize: 10, //每页显示的数据条数  
                total: 0 //总条数
            },
            isTrue: false, //是否查询到内容并有改变页码或条数
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
                {
                    value: 'o_price',
                    label: '商品预售价'
                }
            ],
            editFormRules: { //修改未上架商品的校验证规则对象

            }
        }
    },
    methods: {
        delivery(currentOrder_id){
            this.currentOrder_id = currentOrder_id;
            
        },
        // 发货 提交表单
        async delivery_sure(){
            let _this = this;
            try {
                let {
                    data
                } = await this.$http.post('/getOrder/setForm', {
                        params: {
                            order_id: _this.currentOrder_id,
                            tacking_num:_this.delivery_form.tacking_num,
                            tacking_company:_this.delivery_form.tacking_company,
                        }
                    })
                    this.fetchToolPage();
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        if (data.data === 0) {
                            reject(this.$message.error(data.msg))
                        } else {
                            resolve(this.$message.success(data.msg));
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        cancelForm() {
            this.loading = false;
            // this.dialog = false;
            // console.log('timer:',this.timer,this.$refs.btnClick);
            
            clearTimeout(this.timer);
            this.$refs.btnClick.showPopper = false;
        },
     
        //设置订单状态
        async status_change(e, arr) {
            console.log(e, arr, arguments);
            let status = (e=='待发货'?1:e=='待收货'?2:e=='待评价'?3:e=='已完成'?4:'');
            console.log('status:',status);
            
            let _this = this;
            try {
                let {
                    data
                } = await this.$http.post('/getOrder/setStatus', {
                        params: {
                            order_id: arr[0].order_id,
                            status
                        }
                    })
                    
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        if (data.data === 0) {
                            reject(this.$message.error(data.msg))
                        } else {
                            _this.fetchToolPage();
                            resolve(this.$message.success(data.msg));
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //获取根据条件搜索未上架商品的请求
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

            let g_id, g_name, g_unit, c_name, o_price
            if (filters === 'g_id') {
                g_id = search
            } else if (filters === 'g_name') {
                g_name = search
            } else if (filters === 'g_unit') {
                g_unit = search
            } else if (filters === 'c_name') {
                c_name = search
            } else if (filters === 'o_price') {
                o_price = search
            } else if (filters === '') {
                g_id = '',
                    g_name = '',
                    g_unit = '',
                    c_name = '',
                    o_price = ''
            }

            try {
                let {
                    data
                } = await this.$http.get(`/goodslist/${pagenum}/${pagesize}`, {
                    params: {
                        g_id,
                        g_name,
                        g_unit,
                        c_name,
                        o_price
                    }
                })
                // console.log(data)

                if (data.status === 1 && (g_id == '' || g_name == '' || g_unit == '' || c_name == '' || o_price == '' || filters == '')) {
                    this.fetchAllPage() //获取分页和总条数的请求 
                    this.$message.warning('查询条件或查询内容不能为空')
                } else {
                    this.searchPage = true
                    if (data.status === 1) {
                        this.goodsList = data.data[0] //分页
                        this.query.total = data.data[1] //总条数
                        this.query.confirmSearch = search //已查询到数据的搜索内容

                        if (this.isTrue === false) {
                            this.query.pagenum = 1 //跳到第一页
                            this.$message.success('查询成功')
                        }
                    } else {
                        this.$message.error('抱歉！无符合此条件的未上架商品！请重新输入')
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

            // let g_name = ''
            try {
                let {
                    data
                } = await this.$http.get(`/getOrder/${pagenum}/${pagesize}`, {
                    // params: {
                    //     g_name
                    // }
                })
                console.log(data)
                this.goodsList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        async fetchToolPage() { //获取分页和总条数的请求 (获取所有订单)
            this.searchPage = false
            this.isTrue = false

            // let {
            //     pagesize
            // } = this.query

            // let pagenum = 1

            // let g_name = ''
            try {
                let {
                    data
                    // } = await this.$http.get(`/order/getOrderList/${pagenum}/${pagesize}`, {
                } = await this.$http.post(`/getOrder`)   //2hang+
                console.log('所有订单:', data.data)
                // data.data.map(element=>{
                //     console.log('每个订单的地址号：',element[0].addr_id);
                //     // let {data} = await this.$http.post()   //获取收货地址
                // });    
                this.goodsList = data.data //分页
                // this.query.total = data.data[1] //总条数 
                // this.query.pagenum = 1

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //搜索框清空后获取未上架商品列表数据
        getGoodsList() {
            this.fetchToolPage() //获取分页和总条数的请求
        },
        //页码改变
        pagenumChange(newPagenum) {
            this.query.pagenum = newPagenum

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求 

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索未上架商品的请求  
            }
        },
        //每页显示的数据条数改变
        pagesizeChange(newPagesize) {
            this.query.pagesize = newPagesize

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求 

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索未上架商品的请求  
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