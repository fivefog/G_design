export default {
    data() {
        //商品编号自定义规则对象
        let checkG_id = async(rule, value, callback) => {
            //接收获取商品编号对应的商品名称和商品规格的Promise函数
            await this.fetchG_idData(value)
            this.fetchG_id() //获取出货信息中全部的商品编号
            callback()
        };

        //货架号自定义规则对象
        let checkShelvesid = async(rule, value, callback) => {
            //接收获取货架号是否重复的Promise函数
            await this.fetchShelvesidTotal(value)
            callback()
        };

        //非会员价格自定义规则对象
        let checkPrice = (rule, value, callback) => {
            const price = /^\d+(\.\d{1,2})?$/
            if (!price.test(value)) {
                callback(new Error('非会员价格必须为整数或最多带两位小数的数字'));
            } else {
                callback();
            }
        };

        //会员价格自定义规则对象
        let checkVipPrice = (rule, value, callback) => {
            const price = /^\d+(\.\d{1,2})?$/
            if (!price.test(value)) {
                callback(new Error('会员价格必须为整数或最多带两位小数的数字'));
            } else {
                callback();
            }
        };

        //上架数量自定义规则对象
        let checkNum = async(rule, value, callback) => {
            const num = /^[\u4E00-\u9FA5\d]{1,30}$/
            if (!num.test(value)) {
                callback(new Error('上架数量必须为数字或汉字'));
            } else if (!/^[1-9]/.test(value)) {
                callback(new Error('上架数量必须以数字开头且大于0'));
            } else {
                //接收判断上架数量是否大于未上架数量的Promise函数
                await this.fetchNum(value)
            }
        };

        return {
            onShelvesList: [], //上架商品列表数据
            query: { //上架商品列表的参数对象
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
            editForm: { //修改上架商品信息的表单数据
                g_id: '', //商品编号
                shelvesid: '', //货架号
                g_name: '', //商品名称
                g_imgurl: '', //商品图片
                g_unit: '', //商品规格
                c_name: '', //商品类别
                price: '', //非会员价格
                vipprice: '', //会员价格
                on_num: '', //上架数量
                on_datetime: '', //上架日期
                on_note: '' //备注
            },
            g_iddata: [], //商品编号下拉列表的全部数据
            shelvesidData: [], //货架号下拉列表数据
            oldG_id: '', //修改前的商品编号
            oldOn_num: '', //修改前的上架数量
            multSelectedId: [], //多选数据的id(数组)
            ids: '', //多选数据的id(括号)
            isselectall: false, //是否全选
            searchPage: false, //用于区分获取全部数据的分页和总条数还是获取条件查询的分页和总条数

            dialogFormVisibleEdit: false, //控制修改上架商品信息对话框的显示与隐藏
            goodsAction: this.$action, //商品图片上传的地址
            headers: { //商品图片上传的请求头
                superAdminAuthorization: localStorage.getItem('superAdminAuthorization')
            },
            imgurl: '', //商品图片更换前的旧图片路径
            filters: [ //条件查询下拉框数据
                {
                    value: 'on_id',
                    label: '上架编号'
                },
                {
                    value: 'g_id',
                    label: '商品编号'
                },
                {
                    value: 'shelvesid',
                    label: '货架号'
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
                    value: 'price',
                    label: '非会员价格'
                },
                {
                    value: 'vipprice',
                    label: '会员价格'
                },
                {
                    value: 'on_num',
                    label: '上架数量'
                },
                {
                    value: 'on_datetime',
                    label: '上架日期'
                }
            ],
            editFormRules: { //修改上架商品信息的校验证规则对象
                g_id: [{
                        required: true,
                        message: '请选择商品编号',
                        trigger: 'change'
                    },
                    { validator: checkG_id, trigger: 'change' }
                ],
                shelvesid: [{
                        required: true,
                        message: '请选择货架号',
                        trigger: 'change'
                    },
                    { validator: checkShelvesid, trigger: 'change' }
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
                price: [{
                        required: true,
                        message: '请输入非会员价格',
                        trigger: 'change'
                    },
                    { validator: checkPrice, trigger: 'change' }
                ],
                vipprice: [{
                        required: true,
                        message: '请输入会员价格',
                        trigger: 'change'
                    },
                    { validator: checkVipPrice, trigger: 'change' }
                ],
                on_num: [{
                        required: true,
                        message: '请输入上架数量',
                        trigger: 'change'
                    }, {
                        min: 1,
                        max: 30,
                        message: '上架数量的长度在 1 到 30 个字符',
                        trigger: 'change'
                    },
                    { validator: checkNum, trigger: 'change' }
                ],
                on_datetime: [{
                    required: true,
                    message: '请选择上架日期',
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
                } = await this.$http.get('/outstocklist/query', {
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
                        this.fetchShelvesid() //获取商品类别对应的全部货架号
                        resolve(true)
                    } else {
                        this.editForm.g_name = ''
                        this.editForm.g_unit = ''
                        this.editForm.c_name = ''
                        this.shelvesidData = []
                        reject('该商品编号不存在！请重新选择')
                    }
                })

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取出货信息中全部的商品编号
        async fetchG_id() {
            try {
                let {
                    data
                } = await this.$http.get('/outstocklist')
                    // console.log(data.data) //输出出货信息中全部的商品编号
                this.g_iddata = data.data
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取根据商品编号查询出货数量、上架数量的请求(判断上架数量数量是否大于未上架数量)
        async fetchNum(value) {
            let { g_id } = this.editForm
            value = parseInt(value) //字符串转换为整数(修改后的上架数量)
            let oldOn_num = parseInt(this.oldOn_num) //字符串转换为整数(修改前的上架数量)
            let un_num //未上架数量

            // console.log(typeof(g_id))
            if (typeof(g_id) !== "string") {
                try {
                    let {
                        data
                    } = await this.$http.get(`/onshelveslist/num/${g_id}`)
                        // console.log(data.data) //输出出货数量、上架数量

                    return new Promise((resolve, reject) => {
                        if (data.status === 1 && data.data.length > 0) {

                            if (data.data[1] !== undefined) {
                                if (g_id === this.oldG_id) {
                                    let o_num = data.data[0].o_num //出货数量
                                    let on_num = data.data[1].on_num //上架数量
                                    un_num = o_num - (on_num - oldOn_num + value) //未上架数量
                                } else {
                                    let o_num = data.data[0].o_num //出货数量
                                    let on_num = data.data[1].on_num //上架数量
                                    un_num = o_num - (on_num + value) //未上架数量
                                }

                            } else {
                                let o_num = data.data[0].o_num //出货数量
                                un_num = o_num - value //未上架数量
                            }

                            // console.log(un_num)
                            if (un_num >= 0) {
                                resolve(true)
                            } else {
                                reject('上架数量大于未上架数量！请重新输入')
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
        //获取计算货架号总数的请求(用来检测修改后的货架号是否在货架信息列表中存在)
        async fetchShelvesidTotal(value) {
            let shelvesid = value
            let shelvesname = this.editForm.c_name
            try {
                let {
                    data
                } = await this.$http.get(`/shelveslist/total/${shelvesid}`, {
                        params: {
                            shelvesid,
                            shelvesname
                        }
                    })
                    // console.log(data.data) //输出货架号总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //全部货架号总数等于0说明该货架号不存在
                        if (data.data[0] === 0) {
                            reject('该货架号不存在！请重新选择')
                        } //商品类别对应的全部货架号总数等于0说明该货架类别与商品类别不一致
                        else if (data.data[1] === 0) {
                            reject('该货架类别与商品类别不一致！请重新选择货架号')
                        } else {
                            resolve(true)
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取商品类别对应的全部货架号的请求
        async fetchShelvesid() {
            let shelvesname = this.editForm.c_name
            try {
                let {
                    data
                } = await this.$http.get('/shelveslist/query', {
                    params: {
                        shelvesname
                    }
                })

                // console.log(data.data) //输出商品类别对应的货架号
                this.shelvesidData = data.data
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
        //清空商品名称、商品规格、商品类别、货架号下拉列表数据
        clearGoodData() {
            this.editForm.g_name = ''
            this.editForm.g_unit = ''
            this.editForm.c_name = ''
            this.shelvesidData = []
            this.fetchG_id() //获取出货信息中全部的商品编号
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
                this.$confirm('您确定批量删除上架商品吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'

                }).then(async() => { //获取批量删除上架商品和服务器已上传的图片的请求
                    try {
                        let { data } = await this.$http.delete(`/onshelveslist/multId/${this.ids}`)
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
        //获取根据条件搜索上架商品的请求
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

            let on_id, g_id, shelvesid, g_name, g_unit, c_name, price, vipprice, on_num, on_datetime
            if (filters === 'on_id') {
                on_id = search
            } else if (filters === 'g_id') {
                g_id = search
            } else if (filters === 'shelvesid') {
                shelvesid = search
            } else if (filters === 'g_name') {
                g_name = search
            } else if (filters === 'g_unit') {
                g_unit = search
            } else if (filters === 'c_name') {
                c_name = search
            } else if (filters === 'price') {
                price = search
            } else if (filters === 'vipprice') {
                vipprice = search
            } else if (filters === 'on_num') {
                on_num = search
            } else if (filters === 'on_datetime') {
                on_datetime = search
            } else if (filters === '') {
                on_id = '',
                    g_id = '',
                    shelvesid = '',
                    g_name = '',
                    g_unit = '',
                    price = '',
                    vipprice = '',
                    on_num = '',
                    on_datetime = ''
            }

            try {
                let {
                    data
                } = await this.$http.get(`/onshelveslist/${pagenum}/${pagesize}`, {
                        params: {
                            on_id,
                            g_id,
                            shelvesid,
                            g_name,
                            g_unit,
                            c_name,
                            price,
                            vipprice,
                            on_num,
                            on_datetime
                        }
                    })
                    // console.log(data)

                if (data.status === 1 && (on_id == '' || g_id == '' || shelvesid == '' || g_name == '' || g_unit == '' || c_name == '' || price == '' || vipprice == '' || on_num == '' || on_datetime == '' || filters == '')) {
                    this.fetchAllPage() //获取分页和总条数的请求  
                    this.$message.warning('查询条件或查询内容不能为空')
                } else {
                    this.searchPage = true
                    if (data.status === 1) {
                        this.onShelvesList = data.data[0] //分页
                        this.query.total = data.data[1] //总条数
                        this.query.confirmSearch = search //已查询到数据的搜索内容

                        if (this.isTrue === false) {
                            this.query.pagenum = 1 //跳到第一页
                            this.$message.success('查询成功')
                        }
                    } else {
                        this.$message.error('抱歉！无符合此条件的上架商品！请重新输入')
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
                } = await this.$http.get(`/onshelveslist/${pagenum}/${pagesize}`, {
                        params: {
                            g_name
                        }
                    })
                this.onShelvesList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 
                    console.log('上架', this.onShelvesList)

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
                } = await this.$http.get(`/onshelveslist/${pagenum}/${pagesize}`, {
                        params: {
                            g_name
                        }
                    })
                    // console.log(data)
                this.onShelvesList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 
                this.query.pagenum = 1

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //搜索框清空后获取上架商品列表数据
        getonShelvesList() {
            this.fetchToolPage() //获取分页和总条数的请求
        },
        //页码改变
        pagenumChange(newPagenum) {
            this.query.pagenum = newPagenum

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索上架商品的请求  
            }
        },
        //每页显示的数据条数改变
        pagesizeChange(newPagesize) {
            this.query.pagesize = newPagesize

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索上架商品的请求  
            }
        },
        //根据id展示需要修改的上架商品信息
        async showEdit(id) {
            this.fetchG_id() //获取出货信息中全部的商品编号
            try {
                let {
                    data
                } = await this.$http.get(`/onshelveslist/${id}`)

                this.editForm = data.data[0] //获取成功
                    // console.log(this.editForm)
                this.oldG_id = data.data[0].g_id
                this.oldOn_num = data.data[0].on_num

                //处理上架日期（on_datetime）的日期格式
                this.editForm.on_datetime = this.$moment(data.data[0].on_datetime).format('YYYY-MM-DD')
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //用户确认选定的日期时触发
        timeChange(on_datetime) {
            //处理时间选择器的日期格式并传值给上架日期（on_datetime）
            this.editForm.on_datetime = this.$moment(on_datetime).format('YYYY-MM-DD')
                // console.log(this.editForm.on_datetime)
        },
        //修改上架商品信息
        editonShelvesList() {
            this.fetchG_id() //获取出货信息中全部的商品编号
                // this.fetchShelvesid() //获取商品类别对应的全部货架号
            let { g_id, shelvesid, g_name, g_imgurl, g_unit, c_name, price, vipprice, on_num, on_datetime, on_note } = this.editForm //解构修改上架商品信息表单数据

            this.$refs.editFormRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取修改上架商品信息的请求
                    try { //调用修改上架商品信息请求
                        let { data } = await this.$http.patch(`/onshelveslist/${this.editForm.id}`, {
                                g_id,
                                shelvesid,
                                g_name,
                                g_imgurl,
                                g_unit,
                                c_name,
                                price,
                                vipprice,
                                on_num,
                                on_datetime,
                                on_note
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
        //监听修改上架商品信息对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields() //对修改上架商品信息表单进行重置，将其值重置为初始值并移除校验结果
            this.cancelonShelvesList()
        },
        // 取消修改上架商品信息
        async cancelonShelvesList() {
            // console.log(this.editForm.id)
            let { g_imgurl } = this.editForm //解构修改上架商品信息表单数据

            try { //调用修改商品图片的请求
                let { data } = await this.$http.patch(`/onshelveslist/${this.editForm.id}`, {
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
        //根据id删除上架商品和服务器已上传的图片的请求
        handleDelete(id) {
            this.calculate //计算除数与取余数的属性
            let { pagesize, pagenum, remainNum, divisor } = this.query
                // console.log(pagenum)
                // console.log(divisor)
                // console.log(remainNum)
            this.$confirm('您确定删除该上架商品吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'

            }).then(async() => {

                try { //获取根据id删除上架商品的请求
                    let { data } = await this.$http.delete(`/onshelveslist/${id}`)
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
        //添加上架商品
        addonShelvesList() {
            this.$router.push('addonshelves')
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
        calculate() { //计算除数与取余数
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