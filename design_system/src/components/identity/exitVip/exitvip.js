export default {
    name: 'exitvip',
    data() {
        return {
            exitVipForm: { //申请退出会员的表单数据
                v_id: '',
                name: '',
                sex: '',
                state: ''
            }
        }
    },
    methods: {
        async fetchExitVip() { //获取个人信息的请求

            try {
                let {
                    data: { data }
                } = await this.$http.get(`/viplist/${this.$route.params.id}`)
                this.exitVipForm = data[0]
                    // console.log(data)
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },
        exitVip() { //修改会员状态(正常=>申请退出中)
            let state = '申请退出中'
            this.$confirm('您确定要退出会员吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'

            }).then(async() => {
                try { //调用修改会员状态请求
                    let { data } = await this.$http.patch(`/viplist/${this.exitVipForm.id}`, {
                        state
                    })
                    if (data.status === 1) {
                        this.fetchExitVip() //获取个人信息的请求
                        this.$message.success('申请成功')
                    } else {
                        this.$message.warning('申请失败')
                    }
                } catch (error) {
                    this.$message.error('服务器连接失败')
                }
            }).catch(() => {
                this.$message.info('已取消');
            })
        },
        recoverVip() { //修改会员状态(申请退出中=>正常)
            let state = '正常'
            this.$confirm('您确定取消申请吗?', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'

            }).then(async() => {
                try { //调用修改会员状态请求
                    let { data } = await this.$http.patch(`/viplist/${this.exitVipForm.id}`, {
                        state
                    })
                    if (data.status === 1) {
                        this.fetchExitVip() //获取个人信息的请求
                        this.$message.success('取消申请成功')
                    } else {
                        this.$message.warning('取消申请失败')
                    }
                } catch (error) {
                    this.$message.error('服务器连接失败')
                }
            }).catch(() => {
                this.$message.info('已取消');
            })
        }
    },
    created() {
        this.fetchExitVip() //获取个人信息的请求
    }
}