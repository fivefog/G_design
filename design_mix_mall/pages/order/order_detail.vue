<template>
	<view>
		<!-- status：0:待付款; 1:待发货;2:待收货;3:待评价 -->
		<!-- banner -->
		<view class="banner" :style="itemDetail[0].status==1?'background-image:url(../../static/order/daifahuo.png);':itemDetail[0].status==2?'background-image:url(../../static/order/yifahuo.png);':itemDetail[0].status==3?'background-image:url(../../static/order/daipingjia.png)':''">		
		<!-- <view class="banner" :style="'background:url(../../static/order/'+itemDetail.status==1?'daifahuo.png':itemDetail.status==2?'yifahuo.png':'daipingjia.png'+');background-size: 100% 100%;'"> -->
			<text>{{itemDetail[0].status==1?'等待发货':itemDetail[0].status==2?'已发货':itemDetail[0].status==3?'待评价':''}}</text>
			<text>{{itemDetail[0].status==1?'请耐心等待，商品准备中':itemDetail[0].status==2?'请耐心等待，商品很快送到':itemDetail[0].status==3?'觉得商品不错，记得评价哦':''}}</text>
		</view>
		<!-- 地址 -->
		<view class="address-section">
			<view class="order-content">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen">
					<view class="top">
						<text>收货人：</text>
						<text class="name">{{addrDetail.real_name}}</text>
						<text class="mobile">{{addrDetail.real_phone}}</text>
					</view>
					<text class="address">收货地址：{{addrDetail.province + addrDetail.city + addrDetail.district + addrDetail.detail}} </text>
				</view>
			</view>

		</view>

		<view class="goods-section">
		
			<!-- 商品列表 -->
			<view class="goods_cell">
				<view class="g_title">
					商品信息
				</view>
				<view class="g-item" v-for="(cell,cellIndex) in itemDetail" :key='cellIndex'>
					<image :src="cell.g_imgurl" mode="aspectFill"></image>
					<view class="right">
						<text class="title clamp">{{cell.g_name}}</text>
						<view class="spec">
						       <text >{{cell.select_attr}}</text>
						      
						</view>
						<view class="price-box">
							<text>数量：X {{cell.num}}</text>
							<!-- <text class="price">价值 {{activeTab==2?'￥':''}}{{cartInfo.truePrice}}<text class="unit">{{activeTab==1?' 券':activeTab==0?' 金币':''}}</text></text>
							<text class="number">x 1</text> -->
						</view>
					</view>
				</view>
			</view>
			
		</view>
		
		
		
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品金额</text>
				<text class="cell-tip">￥{{itemDetail[0].total_price}}</text>
			</view>
		
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip yun" v-if="itemDetail.total_postage">{{activeTab==2?'￥':''}}{{itemDetail.total_postage}}</text>
				<text class="cell-tip yun" v-if="!itemDetail.total_postage">免运费</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">订单总价</text>
				<text class="cell-tip yun">￥{{itemDetail[0].total_price}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">备注</text>
				<text class="cell-tip ">{{itemDetail[0].g_note}}</text>
			</view>
		</view>
		
		<!-- 单号 -->
		<view class="yt-list">
			
		
			<view class="yt-list-cell ">
				<text class="cell-tit clamp">订单编号：{{itemDetail[0].order_id}}</text>
			</view>
			<view class="yt-list-cell ">
				<text class="cell-tit clamp">下单时间：{{itemDetail[0].add_time}}</text>
			</view>
			<!-- 发货的才有快递 -->
			<view class="yt-list-cell b-b" v-if="itemDetail[0].tacking_num"> 
				<text class="cell-tit clamp">快递单号：{{itemDetail[0].tacking_num}}（{{itemDetail[0].tacking_company}}快递）</text>
			</view>
			<view class="btn_list" v-if="itemDetail[0].status!=1">
				<!-- <button @click.stop="toPage()">{{itemDetail.status==1?'提醒发货':itemDetail.status==2?'确认收货':itemDetail.status==3?'待评价':''}}</button> -->
				<button @click.stop="toPage()">{{itemDetail[0].status==2?'确认收货':itemDetail[0].status==3?'待评价':''}}</button>
			</view>
		</view>
		

	</view>
</template>

<script>
	// import EvanRadio from '@/components/evan-radio/evan-radio.vue'
	// import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue"
	export default {
		components:{			
			// uniNumberBox,
			// EvanRadio
		},
		data() {
			return {
				itemDetail:{},
				cartInfo:{productInfo:{attrInfo:{suk:''}}},
				activeTab:0,  //0 金币，1 券，2 元
				couponValue1:'cou1',
				// couponValue2:'cou2',
				uniValue: 'uni1',
				attr:[], //属性规格
				shapeValue: 'shape1',
				maskState: 0, //优购券面板显示状态
				desc: '', //备注
				payType: 1, //1微信 2支付宝
				order_id:'', //订单编号
				addr_id:'', //收货编号
				addrDetail:'', //收货地址
			}
		},
		onShow() {
		
		},
		async onLoad(option){
			// console.log('请求参数：',option);  
			// if(option.activeTab){
			// 	this.activeTab = option.activeTab;
			// } 
			uni.showLoading({
				mask:true
			})
			var _this = this;
			let order_id = await option.order_id;
			_this.order_id = order_id;
			//	请求订单详情
			let orderList = [];
			let opts={
				url:'/order/MyOrderCell', 
				method: 'post',
				token:true
			};
			let param={
				order_id:order_id
			};
			
			_this.$http.httpTokenRequest(opts, param).then(async res=>{
				
				if(res.data.status){
					_this.itemDetail =await res.data.data;
					// _this.cartInfo =await _this.itemDetail.cartInfo[0];
					_this.addr_id = await _this.itemDetail[0].addr_id;
					_this.getAddress();
				}else{
					uni.showToast({
						title:res.data.msg,
						icon:'none'
					})
				}
			})
			// const item = JSON.parse(decodeURIComponent(option.item));
			
			// _this.itemDetail = item;
			// console.log(_this.itemDetail);
			
		},
		
		methods: {
			toPage(){  //  status：0:待付款; 1:待发货;2:待收货;3:待评价
				let _this = this;
				switch(_this.itemDetail[0].status){
					case 1: //待发货 提醒发货
						//等接口  
					break;
					case 2: //待收货  确认收货
						uni.showLoading({
							mask:true
						})
					  this.userTakeOrder();
					break;	
					case 3:
						uni.navigateTo({
							url:`/pages/order/comment?unique=${_this.cartInfo.unique}`
						}) 
					break;
				}
			},
			// 获取收货人信息
			getAddress(){
				let _this = this;
				let opts={
					url:'/address/getOrderAddress', 
					method: 'post',
					// token:true
				};
				let param={
					addr_id:_this.addr_id
				};
				
				_this.$http.httpTokenRequest(opts, param).then(async res=>{
					uni.hideLoading();
					if(res.data.status){
						_this.addrDetail =await res.data.data[0];
						console.log('_this.addrDetail:',_this.addrDetail)
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			userTakeOrder(){
			
				let _this = this;
				uni.showModal({
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
									order_id:_this.order_id,
								};
								
								_this.$http.httpTokenRequest(opts, param).then(async res=>{
									
									uni.hideLoading();
									if(res.data.status){
										uni.showToast({
											title:res.data.msg,
										})
										uni.navigateTo({
											url:'/pages/order/order?state=-1'
										})  
										
									}else{
										uni.showToast({
											title:res.data.data.message,
											icon:'none'
										})
									}
								});
							} else if (res.cancel) {
								uni.hideLoading();
							}
						}
				})
						
			},
			//显示优购券面板
			toggleMask(type){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(()=>{
					this.maskState = state;
				}, timer)
			},
			btn_sure(){
				
			},
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type){
				this.payType = type;
			},
			submit(){
				let activeTab = this.activeTab;
				uni.redirectTo({
					url: `/pages/money/pay?activeTab=${activeTab}`
				})
			},
			stopPrevent(){}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}
	.banner{
		height: 210rpx;
		padding: 56rpx 92rpx;
		color: #fff;
		background-size: 100% 100%;
		text{
			display: block;
			&:first-child{
				font-size:36rpx;
				font-family:Source Han Sans CN;
				line-height: 36rpx;
				margin-bottom: 30rpx;
			}
			&:last-child{
				font-size:28rpx;
				font-family:Source Han Sans CN;
				line-height: 36rpx;
			}
		}
	}
	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}
		.g_title{
			padding: 28rpx 30rpx;
			background-color: #fff;
			font-size:28rpx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(34,28,28,1);
			line-height:36rpx;
		}
		.g-item {
			display: flex;
			
			padding: 30rpx  30upx;
			
			background-color: #FAF7FA;
			image {
				flex-shrink: 0;
				display: block;
				width: 200upx;
				height: 200upx;
				border-radius: 4upx;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
				
			}

			.spec {
				margin-top: 32rpx;
				font-size: 26upx;
				color: $font-color-light;
				&>text{
					display: inline-block;
					margin-right: 20rpx;
					margin-bottom: 38rpx;
				}
			}

			.price-box {
				display: flex;
				align-items: center;
				padding-top: 10upx;
				font-size:24rpx;
				font-family:PingFang SC;
				color:rgba(173,180,186,1);
				line-height:44rpx;
				.price {
					margin-bottom: 4upx;
					.unit{
						font-size: 24rpx;
					}
				}
				.number{
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}
	.g_num{
		margin-top: 34rpx;
		padding:0 30rpx 34rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		&>text{
			font-size: 26rpx;
			line-height: 26rpx;
			color:rgba(34,28,28,1);
		}
	}
	.yt-list {
		margin-top: 16upx;
		background: #fff;
		.pay_ways{
			padding: 0 30rpx;
		}
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 30upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 40upx;
			width: 40upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 40upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}
		// .cell_icon_coins{
		// 	width: 40rpx;
		// 	height: 40rpx;
		// 	border-radius: 100%;
		// 	background: url(../../static/mine/wallet/coins.png) no-repeat;
		// 	background-size: 100% ;
		// 	margin-right: 12upx;
		// }

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $uni-color-primary;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}
			&.red{
				color: $base-color;
			}
		}
		.yun{
			color: #F81C1C!important;
		}
		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}
	.btn_list{
		padding: 20rpx 40rpx;
		background-color: #fff;
		text-align: right;
		button{
				
			display: inline-block;
			padding: 0 20rpx;
			border-radius: 24rpx;
			font-size:24rpx;
			font-family:PingFang SC;
			font-weight:400;
			line-height: 48rpx;
			color:rgba(255,255,255,1);
			background-color:#F47E0D;
		}
	}
	/* 支付列表 */
	.pay-list{
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;
		.pay-item{
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;	
			position: relative;
		}
		.icon-weixinzhifu{
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}
		.icon-alipay{
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}
		.icon-xuanzhong2{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}
		.tit{
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}
	
	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0,0,0,.1);
		.price-content{
			padding-left: 30upx;
		}
		.price-tip{
			color: $base-color;
			margin-left: 8upx;
		}
		.price{
			margin-left: 2rpx;
			font-size: 32upx;
			color: $base-color;
		}
		.submit{
			display:flex;
			align-items:center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: #F8C536;
		}
	}
	
	/* 优购券面板 */
	.mask{
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 9995;
		transition: .3s;
		
		.mask-content{
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y:scroll;
			position: relative;
			// .close{
			// 	position: absolute;
			// 	right: 30rpx;
			// 	top: 32rpx;
			// 	width: 30rpx;
			// 	height: 30rpx;
			// 	background: url(../../static/mine/close.png) no-repeat center;
			// 	background-size: 100%;
			// }
			.mask_tit{
				display: block;
				text-align: center;
				font-size:28rpx;
				font-family:PingFang SC;
				font-weight:400;
				color:rgba(34,28,28,1);
				line-height:28rpx;
				margin-top: 32rpx;
			}
			.coupon_radio{
				padding: 30rpx;
				& view:last-child{
					font-weight: 700;
				}
			}
			.btn{
				background-color: #F8C438;
				font-size: 36rpx;
				line-height: 98rpx;
				text-align: center;
				color: #fff;
			}
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.mask-content{
				transform: translateY(0);
			}
		}
	}

	/* 优购券列表 */
	.coupon-item{
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;
		.con{
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;
			&:after{
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}
		.left{
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}
		.time{
			font-size: 24upx;
			color: $font-color-light;
		}
		.right{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}
		.price{
			font-size: 44upx;
			color: $base-color;
			&:before{
				content: '￥';
				font-size: 34upx;
			}
		}
		.tips{
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}
		.circle{
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;
			&.r{
				left: auto;
				right: -6upx;
			}
		}
	}

</style>
