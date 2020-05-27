<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
		</view>
		<!-- 横向切换 -->
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
				>
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					
					<!-- 订单列表 竖向-->
					<view 
						v-for="(item,index) in orderList" :key="index"
						class="order-item"
						@click="navToDetailPage(item)"
					>
						<view class="i-top b-b">
							<text class="order_num">订单编号: {{item[0].order_id}}</text>
							<text class="state" >{{item[0].status==1?'待发货':item[0].status==2?'待收货':item[0].status==3?'待评价':item[0].status==1?'已完成':''}}</text>
							<!-- state==9 为关闭订单 -->
							<!-- <text 
								v-if="item.state===9"  
								class="del-btn yticon icon-iconfontshanchu1"
								@click.stop="deleteOrder(item.id)"
							></text> -->
						</view>
						
						<!-- 快照  同一订单多个商品 -->
						<view
							class="goods-box-single"
							v-for="(goodsItem, goodsIndex) in item" :key="goodsIndex"
						>
							
							<image class="goods-img" :src="goodsItem.g_imgurl" mode="aspectFill"></image>
							<view class="right">
								 <text class="title multi_omit">{{goodsItem.g_name}}</text> 
							
								 <text class="attr-box" v-if="goodsItem.select_attr">{{goodsItem.select_attr}}  x {{goodsItem.num}}</text>
								<view class="zheng" >
									正版推荐
								</view>
								<view class="iconbox">
									<text class="iconText">包邮</text>
									<text class="iconText" >假一赔十</text>
								</view>
							</view>
							<!-- 快照的单价 -->
							<text class="price">{{'￥'+goodsItem.single_price}}</text>
						</view>
						
						<view class="order_time">
							{{item.add_time}}
						</view>
						<view class="price-box">
							共
							<text class="num">{{sumTotal(item)}}</text>
							件商品 合计：
							<text class="price">{{'￥'+item[0].total_price}}</text>
				
						</view>
						<view class="action-box b-t" v-if="item[0].status != 9">
							<!-- <view class=""></view> -->
							
							<!-- <button class="action-btn" v-if="item.status==0||item.status==3" @click.stop="deleteOrder(item.order_id)">删除订单</button> -->
							<!-- <button class="action-btn" v-if="item.status==0||item.status==3" @click.stop="cancelOrder(item)">删除订单</button> -->
							<button class="action-btn recom" v-if="item[0].status==0">去付款</button>
							<!-- <button class="action-btn " v-if="item.status==3||item.status==2">查看物流</button> -->
							<button class="action-btn recom" v-if="item[0].status==3" @click.stop="toPage(3,item.cartInfo[0].unique)">评价</button>
							<!-- <button class="action-btn recom" v-if="item[0].status==3">再次购买</button> -->
							<!-- <button class="action-btn " v-if="item.status==2||item.status==1">申请退款</button> -->
							<button class="action-btn recom" @click.stop="confirm_receipt(item[0].order_id)" v-if="item[0].status==2">确认收货</button>
							<!-- <button class="action-btn recom" v-if="item.status==1">提醒发货</button> -->
						</view>
					</view>
					 
					<!-- <uni-load-more :status="tabItem.loadingType"></uni-load-more> -->
					
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template> 

