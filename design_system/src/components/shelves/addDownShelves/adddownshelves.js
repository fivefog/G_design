export default {
    name: 'adddownshelves',
    data() {
        //下架编号自定义规则对象
        let checkDown_id = async(rule, value, callback) => {
            //接收检测下架编号是否存在的Promise函数
            await this.fetchDown_idTotal(value)
            callback()
        };

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
            addDownShelvesForm: { //添加下架商品表单数据
                down_id: '', //下架架编号
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

            dialogVisibleAdd: false, //控制添加商品图片对话框的显示与隐藏
            goodsAction: this.$action, //商品图片上传的地址
            headers: { //商品图片上传的请求头
                superAdminAuthorization: localStorage.getItem('superAdminAuthorization')
            },

            imgurl: '', //商品图片重置前的图片路径
            addDownShelvesRules: { //修改信息的校验证规则对象
                down_id: [
                    { validator: checkDown_id, trigger: 'change' }
                ],
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
                g_imgurl: [{
                    required: true,
                    message: '请上传商品图片',
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
                    message: '请选择上架日期',
                    trigger: 'change'
                }]
            }
        }
    },
    methods: {
        goBack() { //返回下架商品列表
            this.$router.push('/superadminhome/downshelveslist')
        },
        //获取随机的下架编号
        fetchDown_id() {
            let id1 = this.$moment().format('YYYYMMDD')
            let id2 = Math.random().toString().slice(2, 6)
            let down_id = id1 + id2
            this.addDownShelvesForm.down_id = parseInt(down_id)
                // console.log(this.addDownShelvesForm.down_id)
        },
        //获取当前日期
        fetchDate() {
            this.addDownShelvesForm.down_datetime = this.$moment().format('YYYY-MM-DD')
                // console.log(this.addDownShelvesForm.down_datetime)
        },
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
                        this.addDownShelvesForm.g_name = g_name
                        this.addDownShelvesForm.g_unit = g_unit
                        this.addDownShelvesForm.c_name = c_name
                        resolve(true)
                    } else {
                        this.addDownShelvesForm.g_name = ''
                        this.addDownShelvesForm.g_unit = ''
                        this.addDownShelvesForm.c_name = ''
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
        //获取计算下架编号总数的请求(用来检测修改后的下架编号是否已经存在)
        async fetchDown_idTotal(value) {
            let down_id = value
            try {
                let {
                    data
                } = await this.$http.get('/downshelveslist/total', {
                        params: {
                            down_id
                        }
                    })
                    // console.log(data.data) //输出下架编号总数
                if (data.status === 1) {
                    return new Promise((resolve, reject) => {
                        //下架编号总数等于0返回true(说明下架编号没重复)
                        if (data.data === 0) {
                            resolve(true)
                        } else {
                            reject('该下架编号已存在！请更换下架编号')
                        }
                    })
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //获取根据商品编号查询上架数量、下架数量、销售数量的请求(判断下架数量是否大于上架商品剩余数量)
        async fetchNum(value) {
            let { g_id } = this.addDownShelvesForm
            value = parseInt(value) //字符串转换为整数(修改后的下架数量)

            let r_num //上架商品剩余数量

            // console.log(typeof(g_id))
            if (typeof(g_id) !== "string") {
                try {
                    let {
                        data
                    } = await this.$http.get(`/onshelveslist/allnum/${g_id}`)
                        // console.log(data.data) //输出下架数量、下架数量、销售数量

                    return new Promise((resolve, reject) => {
                        if (data.status === 1 && data.data.length > 0) {

                            if (data.data[2] !== undefined) {
                                let on_num = data.data[0].on_num //上架数量
                                let down_num = data.data[1].down_num //下架数量
                                let s_num = data.data[2].s_num //销售数量
                                r_num = on_num - (down_num + value + s_num) //上架商品剩余数量

                            } else if (data.data[1] !== undefined) {
                                let on_num = data.data[0].on_num //上架数量
                                let s_num = data.data[1].s_num //销售数量
                                r_num = on_num - (value + s_num) //上架商品剩余数量

                                if (isNaN(r_num) === true) {
                                    let on_num = data.data[0].on_num //上架数量
                                    let down_num = data.data[1].down_num //下架数量
                                    r_num = on_num - (down_num + value) //上架商品剩余数量
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
        //获取删除服务器里已上传的图片的请求(为了添加后清空图片或重置时使用)
        async fetchDeleteOldImg() {

            let imgurl = this.imgurl //要删除的图片路径
                // console.log(imgurl)
            try {
                await this.$http.delete('/upload/oldimg', {
                    params: {
                        imgurl
                    }
                })
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        //获取删除服务器里已上传的图片的请求（为了handleRemove时使用）
        async fetchDeleteImg(file) {

            let imgurl = file.response.data.url //要删除的图片路径
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
                    this.$message.success('删除成功')
                } else {
                    this.$message.error('删除失败')
                }
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //清空商品名称、商品规格、商品类别
        clearGoodData() {
            this.addDownShelvesForm.g_name = ''
            this.addDownShelvesForm.g_unit = ''
            this.addDownShelvesForm.g_name = ''
            this.fetchG_id() //获取上架商品中全部的商品编号
        },
        async addDownShelves() { //添加下架商品
            this.fetchG_id() //获取上架商品中全部的商品编号
            this.fetchDate() //获取当前日期

            let {
                down_id,
                g_id,
                g_name,
                g_imgurl,
                g_unit,
                c_name,
                down_num,
                down_datetime,
                down_note
            } = this.addDownShelvesForm

            this.$refs.addDownShelvesRef.validate(async(valid) => { //校验
                if (valid) { //校验成功获取添加下架商品的请求
                    try {
                        let {
                            data
                        } = await this.$http.post('/adddownshelves', {
                                down_id,
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

                        if (data.status === 1) { //状态码为1时添加成功
                            this.$message.success('添加成功')
                            this.$refs.addDownShelvesRef.resetFields() //对添加下架商品表单进行重置，将其值重置为初始值并移除校验结果
                            this.$refs.uploadRef.clearFiles() //清空已上传的图片
                            this.addDownShelvesForm.down_note = '' //清空备注  
                            this.fetchDown_id() //获取随机的下架编号
                            this.imgurl = '' //清空要删除的图片地址
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
        async handleSuccess(res) { //文件上传成功时的钩子
            this.addDownShelvesForm.g_imgurl = res.data.url //上传成功后的商品图片路径
                // console.log(this.addDownShelvesForm.g_imgurl)
            this.imgurl = res.data.url
            this.$message.success('上传成功')
        },
        handleError() { //文件上传失败时的钩子
            this.$message.error('上传图片失败')
        },
        handleRemove(file) { //图片移除文件时的钩子
            //console.log(file.response.data.url)
            this.fetchDeleteImg(file) //获取删除服务器里已上传的图片的请求
            this.addDownShelvesForm.g_imgurl = '' //清除商品图片路径
        },
        beforeAvatarUpload(file) { //上传文件之前的钩子
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
        handlePictureCardPreview(file) {
            // console.log(file)
            this.addDownShelvesForm.g_imgurl = file.url;
            this.dialogVisibleAdd = true;
        },
        handleExceed() { //文件超出个数限制时的钩子
            this.$message.warning('抱歉！仅能上传一张图片');
        },
        resetAddDownShelves() { //重置
            this.$refs.addDownShelvesRef.resetFields() //对添加下架商品表单进行重置，将其值重置为初始值并移除校验结果 
            this.$refs.uploadRef.clearFiles() //清空已上传的图片
            this.fetchDeleteOldImg() //删除服务器里已上传的图片
            this.addDownShelvesForm.down_note = '' //清空备注
            this.$message.success('重置成功')
            this.fetchDown_id() //获取随机的下架编号
            this.fetchG_id() //获取上架商品中全部的商品编号
        },
        //更换下架编号
        updateDown_id() {
            this.fetchDown_id() //获取随机的下架编号
            this.$message.success('更换成功')
        },
        // 刷新时删除服务器里已上传的图片
        removeImg() {
            this.fetchDeleteOldImg() //删除服务器里已上传的图片
        }
    },
    created() {
        this.fetchDown_id() //获取随机的下架编号
        this.fetchG_id() //获取上架商品中全部的商品编号

        // 添加当浏览器刷新或关闭时触发的监听事件
        window.addEventListener('beforeunload', this.removeImg)
    },
    watch: { //监听路由变化
        $route(to) {
            // console.log(to.meta.title)
            if (to.meta.title === '添加下架商品') {
                this.fetchG_id() //获取上架商品中全部的商品编号
            }
        }
    }
}