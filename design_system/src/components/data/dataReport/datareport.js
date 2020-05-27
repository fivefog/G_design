//  引入 ECharts 文件
import echarts from 'echarts'
export default {
    data() {
        return {
            myChart: '',
            myChart1: '',
            option: '',
            option1: '',
            nowTime: new Date(), //当前时间
            date: [], //存放日期
            adminTotal: [], //存放管理员的总数数据
            salesmanTotal: [], //存放售货员的总数数据
            vipTotal: [], //存放会员的总数数据
            supplierTotal: [], //存放供应商的总数数据 
            e_totolprice: [], //存放进货总金额的数据 
            o_totolprice: [], //存放出货总金额的数据 
            r_totolprice: [], //存放退货总金额的数据 
            s_totolprice: [], //存放销售总金额的数据 
            total: [] //存放所有的总数
        }
    },
    methods: {
        //获取倒退6天到当前时间的日期
        fetchTime() {
            for (let i = 0; i < 7; i++) {
                //减时间
                let datetime = this.$moment(this.nowTime).subtract(i, 'days').format('YYYY-MM-DD')
                    // console.log(datetime)
                this.date.push(datetime)
            }
            // 顺序颠倒
            this.date.reverse()

            // console.log(this.data)
        },
    },
    created() {
        //获取倒退6天到当前时间的日期
        this.fetchTime()
    },
    async mounted() {
        //获取倒退6天到当前时间的总数
        for (let key of this.date) {
            let datetime = key

            // console.log(datetime)
            try {
                let { data: { data } } = await this.$http.get(`/datareport/${datetime}`)
                    // console.log('data', data)

                this.adminTotal.push(data.adminTotal) //管理员的总数
                this.salesmanTotal.push(data.salesmanTotal) //售货员的总数
                this.vipTotal.push(data.vipTotal) //会员的总数
                this.supplierTotal.push(data.supplierTotal) //供应商的总数 
                this.e_totolprice.push(data.e_totolprice) //进货总金额
                this.o_totolprice.push(data.o_totolprice) //出货总金额
                this.r_totolprice.push(data.r_totolprice) //退货总金额
                this.s_totolprice.push(data.s_totolprice) //销售总金额
            } catch (error) {
                this.$message.error('服务器连接失败')
            }
        }
        // console.log(this.adminTotal)

        //所有的总数
        try {
            let { data: { data } } = await this.$http.get('/datareport/total')
                // console.log('data', data)
            this.total = data
        } catch (error) {
            this.$message.error('服务器连接失败')
        }

        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(document.getElementById('main'));
        this.myChart1 = echarts.init(document.getElementById('main1'));

        // 指定图表的配置项和数据
        this.option = {
            title: {
                text: '近七天新增数据'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: ['新增管理员', '新增售货员', '新增会员', '新增供应商', '进货总金额', '出货总金额', '退货总金额', '销售总金额']
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: this.date
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                    name: '新增管理员',
                    type: 'line',
                    stack: '总数',
                    areaStyle: {},
                    data: this.adminTotal
                },
                {
                    name: '新增售货员',
                    type: 'line',
                    stack: '总数',
                    areaStyle: {},
                    data: this.salesmanTotal
                },
                {
                    name: '新增会员',
                    type: 'line',
                    stack: '总数',
                    areaStyle: {},
                    data: this.vipTotal
                },
                {
                    name: '新增供应商',
                    type: 'line',
                    stack: '总数',
                    areaStyle: {},
                    data: this.supplierTotal
                },
                {
                    name: '进货总金额',
                    type: 'line',
                    stack: '总金额',
                    areaStyle: {},
                    data: this.e_totolprice
                },
                {
                    name: '出货总金额',
                    type: 'line',
                    stack: '总金额',
                    areaStyle: {},
                    data: this.o_totolprice
                },
                {
                    name: '退货总金额',
                    type: 'line',
                    stack: '总金额',
                    areaStyle: {},
                    data: this.r_totolprice
                },
                {
                    name: '销售总金额',
                    type: 'line',
                    stack: '总金额',
                    areaStyle: {},
                    data: this.s_totolprice
                }
            ]
        }

        this.option1 = {
            title: {
                text: '总数据'
            },
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: ['管理员总数', '售货员总数', '会员总数', '供应商总数 ', '进货总金额', '出货总金额', '退货总金额', '销售总金额'],
                axisTick: {
                    alignWithLabel: true
                }
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                type: 'bar',
                barWidth: '60%',
                data: this.total
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        this.myChart.setOption(this.option);
        this.myChart1.setOption(this.option1);
    },
}