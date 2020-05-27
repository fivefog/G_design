export default {
    data() {
        return {
            menulist: [], //左侧菜单数据
            myselfdata: {
                name: '', //姓名
                sex: '', //性别
                role: '' //超市角色
            },
            tags: [], //存放tag导航页的名称与路径
            activeIndex: '', //当前子菜单的index
            isCollapse: false, //默认菜单展开
            asideWidth: '', //侧边栏宽度
            timer: null, //定时器名称
            nowId: 0, //当前tag导航标签的索引
            nowTag: '' //当前tag导航标签的数据
        }
    },
    methods: {
        //获取超级管理员的左侧菜单数据
        async fetchMenuList() {
            try {
                let { data } = await this.$http.get('/menu/tree/superadmin')
                this.menulist = data.data
                    console.log('menulist:',data.data)
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        async fetchQuery() { //获取个人信息的请求

            try {
                let {
                    data: { data }
                } = await this.$http.get(`/myselfquery/${this.$route.params.id}`)
                this.myselfdata = data[0]
                    // console.log(data[0])
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        //下拉框里的个人信息、修改密码、退出
        handleCommand(command) {
            //个人信息
            if (command === 'myInformation') {
                this.$router.push('myselfquery')
            }
            //修改密码
            else if (command === 'passwordUpdate') {
                this.$router.push('passupdate')
            }
            //退出
            else if (command === 'loginOut') {
                this.$confirm('您确定要退出系统吗?', '温馨提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //清除token
                    localStorage.removeItem('superAdminAuthorization')
                    this.$router.replace('/login')
                    this.$message.success('退出成功！欢迎您下次使用')
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出'
                    });
                });
            }
        },
        setcollapse() { //点击折叠与展开图标时
            this.isCollapse = !this.isCollapse
                // console.log(this.isCollapse)
            if (this.isCollapse === true) {
                this.asideWidth = '74px'
            } else if (this.isCollapse === false) {
                this.asideWidth = '224px'
            }
        },
        handSelect(index) { //点击菜单时
            this.activeIndex = index //将activeIndex赋值给index
        },
        tabChange(item) { //点击tag导航页触发路由实现跳转
            this.$router.push(item.path)
        },
        handleClose(item) { //移除tag导航页，关闭页面
            let tagdata = [] //存放剩余的tag导航标签的路径
            for (let i = 0; i < this.tags.length; i++) {
                if (this.tags[i].path === item.path) {
                    this.tags.splice(i, 1)

                    // 将剩余的tag导航标签的路径放进tagdata中
                    this.tags.forEach((item, index, arr) => {
                        arr[index] = item //返回为true
                        tagdata.push(item.path)
                    })

                    tagdata.forEach((item, index, arr) => {
                            arr[index] = item //返回为true
                            this.nowId = arr.indexOf(this.nowTag) //当前tag导航标签的索引
                        })
                        // console.log('n', this.nowId)

                    //检索tags[i]的索引
                    let currentIdx = this.tags.indexOf(this.tags[i])
                        // console.log(this.tags[i])
                        // console.log('c', currentIdx)

                    //在首位的位置或中间的位置移除
                    if (i === currentIdx && this.nowId === -1) {
                        this.$router.push(this.tags[i].path)
                            // console.log(this.tags[i].path)
                    }
                    //在末位的位置移除
                    else if (currentIdx === -1 && this.nowId === -1) {
                        this.$router.push(this.tags[i - 1].path)
                            // console.log(this.tags[i-1].path)
                    }
                    //全部移除后跳转回首页
                    else if (this.tags.length === 0) {
                        this.$router.push('welcome')
                    }
                }
            }
        }
    },
    created() {
        this.fetchMenuList() //获取左侧菜单数据
        this.$router.push('welcome') //刷新后默认高亮在首页
        this.asideWidth = '224px' //侧边栏展开时的宽度
        this.fetchQuery() //获取个人信息的请求
    },
    watch: {
        $route(to) {
            // console.log(to)
            if (to.meta.title === '个人信息修改') {
                this.timer = setInterval(() => { //设置常规定时器自动去刷新请求
                    this.fetchQuery() //获取个人信息的请求
                }, 400);
            } else {
                clearInterval(this.timer) //清除常规定时器
            }

            this.activeIndex = to.path //当前index

            let name = to.meta.title //菜单名称
            let path = to.path //菜单路径
            let type = '' //类型
            let tag = [{ name, path, type }]

            // 将点击的菜单名称和路径放进this.tags里
            tag.forEach(item => {
                //不是路径首页才能放入tags中
                if (item.path !== `/superadminhome/${this.$route.params.id}/welcome`) {
                    this.tags.push(item)
                }
            })

            let tagdata = [] //存放已点击tag导航标签的路径

            // 将已点击tag导航标签的路径放进tagdata中
            this.tags.forEach((item, index, arr) => {
                arr[index] = item //返回为true
                tagdata.push(item.path)
            })

            tagdata.forEach((item, index, arr) => {
                    arr[index] = item //返回为true
                    this.nowId = arr.indexOf(arr[arr.length - 1]) //当前tag导航标签的索引
                    this.nowTag = arr[arr.length - 1] //当前tag导航标签的数据
                })
                // console.log(this.nowId)//当前tag导航标签的索引

            this.tags.forEach((item, index, arr) => {
                arr[index] = item //返回为true

                //如果当前tag导航标签的索引与tags的某个索引相等且不是首页,则tag导航标签变绿色
                if (this.nowId === index && to.path !== `/superadminhome/${this.$route.params.id}/welcome`) {
                    arr[index].type = 'success'
                } else {
                    arr[index].type = ''
                }
            })

            //tags完全去重
            this.tags = this.$_.unionBy(this.tags, 'path')

            // console.log(this.tags)
        }
    }
}