<script>
	// import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	export default {
		components: {
			// uniLoadMore,
			empty,
		},
		data() {
			return {
				tabCurrentIndex: 0,
				orderList:[],
				navList: [{
						state: -1,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					// {
					// 	state: 0,
					// 	text: '待付款',
					// 	loadingType: 'more',
					// 	orderList: []
					// },
					{
						state: 1,
						text: '待发货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '待收货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '待评价',
						loadingType: 'more',
						orderList: []
					}
				],
			};
		},
		async onLoad(options){
			this.tabCurrentIndex =await options.state*1;
			this.loadData();
		},
		computed:{
			handlePublishTimeDesc:function(e){
				let time = new Date(e);
				return time;
			}
		},
		methods: {
			sumTotal(item){
				let num = 0;
				item.forEach(element=>{
					num += element.num; 
				})
				
				return num;
			},
			loadData(){//获取订单列表
				uni.showLoading({mask:true})
				let _this = this;
				let opts={
					url:'/order/getMyOrderList', 
					method: 'post',
				
				};
				let param={
					status:this.tabCurrentIndex==0?-1:this.tabCurrentIndex==1?1:this.tabCurrentIndex==2?2:3, 
					phone:_this.$store.state.userInfo.phone
				};
				_this.$http.httpTokenRequest(opts, param).then(async res=>{
					uni.hideLoading();
					if(res.data.status){
						if(res.data.data.length>0){
							this.orderList =res.data.data;
							console.log('this.orderList:',this.orderList);
						}else{
							uni.showToast({
								title:'没有更多了',
								icon:'none'
							})
						}
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				});	
			},
			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				this.orderList=[];
				this.loadData();
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
			},
			toPage(e,unique){ //进行中ing
				let pageUrl = '';
				switch(e){
					case 3:
						pageUrl=`/pages/order/comment?unique=${unique}`;
						break;
					default:
						break;
				}
				uni.navigateTo({
					url:pageUrl
				})
			},
			// 订单详情
			navToDetailPage(item) {
				console.log('订单详情：',item)
				// this.btnState = btnState; //1-3
				// this.activeTab = activeTab; // 0-2
				// let id = item.id;
				let order_id =  item[0].order_id;
				uni.navigateTo({
					url:`/pages/order/order_detail?order_id=${order_id}`
					// url: `/pages/order/order_detail?item=${encodeURIComponent(JSON.stringify(item))}`
				})
			},
			//确认收货
			confirm_receipt(order_id){
				let _this = this;
				let orderList = []; //意义？
				uni.showModal({
					// title: '提示',
					    content: '是否确认收货？',
						confirmColor:'#DF8F31',
					    success: function (res) {
					        if (res.confirm) { //确认收货
								let opts={
									url:'/order/userTakeOrder', 
									method: 'post',
									token:true
								};
								let param={
									order_id:order_id,
								};
								
								_this.$http.httpTokenRequest(opts, param).then(async res=>{
									if(res.data.status){
										uni.showToast({
											title:res.data.msg
										})
										_this.loadData();
									}else{
										uni.showToast({
											title:res.data.msg,
											icon:'none'
										})
									}
								});
					        } else if (res.cancel) {
					            
					        }
					    }
				})
					
			},
			//删除订单
			deleteOrder(order_id){
				uni.showLoading({
					title: '请稍后'
				})
				console.log('order_id',order_id)
				setTimeout(()=>{
					let _this = this;
					let orderList = [];
					let opts={
						url:'/api/order/userRemoveOrder', 
						method: 'post',
						token:true
					};
					let param={
						order_id:order_id
					};
					_this.$http.httpTokenRequest(opts, param).then(async res=>{
						if(res.data.status){
							uni.showToast({
								title:res.data.data.message,
								success() {
									setTimeout(()=>{
										_this.loadData();
									},1500);
								}
								
							})
						}else{
							uni.showToast({
								title:res.data.data.message,
								icon:'none'
							})
						}
					})
					// this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
					uni.hideLoading();
				}, 600)
			},
			//取消订单
			cancelOrder(item){
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(()=>{
					let {stateTip, stateTipColor} = this.orderStateExp(9);
					item = Object.assign(item, {
						state: 9,
						stateTip, 
						stateTipColor
					})
				
					// //取消订单后删除待付款中该项
					// let list = this.navList[1].orderList;
					// console.log('取消前',list,item);
					
					// let index = list.findIndex(val=>val.id === item.id);
					// index !== -1 && list.splice(index, 1);
					// console.log('取消',list);
					uni.hideLoading();
				}, 600)
			},

			//订单状态文字和颜色
			// orderStateExp(state){
			// 	let stateTip = '',
			// 		stateTipColor = '#E98E2D';
			// 	switch(+state){ //-1为全部
			// 		// case 0:
			// 		// 	stateTip = '待付款'; break;
			// 		case 1:
			// 			stateTip = '待发货'; break;
			// 		case 2:
			// 			stateTip = '待收货'; break;
			// 		case 3:
			// 			stateTip = '已完成'; break;	
			// 		// case 9:
			// 		// 	stateTip = '订单已关闭'; 
			// 		// 	stateTipColor = '#909399';
			// 		// 	break;
						
			// 		//更多自定义
			// 	}
			// 	return {stateTip, stateTipColor};
			// }
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}
	//多行文本出现省略号
	.multi_omit{  //宽度元素自己定义
		
		overflow:hidden;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-line-clamp:2; //表示第2行出现省略号
		-webkit-box-orient:vertical;
	}
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.order_num{
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		/* 多条商品 */
		.goods-box{
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
			.goods-item{
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
			.goods-img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		/* 单条商品 */
		.goods-box-single{
			display: flex;
			padding: 20upx 0;
			.goods-img{
				display: block;
				width: 200upx;
				height: 200upx;
				margin-right: 20rpx;
			}
			.right{
				// flex: 1;
				width: 288rpx;
				display: flex;
				flex-direction: column;
				overflow: hidden;
				.title{
					font-size: $font-base ; //28rpx
					color: $font-color-dark;
					line-height: 44rpx;
					margin-bottom: 10rpx;
				}
				.attr-box{
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}
				.zheng{
					// padding: 0 24rpx;
					width: 128rpx;
					background:rgba(234,202,149,1);
					border-radius:4rpx;
					font-size:20rpx;
					line-height: 28rpx;
					text-align: center;
					font-family:PingFangSC-Regular,PingFang SC;
					color:rgba(40,40,40,1);
					margin-bottom: 50rpx;
				}
				.iconbox{
					display: flex;
					.iconText{
						display: inline-block;
						padding: 0 12rpx;
						font-size:20rpx;
						font-family:PingFangSC-Regular,PingFang SC;
						color:rgba(244,126,13,1);
						line-height:28rpx;
						background:rgba(254,241,234,1);
						margin-right: 10rpx;
					}
				}
			}
			.price{
				    flex: 1;
				    text-align: right;
				    padding-right: 30rpx;
				font-size: $font-base + 2upx;
				color: $base-color;
				// &:before{
				// 	content: '￥';
				// 	font-size: $font-sm;
				// 	margin: 0 2upx 0 8upx;
				// }
			}
		}
		.order_time{
			font-size:24rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			color:rgba(169,169,169,1);
			line-height:26rpx;
			text-align: right;
			padding-right: 30rpx;
		}
		.price-box{
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
				// &:before{
				// 	content: '￥';
				// 	font-size: $font-sm;
				// 	margin: 0 2upx 0 8upx;
				// }
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
			width: 160upx;
			// height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
	
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
</style>
