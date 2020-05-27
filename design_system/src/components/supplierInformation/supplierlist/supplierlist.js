export default {
    data() {
        //公司名称自定义规则对象
        let checkName = async(rule, value, callback) => {
            //接收检测公司名称是否存在的Promise函数
            await this.fetchNameTotal(value)

            const s_name = /^[\u4E00-\u9FA5]{2,40}$/
            if (!s_name.test(value)) {
                callback(new Error('公司名称必须为汉字'));
            } else {
                callback();
            }
        };

        //负责人姓名自定义规则对象
        let checkContact = (rule, value, callback) => {
            const s_name = /^[\u4E00-\u9FA5]{2,6}$/
            if (!s_name.test(value)) {
                callback(new Error('负责人姓名必须为汉字'));
            } else {
                callback();
            }
        };

        //邮箱自定义规则对象
        let checkEmail = async(rule, value, callback) => {
            //接收检测邮箱地址是否存在的Promise函数
            await this.fetchEmailTotal(value)
            callback()
        };

        //联系电话自定义规则对象
        let checkPhone = async(rule, value, callback) => {
            //接收检测联系电话是否存在的Promise函数
            await this.fetchPhoneTotal(value)

            const s_phone = /^1[3-9]\d{9}$/
            if (!s_phone.test(value)) {
                callback(new Error('请输入正确的联系电话'));
            } else {
                callback();
            }
        };

        //详细地址自定义规则对象
        let checkAdress = async(rule, value, callback) => {
            const s_adress = /^[\u4E00-\u9FA5\d]{2,40}$/

            if (!s_adress.test(value)) {
                callback(new Error('公司地址必须为汉字或数字'));
            } else {
                callback();
            }
        };

        return {
            supplierList: [], //供应商信息数据
            query: { //供应商列表的参数对象
                filters: '', //筛选条件
                search: '', //搜索内容
                pagenum: 1, //当前页码
                pagesize: 10, //每页显示的数据条数  
                total: 0, //总条数
                remainNum: 0, //余数
                divisor: 1, //除数
            },
            disabled: true, //控制是否禁用批量删除按钮
            isTrue: false, //是否查询到内容并有改变页码或条数
            options: this.$regData, //省市区级联动数据
            selectedArea: [], //选中的公司地区
            editForm: { //修改供应商信息的表单数据
                s_id: '', //供应商编号
                s_name: '', //公司名称
                s_contact: '', //负责人姓名
                s_email: '', //邮箱
                s_phone: '', //联系电话
                s_area: '', //公司地区
                s_adress: '', //详细地址
                areaCode: '' //公司地区区域码
            },

            oldrS_name: '', //修改前的公司名称
            oldS_email: '', //修改前的邮箱地址
            oldS_phone: '', //修改前的联系电话
            multSelectedId: [], //多选数据的s_id(数组)
            ids: '', //多选数据的id(括号)
            isselectall: false, //是否全选
            searchPage: false, //用于区分获取全部数据的分页、总条数还是获取条件查询的分页、总条数

            filters: [{ //条件查询下拉框数据
                    value: 's_id',
                    label: '供应商编号'
                }, {
                    value: 's_name',
                    label: '公司名称'
                },
                {
                    value: 's_contact',
                    label: '负责人姓名'
                },
                {
                    value: 's_email',
                    label: '邮箱'
                },
                {
                    value: 's_phone',
                    label: '联系电话'
                },
                {
                    value: 's_area',
                    label: '公司地区'
                },
                {
                    value: 's_adress',
                    label: '详细地址'
                },
                {
                    value: 'createtime',
                    label: '创建时间'
                }
            ],
            editFormRules: { //修改供应商信息的校验证规则对象
                s_name: [{
                        required: true,
                        message: '请输入公司名称',
                        trigger: 'change'
                    },
                    {
                        min: 2,
                        max: 40,
                        message: '公司名称的长度在 2 到 40 个字符',
                        trigger: 'change'
                    },
                    { validator: checkName, trigger: 'change' }
                ],
                s_contact: [{
                        required: true,
                        message: '请输入负责人姓名',
                        trigger: 'change'
                    },
                    {
                        min: 2,
                        max: 6,
                        message: '负责人姓名的长度在 2 到 6 个字符',
                        trigger: 'change'
                    },
                    { validator: checkContact, trigger: 'change' }
                ],
                s_email: [{
                        required: true,
                        message: '请输入邮箱地址',
                        trigger: 'change'
                    },
                    {
                        type: 'email',
                        message: '请输入正确的邮箱地址',
                        trigger: ['blur', 'change']
                    },
                    { validator: checkEmail, trigger: 'change' }
                ],
                s_phone: [{
                        required: true,
                        message: '请输入联系电话'
                    },
                    {
                        type: 'number',
                        message: '联系电话必须为数字'
                    },
                    { validator: checkPhone, trigger: 'change' }
                ],
                s_area: [{
                    required: true,
                    message: '请选择公司地区',
                    trigger: 'change'
                }],
                s_adress: [{
                        required: true,
                        message: '请输入详细地址',
                        trigger: 'change'
                    },
                    {
                        min: 2,
                        max: 40,
                        message: '详细地址的长度在 2 到 40 个字符',
                        trigger: 'change'
                    },
                    { validator: checkAdress, trigger: 'change' }
                ]
            },
            dialogFormVisibleEdit: false, //控制修改供应商信息对话框的显示与隐藏
        }
    },
    methods: {
        //获取计算公司名称总数的请求(用来检测修改后的公司名称是否已经存在)
        async fetchNameTotal(value) {
            let s_name = value
            try {
                let {
                    data
                } = await this.$http.get('/supplierlist/total', {
                        params: {
                            s_name
                        }
                    })
                    // console.log(data.data) //输出公司名称总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //公司名称总数等于0或者修改后的公司名称等于修改前的公司名称，返回true(说明公司名称没重复)
                        if (data.data === 0 || s_name === this.oldrS_name) {
                            resolve(true)
                        } else {
                            reject('该公司名称已存在！请重新输入')
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算邮箱地址总数的请求(用来检测修改后的邮箱地址是否已经存在)
        async fetchEmailTotal(value) {
            let s_email = value
            try {
                let {
                    data
                } = await this.$http.get('/supplierlist/total', {
                        params: {
                            s_email
                        }
                    })
                    // console.log(data.data) //输出邮箱地址总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //邮箱地址总数等于0或者修改后的邮箱地址等于修改前的邮箱地址，返回true(说明邮箱地址没重复)
                        if (data.data === 0 || s_email === this.oldS_email) {
                            resolve(true)
                        } else {
                            reject('该邮箱地址已存在！请重新输入')
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算联系电话总数的请求(用来检测修改后的联系电话是否已经存在)
        async fetchPhoneTotal(value) {
            let s_phone = value
            try {
                let {
                    data
                } = await this.$http.get('/supplierlist/total', {
                        params: {
                            s_phone
                        }
                    })
                    // console.log(data.data)//输出联系电话总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //联系电话总数等于0或者修改后的联系电话等于修改前的联系电话，返回true(说明联系电话没重复)
                        if (data.data === 0 || s_phone === this.oldS_phone) {
                            resolve(true)
                        } else {
                            reject('该联系电话已存在！请重新输入')
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        // 公司地区选项发生改变时
        handleAreaChange() {
            let area = ''
            for (let key of this.selectedArea) { //把区域码转换成汉字
                area += this.$codeToTxt[`${key}`]
            }
            this.editForm.s_area = area

            this.editForm.areaCode = this.selectedArea //区域码
                // console.log(this.editForm.areaCode)
        },

        handleSelectionChange(val) { //当选择项发生变化时会触发该事件
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
        multDelete() { //批量删除按钮
            if (this.multSelectedId.length === 0) {
                this.disabled = true //禁用批量删除按钮
            } else {
                this.$confirm('您确定批量删除供应商信息吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'

                }).then(async() => {

                    try {
                        let {
                            data
                        } = await this.$http.delete(`/supplierlist/multId/${this.ids}`)
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

        async search() { //获取根据条件搜索供应商的请求
            let {
                filters,
                search,
                pagenum,
                pagesize
            } = this.query

            if (this.isTrue === false) {
                pagenum = 1
            }

            let s_id, s_name, s_contact, s_email, s_phone, s_area, s_adress, createtime
            if (filters === 's_id') {
                s_id = search
            } else if (filters === 's_name') {
                s_name = search
            } else if (filters === 's_contact') {
                s_contact = search
            } else if (filters === 's_email') {
                s_email = search
            } else if (filters === 's_phone') {
                s_phone = search
            } else if (filters === 's_area') {
                s_area = search
            } else if (filters === 's_adress') {
                s_adress = search
            } else if (filters === 'createtime') {
                createtime = search
            } else if (filters === '') {
                s_id = '',
                    s_contact = '',
                    s_name = '',
                    s_phone = '',
                    s_area = '',
                    s_adress = '',
                    createtime = ''
            }

            try {
                let {
                    data
                } = await this.$http.get(`/supplierlist/${pagenum}/${pagesize}`, {
                        params: {
                            s_id,
                            s_name,
                            s_contact,
                            s_email,
                            s_phone,
                            s_area,
                            s_adress,
                            createtime
                        }
                    })
                    // console.log(data)

                if (data.status === 1 && (s_id == '' || s_name == '' || s_contact == '' || s_email == '' || s_phone == '' || s_area == '' || s_adress == '' || createtime == '' || filters == '')) {
                    this.fetchAllPage() //获取分页和总条数的请求  
                    this.$message.warning('查询条件或查询内容不能为空')
                } else {
                    this.searchPage = true
                    if (data.status === 1) {
                        this.supplierList = data.data[0] //分页
                        this.query.total = data.data[1] //总条数
                        this.query.confirmSearch = search //已查询到数据的搜索内容

                        if (this.isTrue === false) {
                            this.query.pagenum = 1 //跳到第一页
                            this.$message.success('查询成功')
                        }
                    } else {
                        this.$message.error('抱歉！无符合此条件的供应商信息！请重新输入')
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

            let s_name = ''
            try {
                let {
                    data
                } = await this.$http.get(`/supplierlist/${pagenum}/${pagesize}`, {
                        params: {
                            s_name
                        }
                    })
                    // console.log(data)
                this.supplierList = data.data[0] //分页
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

            let s_name = ''
            try {
                let {
                    data
                } = await this.$http.get(`/supplierlist/${pagenum}/${pagesize}`, {
                        params: {
                            s_name
                        }
                    })
                    // console.log(data)
                this.supplierList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 
                this.query.pagenum = 1

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        getSupplierList() { //搜索框清空后获取供应商列表数据
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
        async showEdit(id) { //根据s_id展示需要修改的供应商信息
            try {
                let {
                    data
                } = await this.$http.get(`/supplierlist/${id}`)
                    // console.log(data.data)
                this.editForm = data.data[0] //获取成功
                this.oldrS_name = data.data[0].s_name //修改前的公司名称
                this.oldS_email = data.data[0].s_email //修改前的邮箱
                this.oldS_phone = data.data[0].s_phone //修改前的联系电话

                this.selectedArea = data.data[0].areaCode.split(',') //把区域码传给绑定的值，使其显示出来
                    // console.log(this.selectedArea)
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        editSupplier() { //修改供应商信息
            let { s_name, s_contact, s_email, s_phone, s_area, s_adress, areaCode } = this.editForm //解构修改供应商信息表单数据
            this.$refs.editFormRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取修改供应商信息的请求
                    try { //调用修改供应商信息请求
                        let { data } = await this.$http.patch(`/supplierlist/${this.editForm.id}`, {
                                s_name,
                                s_contact,
                                s_email,
                                s_phone,
                                s_area,
                                s_adress,
                                areaCode
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
        editDialogClosed() { //监听修改供应商信息对话框的关闭事件
            this.$refs.editFormRef.clearValidate() //移除校验结果
        },

        handleDelete(id) { //根据id删除供应商
            this.calculate //计算除数与取余数的属性
            let { pagesize, pagenum, remainNum, divisor } = this.query
                // console.log(pagenum)
                // console.log(divisor)
                // console.log(remainNum)
            this.$confirm('您确定删除该供应商信息吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'

            }).then(async() => {

                try {
                    let {
                        data
                    } = await this.$http.delete(`/supplierlist/${id}`)
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

        addSupplier() { //添加供应商信息
            this.$router.push('addsupplier')
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