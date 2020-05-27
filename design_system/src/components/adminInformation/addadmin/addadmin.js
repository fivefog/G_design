export default {
    name: 'addadmin',
    data() {
        //员工号自定义规则对象
        let checkId = async(rule, value, callback) => {
            //接收检测员工号是否存在的Promise函数
            await this.fetchIdTotal(value)
            callback()
        };

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

        //年龄自定义规则对象
        let checkAge = (rule, value, callback) => {
            if (!/^[1-9]$|^[1-9][0-9]$/.test(value)) {
                callback(new Error('请输入正确的年龄'));
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
            addAdminForm: { //添加管理员信息表单数据
                s_id: '',
                username: '',
                name: '',
                password: '',
                role: '管理员',
                sex: '',
                age: '',
                xueli: '',
                email: '',
                phone: '',
                createtime: ''
            },
            sex: [{ //性别下拉框数据
                value: '男'
            }, {
                value: '女'
            }],
            xueli: [{ //学历下拉框数据
                    value: '小学'
                },
                {
                    value: '初中'
                },
                {
                    value: '高中'
                },
                {
                    value: '大专'
                },
                {
                    value: '本科'
                },
                {
                    value: '硕士'
                },
                {
                    value: '博士'
                },
            ],

            addAdminRules: { //修改信息的校验证规则对象
                s_id: [
                    { validator: checkId, trigger: 'change' }
                ],
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
                age: [{
                        required: true,
                        message: '请输入年龄'
                    },
                    {
                        type: 'number',
                        message: '年龄必须为数字'
                    },
                    { validator: checkAge, trigger: 'change' }
                ],
                xueli: [{
                    required: true,
                    message: '请选择学历'
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
        }
    },
    methods: {
        goBack() { //返回管理员列表
            this.$router.push('/superadminhome/adminlist')
        },
        //获取随机员工号
        fetchS_id() {
            let id1 = this.$moment().format('YYYY')
            let id2 = Math.random().toString().slice(2, 6)
            let s_id = id1 + id2
            this.addAdminForm.s_id = parseInt(s_id)
                // console.log(this.addAdminForm.s_id)
        },
        //获取当前日期
        fetchDate() {
            this.addAdminForm.createtime = this.$moment().format('YYYY-MM-DD')
                // console.log(this.addAdminForm.createtime)
        },
        //获取计算员工号总数的请求(用来检测修改后的员工号是否已经存在)
        async fetchIdTotal(value) {
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
                        //员工号总数等于0返回true(说明员工号没重复)
                        if (data.data === 0) {
                            resolve(true)
                        } else {
                            reject('该员工号已存在！请更换员工号')
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取计算用户名总数的请求(用来检测修改后的用户名是否已经存在)
        async fetchUsernameTotal(value) {
            let { role } = this.addAdminForm
            let username = value
            try {
                let {
                    data
                } = await this.$http.get('/myselfupdate/usernameTotal', {
                        params: {
                            username,
                            role
                        }
                    })
                    // console.log(data.data) //输出用户名总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        if (data.data === 0) { //用户名总数等于0返回true(说明用户名没重复)
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
        //获取计算手机号总数的请求(用来检测修改后的手机号是否已经存在)
        async fetchPhoneTotal(value) {
            let phone = value
            try {
                let {
                    data
                } = await this.$http.get('/myselfupdate/phoneTotal', {
                        params: {
                            phone
                        }
                    })
                    // console.log(data.data)//输出手机号总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //手机号总数等于0返回true(说明手机号没重复)
                        if (data.data === 0) {
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
        //获取计算邮箱地址总数的请求(用来检测修改后的邮箱地址是否已经存在)
        async fetchEmailTotal(value) {
            let email = value
            try {
                let {
                    data
                } = await this.$http.get('/myselfupdate/emailTotal', {
                        params: {
                            email
                        }
                    })
                    // console.log(data.data) //输出邮箱地址总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //邮箱地址总数等于0返回true(说明邮箱地址没重复)
                        if (data.data === 0) {
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

        async addAdmin() { //添加管理员信息
            let {
                s_id,
                username,
                name,
                password,
                role,
                sex,
                age,
                xueli,
                email,
                phone,
                createtime
            } = this.addAdminForm

            this.$refs.addAdminRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取添加管理员信息信息的请求
                    try {
                        let {
                            data
                        } = await this.$http.post('/addadmin', {
                            s_id,
                            username,
                            name,
                            password,
                            role,
                            sex,
                            age,
                            xueli,
                            email,
                            phone,
                            createtime
                        })

                        if (data.status === 1) { //状态码为1时添加成功
                            this.$message.success('添加成功')
                            this.$refs.addAdminRef.resetFields() //对添加管理员信息表单进行重置，将其值重置为初始值并移除校验结果
                            this.fetchS_id() //获取随机员工号
                            this.fetchDate() //获取当前日期
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
        //重置
        resetAddAdmin() {
            this.$refs.addAdminRef.resetFields() //对添加管理员信息表单进行重置，将其值重置为初始值并移除校验结果
            this.$message.success('重置成功')
            this.fetchS_id() //获取随机员工号
            this.fetchDate() //获取当前日期
        },
        //更换员工号
        updateS_id() {
            this.fetchS_id() //获取随机员工号
            this.$message.success('更换成功')
        }
    },
    created() {
        this.fetchS_id() //获取随机员工号
        this.fetchDate() //获取当前日期
    },
    watch: { //监听路由变化
        $route(to) {
            // console.log(to.meta.title)
            if (to.meta.title === '添加管理员信息') {
                this.fetchDate() //获取当前日期
            }
        }
    }
}