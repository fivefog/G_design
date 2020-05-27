export default {
    data() {
        //商品编号自定义规则对象
        let checkG_id = async(rule, value, callback) => {
            //接收获取商品编号对应的商品名称和商品规格的Promise函数
            await this.fetchG_idData(value)
            this.fetchG_id() //获取上架商品中全部的商品编号
            callback()
        };

        //下架数量自定义规则对象
        let checkNum = async(rule, value, callback) => {
            const num = /^[\u4E00-\u9FA5\d]{1,30}$/
            if (!num.test(value)) {
                callback(new Error('下架数量必须为数字或汉字'));
            } else if (!/^[1-9]/.test(value)) {
                callback(new Error('下架数量必须以数字开头且大于0'));
            } else {
                //接收判断下架数量是否大于上架商品剩余数量的Promise函数
                await this.fetchNum(value)
            }
        };

        return {
            downShelvesList: [], //下架商品数据
            query: { //下架商品列表的参数对象
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
            editForm: { //修改下架商品信息的表单数据
                g_id: '', //商品编号
                g_name: '', //商品名称
                g_imgurl: '', //商品图片
                g_unit: '', //商品规格
                c_name: '', //商品类别
                down_num: '', //下架数量
                down_datetime: '', //下架日期
                down_note: '' //备注
            },
            g_iddata: [], //商品编号下拉列表的全部数据
            oldG_id: '', //修改前的商品编号
            oldDown_num: '', //修改前的下架数量
            multSelectedId: [], //多选数据的id(数组)
            ids: '', //多选数据的id(括号)
            isselectall: false, //是否全选
            searchPage: false, //用于区分获取全部数据的分页和总条数还是获取条件查询的分页和总条数

            dialogFormVisibleEdit: false, //控制修改下架商品信息对话框的显示与隐藏
            goodsAction: this.$action, //商品图片上传的地址
            headers: { //商品图片上传的请求头
                superAdminAuthorization: localStorage.getItem('superAdminAuthorization')
            },
            imgurl: '', //商品图片更换前的旧图片路径
            filters: [ //条件查询下拉框数据
                {
                    value: 'down_id',
                    label: '下架编号'
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
                    value: 'down_num',
                    label: '下架数量'
                },
                {
                    value: 'down_datetime',
                    label: '下架日期'
                }
            ],
            editFormRules: { //修改下架商品信息的校验证规则对象
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
                down_num: [{
                        required: true,
                        message: '请输入下架数量',
                        trigger: 'change'
                    }, {
                        min: 1,
                        max: 30,
                        message: '下架数量的长度在 1 到 30 个字符',
                        trigger: 'change'
                    },
                    { validator: checkNum, trigger: 'change' }
                ],
                down_datetime: [{
                    required: true,
                    message: '请选择下架日期',
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
        //获取根据商品编号查询上架数量、下架数量、销售数量的请求(判断下架数量是否大于上架商品剩余数量)
        async fetchNum(value) {
            let { g_id } = this.editForm
            value = parseInt(value) //字符串转换为整数(修改后的下架数量)
            let oldDown_num = parseInt(this.oldDown_num) //字符串转换为整数(修改前的下架数量)
            let r_num //上架商品剩余数量

            // console.log(typeof(g_id))
            if (typeof(g_id) !== "string") {
                try {
                    let {
                        data
                    } = await this.$http.get(`/onshelveslist/allnum/${g_id}`)
                        // console.log(data.data) //输出上架数量、下架数量、销售数量

                    return new Promise((resolve, reject) => {
                        if (data.status === 1 && data.data.length > 0) {

                            if (data.data[2] !== undefined) {
                                if (g_id === this.oldG_id) {
                                    let on_num = data.data[0].on_num //上架数量
                                    let down_num = data.data[1].down_num //下架数量
                                    let s_num = data.data[2].s_num //销售数量
                                    r_num = on_num - (down_num - oldDown_num + value + s_num) //上架商品剩余数量

                                } else {
                                    let on_num = data.data[0].on_num //上架数量
                                    let down_num = data.data[1].down_num //下架数量
                                    let s_num = data.data[2].s_num //销售数量
                                    r_num = on_num - (down_num + value + s_num) //上架商品剩余数量

                                }
                            } else if (data.data[1] !== undefined) {
                                let on_num = data.data[0].on_num //上架数量
                                let s_num = data.data[1].s_num //销售数量
                                r_num = on_num - (value + s_num) //上架商品剩余数量

                                if (isNaN(r_num) === true) {
                                    if (g_id === this.oldG_id) {
                                        let on_num = data.data[0].on_num //上架数量
                                        let down_num = data.data[1].down_num //下架数量
                                        r_num = on_num - (down_num - oldDown_num + value) //上架商品剩余数量

                                    } else {
                                        let on_num = data.data[0].on_num //上架数量
                                        let down_num = data.data[1].down_num //下架数量
                                        r_num = on_num - (down_num + value) //上架商品剩余数量
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
                                reject('下架数量大于上架商品剩余数量！请重新输入')
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
        //清空商品名称和商品规格
        clearGoodData() {
            this.editForm.g_name = ''
            this.editForm.g_unit = ''
            this.editForm.c_name = ''
            this.fetchG_id() //获取上架商品中全部的商品编号
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
                this.$confirm('您确定批量删除下架商品吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'

                }).then(async() => { //获取批量删除下架商品和服务器已上传的图片的请求
                    try {
                        let { data } = await this.$http.delete(`/downshelveslist/multId/${this.ids}`)
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
        //获取根据条件搜索下架商品的请求
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

            let down_id, g_id, g_name, g_unit, c_name, down_num, down_datetime
            if (filters === 'down_id') {
                down_id = search
            } else if (filters === 'g_id') {
                g_id = search
            } else if (filters === 'g_name') {
                g_name = search
            } else if (filters === 'g_unit') {
                g_unit = search
            } else if (filters === 'c_name') {
                c_name = search
            } else if (filters === 'down_num') {
                down_num = search
            } else if (filters === 'down_datetime') {
                down_datetime = search
            } else if (filters === '') {
                down_id = '',
                    g_id = '',
                    g_name = '',
                    g_unit = '',
                    c_name = '',
                    down_num = '',
                    down_datetime = ''
            }

            try {
                let {
                    data
                } = await this.$http.get(`/downshelveslist/${pagenum}/${pagesize}`, {
                        params: {
                            down_id,
                            g_id,
                            g_name,
                            g_unit,
                            c_name,
                            down_num,
                            down_datetime
                        }
                    })
                    // console.log(data)

                if (data.status === 1 && (down_id == '' || g_id == '' || g_name == '' || g_unit == '' || c_name == '' || down_num == '' || down_datetime == '' || filters == '')) {
                    this.fetchAllPage() //获取分页和总条数的请求  
                    this.$message.warning('查询条件或查询内容不能为空')
                } else {
                    this.searchPage = true
                    if (data.status === 1) {
                        this.downShelvesList = data.data[0] //分页
                        this.query.total = data.data[1] //总条数
                        this.query.confirmSearch = search //已查询到数据的搜索内容

                        if (this.isTrue === false) {
                            this.query.pagenum = 1 //跳到第一页
                            this.$message.success('查询成功')
                        }
                    } else {
                        this.$message.error('抱歉！无符合此条件的下架商品！请重新输入')
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
                } = await this.$http.get(`/downshelveslist/${pagenum}/${pagesize}`, {
                        params: {
                            g_name
                        }
                    })
                    // console.log(data)
                this.downShelvesList = data.data[0] //分页
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
                } = await this.$http.get(`/downshelveslist/${pagenum}/${pagesize}`, {
                        params: {
                            g_name
                        }
                    })
                    // console.log(data)
                this.downShelvesList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 
                this.query.pagenum = 1

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //搜索框清空后获取下架商品列表数据
        getdownShelvesList() {
            this.fetchToolPage() //获取分页和总条数的请求
        },
        //页码改变
        pagenumChange(newPagenum) {
            this.query.pagenum = newPagenum

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求  

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索下架商品的请求  
            }
        },
        //每页显示的数据条数改变
        pagesizeChange(newPagesize) {
            this.query.pagesize = newPagesize

            if (this.searchPage === false) {
                this.fetchAllPage() //获取分页和总条数的请求   

            } else if (this.searchPage === true) {
                this.isTrue = true
                this.search() //获取根据条件搜索下架商品的请求  
            }
        },
        //根据id展示需要修改的下架商品信息
        async showEdit(id) {
            this.fetchG_id() //获取上架商品中全部的商品编号
            try {
                let {
                    data
                } = await this.$http.get(`/downshelveslist/${id}`)

                this.editForm = data.data[0] //获取成功
                    // console.log(this.editForm)
                this.oldG_id = data.data[0].g_id
                this.oldDown_num = data.data[0].down_num

                //处理下架日期（down_datetime）的日期格式
                this.editForm.down_datetime = this.$moment(data.data[0].down_datetime).format('YYYY-MM-DD')
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //用户确认选定的日期时触发
        timeChange(down_datetime) {
            //处理时间选择器的日期格式并传值给下架日期（down_datetime）
            this.editForm.down_datetime = this.$moment(down_datetime).format('YYYY-MM-DD')
                // console.log(this.editForm.down_datetime)
        },
        //修改下架商品信息
        editdownShelvesList() {
            this.fetchG_id() //获取上架商品中全部的商品编号
            let { g_id, g_name, g_imgurl, g_unit, c_name, down_num, down_datetime, down_note } = this.editForm //解构修改下架商品信息表单数据

            this.$refs.editFormRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取修改下架商品信息的请求
                    try { //调用修改下架商品信息请求
                        let { data } = await this.$http.patch(`/downshelveslist/${this.editForm.id}`, {
                                g_id,
                                g_name,
                                g_imgurl,
                                g_unit,
                                c_name,
                                down_num,
                                down_datetime,
                                down_note
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
        //监听修改下架商品信息对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields() //对修改下架商品信息表单进行重置，将其值重置为初始值并移除校验结果
            this.canceldownShelvesList()
        },
        // 取消修改下架商品信息
        async canceldownShelvesList() {
            // console.log(this.editForm.id)
            let { g_imgurl } = this.editForm //解构修改下架商品信息表单数据

            try { //调用修改商品图片的请求
                let { data } = await this.$http.patch(`/downshelveslist/${this.editForm.id}`, {
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
        //根据id删除下架商品和服务器已上传的图片的请求
        handleDelete(id) {
            this.calculate //计算除数与取余数的属性
            let { pagesize, pagenum, remainNum, divisor } = this.query
                // console.log(pagenum)
                // console.log(divisor)
                // console.log(remainNum)
            this.$confirm('您确定删除该下架商品吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'

            }).then(async() => {

                try { //获取根据id删除下架商品的请求
                    let { data } = await this.$http.delete(`/downshelveslist/${id}`)
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
        //添加下架商品
        adddownShelvesList() {
            this.$router.push('adddownshelves')
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