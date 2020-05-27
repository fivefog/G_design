<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasLogin || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in dataArr" :key="item.gb_id">
					<view
						class="cart-item" 
						:class="{'b-b': index!==dataArr.length-1}"
					>
						<view class="image-wrapper">
							<image :src="item.g_imgurl" 
								:class="[item.loaded]"
								mode="aspectFill" 
								lazy-load 
								@load="onImageLoad('cartList', index)" 
								@error="onImageError('cartList', index)"
							></image>
						<!-- 	<image :src="item.g_imgurl" 
								
								mode="aspectFill" 
								lazy-load 
								
							></image> -->
							
							<view 
								class="yticon icon-xuanzhong2 checkbox"
								:class="{checked: item.checked}"
								@click="check('item', index)"
							></view>
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.g_name}}</text>
							<text class="attr">{{item.select_attr}}</text>
							<text class="price">¥{{item.single_price}}</text>
							<uni-number-box 
								class="step"
								:min="1" 
								:max="item.g_stock*1"
								:value="item.num>item.g_stock*1?item.g_stock*1:item.num"
								:isMax="item.num>=item.g_stock*1?true:false"
								:isMin="item.num===1"
								:index="index"
								@eventChange="numberChange"
							></uni-number-box>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image 
						:src="allChecked?'/static/selected.png':'/static/select.png'" 
						mode="aspectFit"
						@click="check('all')"
					></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<text style="font-size: 28rpx;padding-left: 8rpx;">全选</text>
				<view class="total-box">
					<text class="price">¥{{total}}</text>
					
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				total_price:0, // 总价
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				cellData:{}, //部分数据
				dataArr:[]  ,  //完整数据
			};
		},
		// onLoad(){  //tabbar页面具有缓存
		// 	this.dataLoad();
		// },
		onShow() {
			this.total_price = 0;
			this.total = 0;
			this.cartList = [],
			this.cellData = '', //部分数据
			this.dataArr = [];
			this.dataLoad();
			// this.calcTotal();  //计算总价
		},
		
		watch:{
			//显示空白页
			dataArr(e){
				let empty = e.length === 0 ? true: false;
				if(this.empty !== empty){
					this.empty = empty;
				}
			}
		},
		computed:{
			...mapState(['hasLogin'])
		},
		methods: {
			//请求数据
			dataLoad(){
				uni.showLoading({
					mask:true
				})
				let _this = this;
				
				
				// 获取立即购买的商品信息
				let opts={
					url:'/createOrder', 
					method:'post',
				};
				let param={
					phone:this.$store.state.userInfo.phone,
					buy_type:'cart'
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
						_this.cartList = res.data.data[0];
						
						_this.cartList.forEach(cell=>{
							_this.dataToId(cell,cell.g_id);
				
						});
					}
				})
			},
			async dataToId(cell,g_id){
				let _this = this;
				let opts={
					url:`/goodsM/${g_id}`, 
					method:'post',
				};
				let param={};
							
				_this.$http.httpTokenRequest(opts, param).then(async res=>{
					
					if(res.statusCode==500){
						uni.showToast({
							icon:'none',
							title:'服务器错误！',
							duration:2000,
						})
					}else if(res.data.status==1){
						
						// await _this.$store.commit('login',res.data.data);
						 _this.cellData = await res.data.data[0];
						 this.$set(_this.cellData,'checked',false);
						 // this.$forceUpdate();
						 _this.total_price += cell.single_total;
						
						 _this.dataArr.push(Object.assign(cell,_this.cellData));
						 // _this.dataArr.forEach(element=>{
							 
						 // })
					
						return _this.cellData;
					}
				})
			},
			
			// async loadData(){
			// 	let list = await this.$api.json('cartList'); 
			// 	let cartList = list.map(item=>{
			// 		item.checked = true;
			// 		return item;
			// 	});
			// 	this.cartList = cartList;
			// },
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			 //选中状态处理
			check(type, index){
				if(type === 'item'){
					
					
					this.dataArr[index].checked = !this.dataArr[index].checked;
					this.$forceUpdate();  //解决视图不更新问题
				}else{
					const checked = !this.allChecked
					const list = this.dataArr;
					list.forEach(item=>{
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			//数量
			numberChange(data){
				// data.number是数量
				
				this.dataArr[data.index].num = data.number;
				this.calcTotal();
			},
			//删除单个
			deleteCartItem(index){
				uni.showLoading({
					mask:true
				})
				let list = this.dataArr;
				let row = list[index];
			
				let _this = this;
				// 删除单个
				let opts={
					url:'/delete/goodsBuy', 
					method:'post',
				};
				let param={
					gb_id:row.gb_id
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
						uni.showToast({
							title:'删除成功！',
							icon:'none'
						});
						this.dataArr.splice(index, 1);
						this.calcTotal();
					}
				})
				
			},
			//清空
			clearCart(){
				uni.showModal({
					content: '清空购物车？',
					success: (e)=>{
						if(e.confirm){
							uni.showLoading({
								mask:true
							})
							let _this = this;
							// 清空购物车
							let opts={
								url:'/delete/cart', 
								method:'post',
							};
							let param={
								phone:this.$store.state.userInfo.phone,
								buy_type:'cart'
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
									this.dataArr = [];
								}
							})
							
						}
					}
				})
			},
			//计算总价
			calcTotal(){
				let list = this.dataArr;
				if(list.length === 0){
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item=>{
					console.log('选中了',item);
					if(item.checked === true){
						total += item.g_price * item.num;
						
					}else if(checked === true){
						checked = false;
					}
				})
				console.log('计算总价',this.total)
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			//创建订单
			createOrder(){
				let list = this.dataArr;
				let goodsData = [];
				list.forEach(item=>{
					
					if(item.checked){
						goodsData.push(item);
					}
				})
				this.$store.commit('setBuy_type','cart');
				uni.navigateTo({
					url: `/pages/order/createOrder?data=${encodeURIComponent(JSON.stringify(goodsData))}`
				})
				
			}
		}
	}
</script>

<style lang='scss'>
	.container{
		padding-bottom: 134upx;
		/* 空白页 */
		.empty{
			position:fixed;
			left: 0;
			top:0;
			width: 100%;
			height: 100vh;
			padding-bottom:100upx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background: #fff;
			image{
				width: 240upx;
				height: 160upx;
				margin-bottom:30upx;
			}
			.empty-tips{
				display:flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;
				.navigator{
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}
	/* 购物车列表项 */
	.cart-item{
		display:flex;
		position:relative;
		padding:30upx 40upx;
		.image-wrapper{
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8upx;
			}
		}
		.checkbox{
			position:absolute;
			left:-16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background:#fff;
			border-radius: 50px;
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30upx;
			.title,.price{
				font-size:$font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				height: 50upx;
				line-height:50upx;
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx; 
			height: 50upx;
			color: $font-color-light;
		}
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100upx;
		/* #endif */
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		.checkbox{
			height:52upx;
			position:relative;
			image{
				width: 52upx;
				height: 100%;
				position:relative;
				z-index: 5;
			}
		}
		.clear-btn{
			position:absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius:0 50px 50px 0;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 120upx;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			flex-direction: column;
			text-align:right;
			padding-right: 40upx;
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
			}
			.coupon{
				font-size: $font-sm;
				color: $font-color-light;
				text{
					color: $font-color-dark;
				}
			}
		}
		.confirm-btn{
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: $uni-color-primary;
	}
	.checked{
		color: $uni-color-primary;
	}
</style>
