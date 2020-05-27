import img0 from '../../assets/imgs/img0.jpg'
import img1 from '../../assets/imgs/img1.jpg'
import img2 from '../../assets/imgs/img2.jpg'
import img3 from '../../assets/imgs/img3.jpg'
import img4 from '../../assets/imgs/img4.jpg'
import img5 from '../../assets/imgs/img5.jpg'
import img6 from '../../assets/imgs/img6.jpg'
import img7 from '../../assets/imgs/img7.jpg'
import img8 from '../../assets/imgs/img8.jpg'
import img9 from '../../assets/imgs/img9.jpg'
import img10 from '../../assets/imgs/img10.jpg'
import img11 from '../../assets/imgs/img11.jpg'
export default {
    data() {
        //新密码自定义规则对象
        let checkNewPass = (rule, value, callback) => {
            if (!/^[a-z]/i.test(value)) {
                callback(new Error('密码必须以字母开头'));
            } else if (!/^[a-z][\w]+$/i.test(value)) {
                callback(new Error('密码必须为数字、字母、下划线'));
            } else {
                callback();
            }
        };
        //确认密码自定义规则对象
        let checkConfirmPass = (rule, value, callback) => {
            if (value !== this.editForm.newPassword) {
                callback(new Error('两次密码输入不一致'));
            } else {
                callback();
            }
        };

        //验证码自定义规则对象
        let checkVerifynum = (rule, value, callback) => {
            let { username, role, email, newVerifynum } = this.editForm
            if (!/^\d{6,6}$/.test(value)) {
                callback(new Error('验证码必须为6位数的数字'));
            } else if (newVerifynum === '') {
                callback(new Error('请先获取验证码'));
            } else if (newVerifynum === '失效') {
                callback(new Error('验证码已失效！请重新获取验证码'));
            } else if (value !== newVerifynum || username !== this.oldUsername || role !== this.oldRole || email !== this.oldEmail) {
                callback(new Error('验证码错误！请重新输入'));
            } else {
                callback();
            }
        };

        return {
            formdata: { //表单数据
                username: '', //用户名
                password: '', //密码
                role: '', //角色
                sliderText: '向右拖动滑块填充拼图'
            },
            editForm: {
                id: '',
                username: '', //用户名
                role: '', //角色
                email: '', //邮箱地址
                verifynum: '', //验证码
                newVerifynum: '', //新的验证码
                newPassword: '', //新密码
                checkPassword: '' //确认密码
            },
            oldUsername: '', //输入框获取验证码后确认的的用户名
            oldRole: '', //输入框获取验证码后确认的的角色
            oldEmail: '', //输入框获取验证码后确认的的邮箱
            verifyText: '获取验证码',
            isTrue: false, //是否点击了发送验证码按钮
            firstTimer: null, //60s倒计时定时器名称(获取验证码)
            secondTimer: null, //300s倒计时定时器名称(验证码失效时间【5分钟】)
            totalTime: 60, //记录具体倒计时时间
            codeTime: 300,
            //背景图数组
            imgs: [
                img0,
                img1,
                img2,
                img3,
                img4,
                img5,
                img6,
                img7,
                img8,
                img9,
                img10,
                img11
            ],
            checkTrue: false, //检验是否验证通过
            loginFormRules: { //信息的校验证规则对象
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'change'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'change'
                }],
                role: [{
                    required: true,
                    message: '请选择角色',
                    trigger: 'change'
                }]
            },
            editFormRules: { //重置密码的校验证规则对象
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'change'
                }],
                role: [{
                    required: true,
                    message: '请选择角色',
                    trigger: 'change'
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
                    }
                ],
                verifynum: [{
                        required: true,
                        message: '请输入验证码',
                        trigger: 'change'
                    },
                    { validator: checkVerifynum, trigger: 'change' }
                ],
                newPassword: [{
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
                    { validator: checkNewPass, trigger: 'change' }
                ],
                checkPassword: [{
                        required: true,
                        message: '请再次输入密码',
                        trigger: 'change'
                    },
                    { validator: checkConfirmPass, trigger: 'change' }
                ]
            },
            roles: [{ //身份类别下拉框数据
                    value: '超级管理员'
                }, {
                    value: '管理员'
                },
                {
                    value: '售货员'
                },
                {
                    value: '会员'
                }
            ],
            dialogFormVisibleEdit: false, //控制重置密码对话框的显示与隐藏
        }
    },
    methods: {
        // 获取id
        async fetchId() {
            let { username, email, role } = this.editForm

            if (role === '超级管理员' || role === '管理员' || role === '售货员') { //如果角色是超级管理员、管理员或者售货员
                try {
                    let {
                        data
                    } = await this.$http.get('/forgetpwd/querystaff', {
                            params: {
                                username,
                                email,
                                role
                            }
                        })
                        // console.log(data)

                    if (data.status === 1) {
                        this.editForm.id = data.data.id
                        this.oldUsername = data.data.username
                        this.oldRole = data.data.role
                        this.oldEmail = data.data.email
                        this.fetchVerifynum() //获取随机验证码并发送到邮箱

                    } else {
                        this.$message.error('抱歉！您填写的账户资料不匹配！无法发送验证码')
                    }
                } catch (error) {
                    this.$message.error('服务器连接失败')
                }
            } else if (role === '会员') {
                try {
                    let {
                        data
                    } = await this.$http.get('/forgetpwd/queryvip', {
                            params: {
                                username,
                                email,
                                role
                            }
                        })
                        // console.log(data)

                    if (data.status === 1) {
                        this.editForm.id = data.data.id
                        this.oldUsername = data.data.username
                        this.oldRole = data.data.role
                        this.oldEmail = data.data.email
                        this.fetchVerifynum() //获取随机验证码并发送到邮箱

                    } else {
                        this.$message.error('抱歉！您填写的账户资料不匹配！无法发送验证码')
                    }
                } catch (error) {
                    this.$message.error('服务器连接失败')
                }
            }
        },
        //获取随机验证码并发送到邮箱
        async fetchVerifynum() {
            // 获取随机验证码
            this.editForm.newVerifynum = Math.random().toString().slice(2, 8)
            let verifynum = this.editForm.newVerifynum
                // console.log(verifynum)

            let { email } = this.editForm
            try {
                let {
                    data
                } = await this.$http.post('/forgetpwd/sendEmail', {
                        email,
                        verifynum
                    })
                    // console.log(data)

                if (data.status === 1) {
                    this.isTrue = true
                    this.codeTime = 300 //倒计时300s(验证码失效时间)

                    //60s倒计时
                    this.firstTimer = setInterval(() => {
                        this.totalTime--

                            if (this.totalTime === 0) {
                                clearInterval(this.firstTimer)
                                this.totalTime = 60
                                this.isTrue = false
                                this.verifyText = '重新获取'
                            }

                    }, 1000);

                    //300s倒计时
                    this.secondTimer = setInterval(() => {
                        this.codeTime--

                            if (this.codeTime === 0) {
                                clearInterval(this.secondTimer)
                                this.codeTime = 300
                                this.editForm.newVerifynum = '失效' //验证码已失效
                            }

                    }, 1000);
                    this.$message.success('验证码已发送')
                } else {
                    this.$message.error('验证码发送失败')
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        handlogin() {
            let {
                username,
                password,
                role
            } = this.formdata
            this.$refs.loginFormRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取登录信息的请求
                    if (role === '超级管理员' || role === '管理员' || role === '售货员') { //如果角色是超级管理员、管理员或者售货员
                        try {
                            //登录界面接收服务器响应回来的数据
                            let {
                                data
                            } = await this.$http.post('/login/staff', {
                                username,
                                password,
                                role
                            })

                            //用户名状态码为1时登录成功
                            if (data.status === 1 && role === '超级管理员' && this.checkTrue === true) {
                                let id = data.data[0].map(item => { //获取id
                                    return item.id
                                })

                                id = id[0]

                                localStorage.setItem('superAdminAuthorization', data.data[1]) //获取token并保存到本地

                                //跳转到超级管理员主页
                                this.$router.replace({
                                    name: 'superadminHome',
                                    params: {
                                        id
                                    }
                                })
                                this.$message.success('登录成功')
                            } else if (data.status === 1 && role === '管理员' && this.checkTrue === true) {
                                let id = data.data[0].map(item => { //获取id
                                    return item.id
                                })
                                id = id[0]

                                localStorage.setItem('adminAuthorization', data.data[1]) //获取token并保存到本地

                                //跳转到管理员主页
                                this.$router.replace({
                                    name: 'adminHome',
                                    params: {
                                        id
                                    }
                                })
                                this.$message.success('登录成功')
                            } else if (data.status === 1 && role === '售货员' && this.checkTrue === true) {
                                let id = data.data[0].map(item => { //获取id
                                    return item.id
                                })
                                id = id[0]

                                localStorage.setItem('saleAuthorization', data.data[1]) //获取token并保存到本地

                                //跳转到售货员主页
                                this.$router.replace({
                                    name: 'salesmanHome',
                                    params: {
                                        id
                                    }
                                })
                                this.$message.success('登录成功')
                            } else if (this.checkTrue === false) {
                                this.$message.warning('请先完成滑块验证')
                            } else {
                                this.$message.error('用户名或密码错误')
                            }
                        } catch (error) {
                            this.$message.error('服务器连接失败')
                        }
                    } else if (role === '会员') { //如果角色是超级会员
                        try {
                            //登录界面接收服务器响应回来的数据
                            let {
                                data
                            } = await this.$http.post('/login/vip', {
                                username,
                                password,
                                role
                            })

                            //用户名状态码为1时登录成功
                            if (data.status === 1 && this.checkTrue === true) {
                                let id = data.data[0].map(item => { //获取id
                                    return item.id
                                })
                                id = id[0]

                                localStorage.setItem('vipAuthorization', data.data[1]) //获取token并保存到本地

                                //跳转到超市会员主页
                                this.$router.replace({
                                    name: 'vipHome',
                                    params: {
                                        id
                                    }
                                })
                                this.$message.success('登录成功')
                            } else if (this.checkTrue === false) {
                                this.$message.warning('请先完成滑块验证')
                            } else {
                                this.$message.error('用户名或密码错误')
                            }
                        } catch (error) {
                            this.$message.error('服务器连接失败')
                        }
                    }
                } else { //校验失败
                    this.$message.warning('用户名或密码或角色不能为空')
                    return false;
                }
            })
        },
        resetLogin() { //重置
            this.$refs.loginFormRef.resetFields() //对登录表单进行重置，将其值重置为初始值并移除校验结果
            this.$refs.slideblock.reset()
            this.$message.success('重置成功')
        },
        //验证成功时触发
        onSuccess() {
            this.checkTrue = true
            this.$message.success('验证成功')
        },
        //验证失败时触发
        onFail() {
            this.checkTrue = false
            this.$message.error('验证失败')
        },
        //点击刷新小图标时触发
        onRefresh() {
            this.checkTrue = false
        },
        //检测到非人为操作滑动时触发
        onAgain() {
            this.checkTrue = false
            this.$message.success('检测到非人为操作！请再试一次')

            // 刷新
            this.$refs.slideblock.reset();
        },
        //发送验证码邮件
        sendVerifynum() {
            let { username, role, email } = this.editForm
            if (username === '' || role === '' || email === '') {
                this.$message.warning('用户名或角色或邮箱不能为空')
            } else {
                this.fetchId() //获取id并验证账户资料资料是否匹配
            }
        },
        //重置密码
        async editPwd() {
            let { id, newPassword, role } = this.editForm //解构重置密码的表单数据
            let password = newPassword //新密码
            this.$refs.editFormRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取修改售货员信息的请求

                    if (role === '超级管理员' || role === '管理员' || role === '售货员') { //如果角色是超级管理员、管理员或者售货员
                        try { //调用修改售货员信息请求
                            let { data } = await this.$http.patch(`/forgetpwd/staff/${id}`, {
                                    password
                                })
                                // console.log(data)

                            if (data.status === 1) {
                                this.$message.success('重置密码成功')
                                this.dialogFormVisibleEdit = false //关闭对话框
                            } else {
                                this.$message.error('重置密码失败')
                            }
                        } catch (error) {
                            this.$message.error('服务器连接失败')
                        }
                    } else if (role === '会员') {
                        try { //调用修改售货员信息请求
                            let { data } = await this.$http.patch(`/forgetpwd/vip/${id}`, {
                                    password
                                })
                                // console.log(data)
                            if (data.status === 1) {
                                this.$message.success('重置密码成功')
                                this.dialogFormVisibleEdit = false //关闭对话框
                            } else {
                                this.$message.error('重置密码失败')
                            }
                        } catch (error) {
                            this.$message.error('服务器连接失败')
                        }
                    }

                } else { //校验失败
                    this.$message.warning('输入有误！请重新输入')
                    return false;
                }
            })
        },
        //监听重置密码对话框的打开事件
        editDialogOpen() {
            this.verifyText = '获取验证码'
        },
        //监听重置密码对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields() //对重置密码表单进行重置，将其值重置为初始值并移除校验结果
            clearInterval(this.firstTimer) //60a清除定时器
            clearInterval(this.secondTimer) //300s清除定时器
            this.totalTime = 60 //倒计时60s(获取验证码)
            this.codeTime = 300 //倒计时300s(验证码失效时间)
            this.isTrue = false
        }
    }
}