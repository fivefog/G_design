export default {
    data() {
        return {
            myselfdata: [], //个人信息表格数据
        }
    },
    methods: {
        async fetchQuery() { //接收个人信息的请求

            let datatime = setInterval(async() => { //设置常规定时器自动去刷新axios请求
                try {
                    let {
                        data: { data }
                    } = await this.$http.get(`/myselfquery/${this.$route.params.id}`)
                    this.myselfdata = data
                } catch (error) {
                    clearInterval(datatime) //清除定时器
                }
            }, 300);
        }
    },
    created() {
        this.fetchQuery()
    }
}