export default {
    name: 'passUpdate',
    data() {
        //新密码自定义规则对象
        let checkNewPass = (rule, value, callback) => {
            if (!/^[a-z]/i.test(value)) {
                callback(new Error('密码必须以字母开头'));
            } else if (!/^[a-z][\w]+$/i.test(value)) {
                callback(new Error('密码必须为数字、字母、下划线'));
            } else if (value === this.passForm.oldPassword) {
                callback(new Error('新密码与原密码相同！请重新输入'));
            } else {
                callback();
            }
        };
        //确认密码自定义规则对象
        let checkConfirmPass = (rule, value, callback) => {
            if (value !== this.passForm.newPassword) {
                callback(new Error('两次密码输入不一致'));
            } else {
                callback();
            }
        };
        return {
            passForm: { //修改密码的表单数据
                id: '',
                oldPassword: '', //原密码
                newPassword: '', //新密码
                checkPassword: '' //确认密码
            },
            passUpdateRules: { //修改密码的校验证规则对象
                newPassword: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 8,
                        message: '密码的长度在 3 到 8 个字符',
                        trigger: 'blur'
                    },
                    { validator: checkNewPass, trigger: 'blur' }
                ],
                checkPassword: [{
                        required: true,
                        message: '请再次输入密码',
                        trigger: 'blur'
                    },
                    { validator: checkConfirmPass, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        async fetchPassUpdate() { //获取个人信息的请求

            try {
                let {
                    data: { data }
                } = await this.$http.get(`/myselfquery/${this.$route.params.id}`)
                this.passForm = data[0]
                this.passForm.oldPassword = data[0].password
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        passUpdate() { //修改密码
            let { id, newPassword } = this.passForm //解构修改密码的表单数据
            let password = newPassword //新密码
            this.$refs.passUpdateRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取修改密码的请求
                    try { //调用修改密码请求
                        let { data } = await this.$http.patch(`/myselfupdate/${id}`, {
                            password
                        })
                        if (data.status === 1) {
                            this.$refs.newPassRef.resetField() //对新密码进行重置，将其值重置为初始值并移除校验结果
                            this.$refs.checkPassRef.resetField() //对确认密码进行重置，将其值重置为初始值并移除校验结果
                            this.fetchPassUpdate()
                            this.$message.success('修改成功')
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
        resetupdate() { //重置
            this.$refs.passUpdateRef.resetFields() //对新密码和确认密码进行重置，将其值重置为初始值并移除校验结果
            this.$message.success('重置成功')
        }
    },
    created() {
        this.fetchPassUpdate() //获取个人信息的请求
    }
}