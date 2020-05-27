export default {
    data() {
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

            if (this.editForm.s_role === '会员') {
                //接收获取商品编号对应的会员价格的Promise函数
                await this.fetchV_price1(value)
            } else if (this.editForm.s_role === '非会员') {
                //接收获取商品编号对应的非会员价格的Promise函数
                await this.fetchPrice1(value)
            }
            callback()
        }

        //消费角色自定义规则对象
        let checkRole = async(rule, value, callback) => {
            if (value === '会员') {
                this.fetchV_id() //获取全部的会员编号
                this.fetchV_price() //获取全部的会员价格
            } else {
                this.v_iddata = [] //使会员编号下拉列表数据为空
                this.editForm.v_id = '' //清空会员编号
                this.fetchPrice() //获取全部的非会员价格
            }
            callback()
        };

        //会员编号自定义规则对象
        let checkV_id = async(rule, value, callback) => {
            if (this.editForm.s_role === '会员' && !value) {
                callback(new Error('请选择会员编号'));
            } else {
                //接收获取会员编号是否存在的Promise函数
                await this.fetchV_idTotal(value)
            }
        };

        //销售价格自定义规则对象
        let checkPrice = async(rule, value, callback) => {

            if (this.editForm.s_role === '会员') {
                //接收获取会员价格是否存在的Promise函数
                await this.fetchV_priceTotal(value)
            } else if (this.editForm.s_role === '非会员') {
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
            saleList: [], //销售信息数据
            query: { //销售信息列表的参数对象
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
            editForm: { //修改销售信息的表单数据
                s_id: '', //员工号
                g_id: '', //商品编号
                g_name: '', //商品名称
                g_imgurl: '', //商品图片
                g_unit: '', //商品规格
                c_name: '', //商品类别
                s_price: '', //销售价格
                s_num: '', //销售数量
                s_role: '', //消费角色
                v_id: '', //会员编号
                s_datetime: '', //销售日期
                s_note: '' //备注
            },
            oldG_id: '', //修改前的商品编号
            oldS_num: '', //修改前的销售数量
            multSelectedId: [], //多选数据的id(数组)
            ids: '', //多选数据的id(括号)
            searchPage: false, //用于区分获取全部数据的分页和总条数还是获取条件查询的分页和总条数
            newtotolprice: '', //修改后的销售单总金额

            s_iddata: [], //员工号下拉列表的全部数据
            g_iddata: [], //商品编号下拉列表的全部数据
            v_iddata: [], //会员编号下拉列表的全部数据
            s_priceData: [], //销售价格下拉列表的全部数据

            dialogFormVisibleEdit: false, //控制修改销售信息对话框的显示与隐藏
            goodsAction: this.$action, //商品图片上传的地址
            headers: { //商品图片上传的请求头
                superAdminAuthorization: localStorage.getItem('superAdminAuthorization')
            },
            imgurl: '', //商品图片更换前的旧图片路径
            filters: [ //条件查询下拉框数据
                {
                    value: 'saleid',
                    label: '销售单号'
                },
                {
                    value: 's_id',
                    label: '员工号'
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
                    value: 's_price',
                    label: '销售价格'
                },
                {
                    value: 's_num',
                    label: '销售数量'
                },
                {
                    value: 's_totolprice',
                    label: '销售单总金额'
                },
                {
                    value: 's_role',
                    label: '消费角色'
                },
                {
                    value: 'v_id',
                    label: '会员编号'
                },
                {
                    value: 's_datetime',
                    label: '销售日期'
                }
            ],
            s_role: [{ //消费角色下拉框数据
                    value: '会员'
                },
                {
                    value: '非会员'
                }
            ],
            editFormRules: { //修改销售信息的校验证规则对象
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
                        message: '请输入销售价格',
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
                ],
                s_datetime: [{
                    required: true,
                    message: '请选择销售日期',
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
                } = await this.$http.get('/onshelveslist/query', {
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
            let g_id = this.editForm.g_id
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
            let g_id = this.editForm.g_id
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
            let { g_id } = this.editForm
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
            let { g_id } = this.editForm
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
        //获取计算员工号总数的请求(用来检测修改后的员工号号是否存在)
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
        //获取计算会员编号总数的请求(用来检测修改后的员工号号是否存在)
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
                        //会员编号总数等于0说明该会员编号不存在
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
        //获取全部的会编号
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
        //获取根据商品编号查询上架数量、销售数量、销售数量的请求(判断销售数量是否大于上架商品剩余数量)
        async fetchNum(value) {
            let { g_id } = this.editForm
            value = parseInt(value) //字符串转换为整数(修改后的销售数量)
            let oldS_num = parseInt(this.oldS_num) //字符串转换为整数(修改前的销售数量)
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
                                if (g_id === this.oldG_id) {
                                    let on_num = data.data[0].on_num //上架数量
                                    let down_num = data.data[1].down_num //销售数量
                                    let s_num = data.data[2].s_num //销售数量
                                    r_num = on_num - (s_num - oldS_num + value + down_num) //上架商品剩余数量

                                } else {
                                    let on_num = data.data[0].on_num //上架数量
                                    let down_num = data.data[1].down_num //销售数量
                                    let s_num = data.data[2].s_num //销售数量
                                    r_num = on_num - (s_num + value + down_num) //上架商品剩余数量

                                }
                            } else if (data.data[1] !== undefined) {
                                let on_num = data.data[0].on_num //上架数量
                                let down_num = data.data[1].down_num //下架数量
                                r_num = on_num - (value + down_num) //上架商品剩余数量

                                if (isNaN(r_num) === true) {
                                    if (g_id === this.oldG_id) {
                                        let on_num = data.data[0].on_num //上架数量
                                        let s_num = data.data[1].s_num //销售数量
                                        r_num = on_num - (s_num - oldS_num + value) //上架商品剩余数量

                                    } else {
                                        let on_num = data.data[0].on_num //上架数量
                                        let s_num = data.data[1].s_num //销售数量
                                        r_num = on_num - (s_num + value) //上架商品剩余数量
                                    }
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
            this.fetchG_id() //获取上架商品中全部的商品编号
            this.fetchS_id() //获取全部的员工号
        },
        //清空会员编号
        clearV_id() {
            this.v_iddata = [] //使会员编号下拉列表数据为空
            this.s_priceData = [] //使销售价格下拉列表数据为空
            this.editForm.v_id = '' //清空会员编号
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
                this.$confirm('您确定批量删除销售信息吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'

                }).then(async() => { //获取批量删除销售信息和服务器已上传的图片的请求
                    try {
                        let { data } = await this.$http.delete(`/salelist/multId/${this.ids}`)
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
        //获取根据条件搜索销售信息的请求
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

            let saleid, s_id, g_id, g_name, g_unit, c_name, s_price, s_num, s_totolprice, s_role, v_id, s_datetime
            if (filters === 'saleid') {
                saleid = search
            } else if (filters === 's_id') {
                s_id = search
            } else if (filters === 'g_id') {
                g_id = search
            } else if (filters === 'g_name') {
                g_name = search
            } else if (filters === 'g_unit') {
                g_unit = search
            } else if (filters === 'c_name') {
                c_name = search
            } else if (filters === 's_price') {
                s_price = search
            } else if (filters === 's_num') {
                s_num = search
            } else if (filters === 's_totolprice') {
                s_totolprice = search
            } else if (filters === 's_role') {
                s_role = search
            } else if (filters === 'v_id') {
                v_id = search
            } else if (filters === 's_datetime') {
                s_datetime = search
            } else if (filters === '') {
                saleid = '',
                    s_id = '',
                    g_id = '',
                    g_name = '',
                    g_unit = '',
                    c_name = '',
                    s_price = '',
                    s_num = '',
                    s_totolprice = '',
                    s_role = '',
                    v_id = '',
                    s_datetime = ''
            }

            try {
                let {
                    data
                } = await this.$http.get(`/salelist/${pagenum}/${pagesize}`, {
                        params: {
                            saleid,
                            s_id,
                            g_id,
                            g_name,
                            g_unit,
                            c_name,
                            s_price,
                            s_num,
                            s_totolprice,
                            s_role,
                            v_id,
                            s_datetime,
                        }
                    })
                    // console.log(data)

                if (data.status === 1 && (saleid == '' || s_id == '' || g_id == '' || g_name == '' || g_unit == '' || c_name == '' || s_price == '' || s_num == '' || s_totolprice == '' || s_role == '' || v_id == '' || s_datetime == '' || filters == '')) {
                    this.fetchAllPage() //获取分页和总条数的请求  
                    this.$message.warning('查询条件或查询内容不能为空')
                } else {
                    this.searchPage = true
                    if (data.status === 1) {
                        this.saleList = data.data[0] //分页
                        this.query.total = data.data[1] //总条数
                        this.query.confirmSearch = search //已查询到数据的搜索内容

                        if (this.isTrue === false) {
                            this.query.pagenum = 1 //跳到第一页
                            this.$message.success('查询成功')
                        }
                    } else {
                        this.$message.error('抱歉！无符合此条件的销售信息！请重新输入')
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
                } = await this.$http.get(`/salelist/${pagenum}/${pagesize}`, {
                        params: {
                            g_name
                        }
                    })
                    // console.log(data)
                this.saleList = data.data[0] //分页
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
                } = await this.$http.get(`/salelist/${pagenum}/${pagesize}`, {
                        params: {
                            g_name
                        }
                    })
                    // console.log(data)
                this.saleList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 
                this.query.pagenum = 1

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //搜索框清空后获取销售信息列表数据
        getsaleList() {
            this.fetchToolPage() //获取分页和总条数的请求
        },
        //页码改变
        pagenumChange(newPagenum) {
            this.query.pagenum = newPagenum

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索销售信息的请求  
            }
        },
        //每页显示的数据条数改变
        pagesizeChange(newPagesize) {
            this.query.pagesize = newPagesize

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索销售信息的请求  
            }
        },
        //根据id展示需要修改的销售信息
        async showEdit(id) {
            this.fetchG_id() //获取上架商品中全部的商品编号
            this.fetchS_id() //获取全部的员工号

            try {
                let {
                    data
                } = await this.$http.get(`/salelist/${id}`)

                this.editForm = data.data[0] //获取成功
                if (data.data[0].s_role === '会员') {
                    this.fetchV_id() //获取全部的会员编号
                }

                this.oldG_id = data.data[0].g_id
                this.oldS_num = data.data[0].s_num

                //处理销售日期（s_datetime）的日期格式
                this.editForm.s_datetime = this.$moment(data.data[0].s_datetime).format('YYYY-MM-DD')
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //用户确认选定的日期时触发
        timeChange(s_datetime) {
            //处理时间选择器的日期格式并传值给销售日期（s_datetime）
            this.editForm.s_datetime = this.$moment(s_datetime).format('YYYY-MM-DD')
                // console.log(this.editForm.s_datetime)
        },
        //修改销售信息
        editsaleList() {
            this.fetchTotolPrice //获取计算修改后的销售单总金额的属性
            let s_totolprice = this.newtotolprice //修改后的销售单总金额
                // console.log(s_totolprice)
            this.fetchG_id() //获取上架商品中全部的商品编号
            this.fetchS_id() //获取全部的员工号
            if (this.editForm.s_role === '会员') {
                this.fetchV_id() //获取全部的会员编号
            }

            let {
                s_id,
                g_id,
                g_name,
                g_imgurl,
                g_unit,
                c_name,
                s_price,
                s_num,
                s_role,
                v_id,
                s_datetime,
                s_note
            } = this.editForm //解构修改销售信息表单数据
                // console.log(this.editForm)

            this.$refs.editFormRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取修改销售信息的请求
                    try { //调用修改销售信息请求
                        let { data } = await this.$http.patch(`/salelist/${this.editForm.id}`, {
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
        //监听修改销售信息对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields() //对修改销售信息表单进行重置，将其值重置为初始值并移除校验结果
            this.cancelsaleList()
        },
        // 取消修改销售信息
        async cancelsaleList() {
            // console.log(this.editForm.id)
            let { g_imgurl } = this.editForm //解构修改销售信息表单数据

            try { //调用修改商品图片的请求
                let { data } = await this.$http.patch(`/salelist/${this.editForm.id}`, {
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
        //根据id删除销售信息和服务器已上传的图片的请求
        handleDelete(id) {
            this.calculate //计算除数与取余数的属性
            let { pagesize, pagenum, remainNum, divisor } = this.query
                // console.log(pagenum)
                // console.log(divisor)
                // console.log(remainNum)
            this.$confirm('您确定删除该销售信息吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'

            }).then(async() => {

                try { //获取根据id删除销售信息的请求
                    let { data } = await this.$http.delete(`/salelist/${id}`)
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
        //添加销售信息
        addsaleList() {
            this.$router.push('addsale')
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
        //计算修改后的销售单总金额(销售价格*销售数量)
        fetchTotolPrice() {
            let { s_num, s_price } = this.editForm
            return this.newtotolprice = parseInt(s_num) * s_price
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