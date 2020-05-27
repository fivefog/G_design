<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{total_price}}</text>
		</view>

		<view class="pay-type-list">

			<view class="type-item b-b" @click="changePayType(1)">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 1' />
					</radio>
				</label>
			</view>
			<view class="type-item b-b" @click="changePayType(2)">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 2' />
					</radio>
				</label>
			</view>
			
		</view>
		
		<text class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				total_price:0,
				payType: 1,
				orderParam:'',
				addressData:'',
				g_note:'',
				orderInfo: {}
			};
		},
		computed: {
		
		},
		onLoad(options) {
			this.total_price = options.total_price;
			this.orderParam = JSON.parse(decodeURIComponent(options.orderParam));
			this.addressData = JSON.parse(decodeURIComponent(options.addressData));
			this.g_note = JSON.parse(decodeURIComponent(options.g_note));
		},

		methods: {
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			//确认支付
			confirm: async function() {
				let _this=this;
				uni.showLoading({
					mask:true
				})
				console.log('删除',this.orderParam);
				// 增加订单记录
				this.addOrder();
				//修改商品库存
				this.editStock();  
				// 删除goodsBuy的记录
				this.orderParam.forEach(item=>{
					let opts={
						url:'/delete/goodsBuy', 
						method:'post',
					};
					let param={
						gb_id:item.gb_id
					};
					_this.$http.httpTokenRequest(opts, param).then(async res=>{
						uni.hideLoading();
						
						if(res.data.code==500){
							uni.showToast({
								icon:'none',
								title:'服务器错误！',
								duration:2000,
							})
						}else if(res.data.status==1){
							
							uni.redirectTo({
								url: '/pages/money/paySuccess'
							})
						}
					})
				})
				
			},
			//添加订单
			addOrder(){
				let date = new Date(); //年月日
				let time = Date.now(); //纪元时间，毫秒数
				let _this = this;
				let opts={
					url:'/order/setMyOrderList', 
					method:'post',
				};
				let param={
					orderParam:this.orderParam,
					addressData:this.addressData,
					total_price:this.total_price,
					add_time:date,   
					order_id: time ,//纪元时间，毫秒数
					g_note:this.g_note,
					
				};
				_this.$http.httpTokenRequest(opts, param).then(async res=>{
					uni.hideLoading();
					
					if(res.data.code==500){
						uni.showToast({
							icon:'none',
							title:'服务器错误！',
							duration:2000,
						})
					}else if(res.data.status==1){
						
					}
				})	
			},
			//修改商品库存
			editStock(){
				let _this = this;
				let opts={
					url:'/editStock', 
					method:'post',
				};
				let param={
					orderParam:this.orderParam,
				};
				_this.$http.httpTokenRequest(opts, param).then(async res=>{
					
					if(res.data.code==500){
						uni.showToast({
							icon:'none',
							title:'服务器错误！',
							duration:2000,
						})
					}else if(res.data.status==1){
						
					}
				})	
			}	
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price{
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
			&:before{
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;
		
		.type-item{
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position:relative;
		}
		
		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

</style>
