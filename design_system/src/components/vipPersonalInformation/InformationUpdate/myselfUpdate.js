export default {
    name: 'myselfUpdate',
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
            myselfForm: { //个人信息修改的表单数据
                username: '',
                name: '',
                sex: '',
                phone: ''
            },
            oldUsername: '', //修改前的用户名
            oldEmail: '', //修改前的邮箱地址
            oldPhone: '', //修改前的手机号
            sex: [{ //性别下拉框数据
                value: '男'
            }, {
                value: '女'
            }],
            updateRules: { //修改个人信息的校验证规则对象
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
                        trigger: ['change', 'change']
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
            }
        }
    },
    methods: {
        //获取计算用户名总数的请求(用来检测修改后的用户名是否已经存在)
        async fetchUsernameTotal(value) {
            let { role } = this.myselfForm
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

        async fetchUpdate() { //获取个人信息的请求

            try {
                let {
                    data: { data }
                } = await this.$http.get(`/viplist/${this.$route.params.id}`)
                this.myselfForm = data[0]
                this.oldUsername = data[0].username
                this.oldPhone = data[0].phone
                this.oldEmail = data[0].email
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        myselfUpdate() { //修改个人信息
            let { v_id, username, name, sex, email, phone } = this.myselfForm //解构个人信息表单数据
            this.$refs.updateRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取修改信息的请求
                    try { //调用修改个人信息请求
                        let { data } = await this.$http.patch(`/viplist/${this.myselfForm.id}`, {
                            v_id,
                            username,
                            name,
                            sex,
                            email,
                            phone
                        })
                        if (data.status === 1) {
                            this.$message.success('修改成功')
                            this.fetchUpdate() //获取个人信息的请求
                        } else {
                            this.$message.warning('修改失败')
                        }
                    } catch (error) {
                        this.$message.error('服务器连接失败')
                    }
                } else { //校验失败
                    this.$message.warning('输入有误!请重新输入')
                    return false;
                }
            })
        },
        async cancelUpdate() { //取消修改

            try {
                let {
                    data
                } = await this.$http.get(`/viplist/${this.$route.params.id}`)
                if (data.status === 1) {
                    this.$message.success('取消成功')
                    this.myselfForm = data.data[0]
                    this.$refs.updateRef.clearValidate() //移除校验结果
                } else {
                    this.$message.error('取消失败')
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        }
    },
    created() {
        this.fetchUpdate() //获取个人信息的请求
    }
}