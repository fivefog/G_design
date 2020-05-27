export default {
    data() {
        //用户名自定义规则对象
        let checkUsername = async(rule, value, callback) => {
            //接收检测用户名是否存在的Promise函数
            await this.fetchUsernameTotal(value)

            if (!/^[a-z]/i.test(value)) {
                callback(new Error('用户名必须以字母开头'));
            } else if (!/^[a-z][\w]+$/i.test(value)) {
                callback(new Error('用户名必须为数字、字母、下划线'));
            } else {
                callback();
            }
        };

        //姓名自定义规则对象
        let checkName = (rule, value, callback) => {
            const name = /^[\u4E00-\u9FA5]{2,6}$/
            if (!name.test(value)) {
                callback(new Error('姓名必须为汉字'));
            } else {
                callback();
            }
        };

        //密码自定义规则对象
        let checkPass = (rule, value, callback) => {
            if (!/^[a-z]/i.test(value)) {
                callback(new Error('密码必须以字母开头'));
            } else if (!/^[a-z][\w]+$/i.test(value)) {
                callback(new Error('密码必须为数字、字母、下划线'));
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

        //手机号自定义规则对象
        let checkPhone = async(rule, value, callback) => {
            //接收检测手机号是否存在的Promise函数
            await this.fetchPhoneTotal(value)
            const phone = /^1[3-9]\d{9}$/
            if (!phone.test(value)) {
                callback(new Error('请输入正确的手机号'));
            } else {
                callback();
            }
        };

        return {
            vipList: [], //会员信息数据
            query: { //会员列表的参数对象
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
            editForm: { //修改会员信息的表单数据
                username: '',
                name: '',
                password: '',
                role: '会员',
                sex: '',
                score: '',
                email: '',
                phone: ''
            },
            oldUsername: '', //修改前的用户名
            oldEmail: '', //修改前的邮箱地址
            oldPhone: '', //修改前的手机号
            upStaffsForm: { //升职的表单数据
                id: '',
                role: ''
            },
            multSelectedId: [], //多选数据的id(数组)
            ids: '', //多选数据的id(括号)
            isselectall: false, //是否全选
            searchPage: false, //用于区分获取全部数据的分页、总条数还是获取条件查询的分页、总条数
            filters: [ //条件查询下拉框数据
                {
                    value: 'v_id',
                    label: '会员号'
                },
                {
                    value: 'username',
                    label: '用户名'
                }, {
                    value: 'name',
                    label: '姓名'
                },
                {
                    value: 'password',
                    label: '密码'
                },
                {
                    value: 'sex',
                    label: '性别'
                },
                {
                    value: 'score',
                    label: '消费积分'
                },
                {
                    value: 'state',
                    label: '会员状态'
                },
                {
                    value: 'email',
                    label: '邮箱'
                },
                {
                    value: 'phone',
                    label: '手机号'
                },
                {
                    value: 'createtime',
                    label: '创建时间'
                }
            ],
            sex: [{ //性别下拉框数据
                value: '男'
            }, {
                value: '女'
            }],
            editFormRules: { //修改会员信息的校验证规则对象
                username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'change'
                    },
                    {
                        min: 3,
                        max: 8,
                        message: '用户名的长度在 3 到 8 个字符',
                        trigger: 'change'
                    },
                    { validator: checkUsername, trigger: 'change' }
                ],
                name: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'change'
                    },
                    {
                        min: 2,
                        max: 6,
                        message: '名字的长度在 2 到 6 个字符',
                        trigger: 'change'
                    },
                    { validator: checkName, trigger: 'change' }
                ],
                password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'change'
                    },
                    {
                        min: 3,
                        max: 8,
                        message: '密码的长度在 3 到 8 个字符',
                        trigger: 'change'
                    },
                    { validator: checkPass, trigger: 'change' }
                ],
                sex: [{
                    required: true,
                    message: '请选择性别'
                }],
                email: [{
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
                phone: [{
                        required: true,
                        message: '请输入手机号'
                    },
                    {
                        type: 'number',
                        message: '手机号必须为数字'
                    },
                    { validator: checkPhone, trigger: 'change' }
                ]
            },
            dialogFormVisibleEdit: false, //控制修改会员信息对话框的显示与隐藏
        }
    },
    methods: {
        //获取计算用户名总数的请求(用来检测修改后的用户名是否已经存在)
        async fetchUsernameTotal(value) {
            let { role } = this.editForm
            let username = value
            try {
                let {
                    data
                } = await this.$http.get('/viplist/usernameTotal', {
                        params: {
                            username,
                            role
                        }
                    })
                    // console.log(data.data)//输出用户名总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //用户名总数等于0或者修改后的用户名等于修改前的用户名，返回true(说明用户名没重复)
                        if (data.data === 0 || username === this.oldUsername) {
                            resolve(true)
                        } else {
                            reject('该用户名已存在！请重新输入')
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算邮箱地址总数的请求(用来检测修改后的邮箱地址是否已经存在)
        async fetchEmailTotal(value) {
            let email = value
            try {
                let {
                    data
                } = await this.$http.get('/viplist/emailTotal', {
                        params: {
                            email
                        }
                    })
                    // console.log(data.data) //输出邮箱地址总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //邮箱地址总数等于0或者修改后的邮箱地址等于修改前的邮箱地址，返回true(说明邮箱地址没重复)
                        if (data.data === 0 || email === this.oldEmail) {
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
        //获取计算手机号总数的请求(用来检测修改后的手机号是否已经存在)
        async fetchPhoneTotal(value) {
            let phone = value
            try {
                let {
                    data
                } = await this.$http.get('/viplist/phoneTotal', {
                        params: {
                            phone
                        }
                    })
                    // console.log(data.data)//输出手机号总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //手机号总数等于0或者修改后的手机号等于修改前的手机号，返回true(说明手机号没重复)
                        if (data.data === 0 || phone === this.oldPhone) {
                            resolve(true)
                        } else {
                            reject('该手机号已存在！请重新输入')
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
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
                this.$confirm('您确定批量删除会员信息吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'

                }).then(async() => {

                    try {
                        let {
                            data
                        } = await this.$http.delete(`/viplist/multId/${this.ids}`)
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

        async handleScoreChange(id, score) { //消费积分改变时
            try { //调用修改会员信息请求
                let { data } = await this.$http.patch(`/viplist/${id}`, {
                        score
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

        async search() { //获取根据条件搜索会员的请求
            let {
                filters,
                search,
                pagenum,
                pagesize
            } = this.query

            if (this.isTrue === false) {
                pagenum = 1
            }

            let v_id, username, name, password, sex, score, state, email, phone, createtime
            if (filters === 'v_id') {
                v_id = search
            } else if (filters === 'username') {
                username = search
            } else if (filters === 'name') {
                name = search
            } else if (filters === 'password') {
                password = search
            } else if (filters === 'sex') {
                sex = search
            } else if (filters === 'score') {
                score = search
            } else if (filters === 'state') {
                state = search
            } else if (filters === 'email') {
                email = search
            } else if (filters === 'phone') {
                phone = search
            } else if (filters === 'createtime') {
                createtime = search
            } else if (filters === '') {
                v_id = '',
                    username = '',
                    name = '',
                    password = '',
                    sex = '',
                    score = '',
                    phone = '',
                    createtime = ''
            }

            try {
                let {
                    data
                } = await this.$http.get(`/viplist/${pagenum}/${pagesize}`, {
                        params: {
                            v_id,
                            username,
                            name,
                            password,
                            sex,
                            score,
                            state,
                            email,
                            phone,
                            createtime
                        }
                    })
                    // console.log(data)

                if (data.status === 1 && (v_id == '' || username == '' || name == '' || password == '' || sex == '' || score == '' || state == '' || email == '' || phone == '' || createtime == '' || filters == '')) {
                    this.fetchAllPage() //获取分页和总条数的请求  
                    this.$message.warning('查询条件或查询内容不能为空')
                } else {
                    this.searchPage = true
                    if (data.status === 1) {
                        this.vipList = data.data[0] //分页
                        this.query.total = data.data[1] //总条数
                        this.query.confirmSearch = search //已查询到数据的搜索内容

                        if (this.isTrue === false) {
                            this.query.pagenum = 1 //跳到第一页
                            this.$message.success('查询成功')
                        }
                    } else {
                        this.$message.error('抱歉！无符合此条件的会员信息！请重新输入')
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

            let username = ''
            try {
                let {
                    data
                } = await this.$http.get(`/viplist/${pagenum}/${pagesize}`, {
                        params: {
                            username
                        }
                    })
                    // console.log(data)
                this.vipList = data.data[0] //分页
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

            let username = ''
            try {
                let {
                    data
                } = await this.$http.get(`/viplist/${pagenum}/${pagesize}`, {
                        params: {
                            username
                        }
                    })
                    // console.log(data)
                this.vipList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 
                this.query.pagenum = 1

            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        getVipList() { //搜索框清空后获取会员列表数据
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
        async showEdit(id) { //根据id展示需要修改的会员信息
            try {
                let {
                    data
                } = await this.$http.get(`/viplist/${id}`)

                this.editForm = data.data[0] //获取成功
                this.oldUsername = data.data[0].username
                this.oldPhone = data.data[0].phone
                this.oldEmail = data.data[0].email
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        editVip() { //修改会员信息
            let { username, name, password, sex, email, phone } = this.editForm //解构修改会员信息表单数据
            this.$refs.editFormRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取修改会员信息的请求
                    try { //调用修改会员信息请求
                        let { data } = await this.$http.patch(`/viplist/${this.editForm.id}`, {
                                username,
                                name,
                                password,
                                sex,
                                email,
                                phone
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
        editDialogClosed() { //监听修改会员信息对话框的关闭事件
            this.$refs.editFormRef.clearValidate() //移除校验结果
        },

        handleDelete(id) { //根据id删除会员
            this.calculate //计算除数与取余数的属性
            let { pagesize, pagenum, remainNum, divisor } = this.query
                // console.log(pagenum)
                // console.log(divisor)
                // console.log(remainNum)
            this.$confirm('您确定删除该会员信息吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'

            }).then(async() => {

                try {
                    let {
                        data
                    } = await this.$http.delete(`/viplist/${id}`)
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

        addVip() { //添加会员信息
            this.$router.push('addvip')
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