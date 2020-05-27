export default {
    name: 'addsupplier',
    data() {
        //供应商编号自定义规则对象
        let checkId = async(rule, value, callback) => {
            //接收检测供应商编号是否存在的Promise函数
            await this.fetchIdTotal(value)
            callback()
        };

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

        //公司地址自定义规则对象
        let checkAdress = async(rule, value, callback) => {
            const s_adress = /^[\u4E00-\u9FA5\d]{2,40}$/

            if (!s_adress.test(value)) {
                callback(new Error('公司地址必须为汉字或数字'));
            } else {
                callback();
            }
        };


        return {
            addSupplierForm: { //添加供应商信息信息表单数据
                s_id: '', //供应商编号
                s_name: '', //公司名称
                s_contact: '', //负责人姓名
                s_email: '', //邮箱
                s_phone: '', //联系电话
                s_area: '', //公司地区
                s_adress: '', //详细地址
                areaCode: '', //公司地区区域码
                createtime: '' //创建时间
            },

            options: this.$regData, //省市区级联动数据
            selectedArea: [], //选中的公司地区
            addSupplierRules: { //修改信息的校验证规则对象
                s_id: [
                    { validator: checkId, trigger: 'change' }
                ],
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
        }
    },
    methods: {
        goBack() { //返回供应商编号列表
            this.$router.push('/superadminhome/supplierlist')
        },
        //获取随机供应商编号
        fetchS_id() {
            let id1 = this.$moment().format('YYYY')
            let id2 = Math.random().toString().slice(2, 6)
            let s_id = id1 + id2
            this.addSupplierForm.s_id = parseInt(s_id)
                // console.log(this.addSupplierForm.s_id)
        },
        //获取当前日期
        fetchDate() {
            this.addSupplierForm.createtime = this.$moment().format('YYYY-MM-DD')
                // console.log(this.addSupplierForm.createtime)
        },
        //获取计算供应商编号总数的请求(用来检测修改后的供应商编号是否已经存在)
        async fetchIdTotal(value) {
            let s_id = value
            try {
                let {
                    data
                } = await this.$http.get('/supplierlist/total', {
                        params: {
                            s_id
                        }
                    })
                    // console.log(data.data) //输出供应商编号总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //供应商编号总数等于0返回true(说明供应商编号没重复)
                        if (data.data === 0) {
                            resolve(true)
                        } else {
                            reject('该供应商编号已存在！请更换供应商编号')
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
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
                        //公司名称总数等于0返回true(说明公司名称没重复)
                        if (data.data === 0) {
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
                        //联系电话总数等于0返回true(说明联系电话没重复)
                        if (data.data === 0) {
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
        // 公司地区选项发生改变时
        handleAreaChange() {
            let area = ''
            for (let key of this.selectedArea) { //把区域码转换成汉字
                area += this.$codeToTxt[`${key}`]
            }
            this.addSupplierForm.s_area = area
            this.addSupplierForm.areaCode = this.selectedArea //区域码
                // console.log(this.addSupplier.areaCode)
        },

        async addSupplier() { //添加供应商信息信息
            let {
                s_id,
                s_name,
                s_contact,
                s_email,
                s_phone,
                s_area,
                s_adress,
                areaCode,
                createtime
            } = this.addSupplierForm

            this.$refs.addSupplierRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取添加供应商信息信息信息的请求
                    try {
                        let {
                            data
                        } = await this.$http.post('/addsupplier', {
                            s_id,
                            s_name,
                            s_contact,
                            s_email,
                            s_phone,
                            s_area,
                            s_adress,
                            areaCode,
                            createtime
                        })
                        if (data.status === 1) { //状态码为1时添加成功
                            this.$message.success('添加成功')
                            this.selectedArea = []
                            this.$refs.addSupplierRef.resetFields() //对添加供应商信息信息表单进行重置，将其值重置为初始值并移除校验结果
                            this.fetchS_id() //获取随机供应商编号
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

        resetAddSupplier() { //重置
            this.selectedArea = []
            this.$refs.addSupplierRef.resetFields() //对添加供应商信息信息表单进行重置，将其值重置为初始值并移除校验结果
            this.$message.success('重置成功')
            this.fetchS_id() //获取随机供应商编号
            this.fetchDate() //获取当前日期
        },
        //更换供应商编号
        updateS_id() {
            this.fetchS_id() //获取随机供应商编号
            this.$message.success('更换成功')
        }
    },
    created() {
        this.fetchS_id() //获取随机供应商编号
        this.fetchDate() //获取当前日期
    },
    watch: { //监听路由变化
        $route(to) {
            // console.log(to.meta.title)
            if (to.meta.title === '添加供应商信息信息') {
                this.fetchDate() //获取当前日期
            }
        }
    }
}