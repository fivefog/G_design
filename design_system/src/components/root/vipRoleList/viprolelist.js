export default {
    data() {
        return {
            superList: [], //权限列表数据
            query: { //权限列表的参数对象
                pagenum: 1, //当前页码
                pagesize: 10, //每页显示的数据条数  
                total: 0 //总条数.
            }
        }
    },
    methods: {
        async fetchToolPage() { //获取全部权限数据的分页和总条数的请求
            let { pagenum, pagesize } = this.query
            try {
                let {
                    data
                } = await this.$http.get(`/menu/list/${pagenum}/${pagesize}/vip`)
                    // console.log(data)
                this.superList = data.data[0] //分页
                this.query.total = data.data[1] //总条数 
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        },

        pagenumChange(newPagenum) { //页码改变
            this.query.pagenum = newPagenum
            this.fetchToolPage() //获取分页和总条数的请求 
        },

        pagesizeChange(newPagesize) { //每页显示的数据条数改变
            this.query.pagesize = newPagesize
            this.fetchToolPage() //获取分页和总条数的请求  
        }
    },
    created() {
        this.fetchToolPage() //获取分页和总条数的请求
    }
}