<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in cellData.g_imglist" :key="index">
					<view class="image-wrapper">
						<image
							:src="item" 
							class="loaded" 
							mode="aspectFill"
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="introduce-section">
			<text class="title">{{cellData.g_name}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{cellData.g_price}}</text>
				<!-- <text class="m-price">¥488</text> -->
			</view>
			<view class="bot-row">
				<text>销量: 108</text>
				<text>库存: {{cellData.g_stock}}{{cellData.g_unit}}</text>
				<!-- <text>浏览量: 768</text> -->
			</view>
		</view>
		
		<!--  分享 -->
		<!-- <view class="share-section" @click="share">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				 返
			</view>
			<text class="tit">该商品分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>
			
		</view> -->
		
		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
						{{sItem}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			
			
			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text>7天无理由退换货 ·</text>
					<text>假一赔十 ·</text>
				</view>
			</view>
		</view>
		
		<!-- 评价 -->
		<view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>(86)</text>
				<text class="tip">好评率 100%</text>
				<text class="yticon icon-you"></text>
			</view> 
			<view class="eva-box">
				<image class="portrait" src="http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg" mode="aspectFill"></image>
				<view class="right">
					<text class="name">Leo yo</text>
					<text class="con">商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢</text>
					<view class="bot">
						<text class="attr">购买类型：XL 红色</text>
						<text class="time">2019-04-01 19:21</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<rich-text :nodes="desc"></rich-text>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn cart">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
				<rf-badge v-if="hasLogin && cartNum && cartNum > 0" type="error" size="small" class="badge" :text="cartNum"></rf-badge>
			</navigator>
			<!-- <view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view> -->
			
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @tap="addCart('buy')">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @tap="addCart('cart')">加入购物车</button>
			</view>
		</view>
		
		
		<!-- 规格-模态层弹窗 -->
		<view 
			class="popup spec" 
			:class="specClass"
			@touchmove.stop.prevent="stopPrevent"
			@click="toggleSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="cellData.g_imgurl"></image>
					<view class="right">
						<text class="price">¥{{cellData.g_price}}</text>
						<text class="stock">库存：{{cellData.g_stock}}{{cellData.g_unit}}</text>
						<view class="selected">
							已选：
							 
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in cellData.g_attr" :key="index" class="attr-list">
					<!-- Object.keys获取键名，返回的是数组 -->
					<text>{{(Object.keys(item))[0]}}</text>
				
					<view class="item-list">
						<text 
							v-for="(childItem, childIndex) in (Object.values(item))[0].split(' ')" 
							:key="childIndex" class="tit"
							:class="{selected: index==selectIndex[index] && childIndex==selectChildIndex[index]}"
							@click="selectSpec(index,childIndex)"
						>
							{{childItem}}
						</text>
					</view>
				</view>
				<view class="select-count">
					<text>购买数量</text>
					<rf-number-box
						class="step"
						:min="1"
						:max="cellData.g_stock*1"
						:value="cartCount"
						@eventChange="numberChange"
					></rf-number-box>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>
		<!-- 分享 -->
		<share 
			ref="share" 
			:contentHeight="580"
			:shareList="shareList"
		></share>
	</view>
</template>

<script>
	 import {mapState} from 'vuex';
	 import rfBadge from '@/components/rf-badge/rf-badge.vue'
	import rfNumberBox from '@/components/rf-number-box';
	import share from '@/components/share';
	export default{
		components: {
			share,
			rfNumberBox,
			rfBadge
		},
		data() {
			return {
				specClass: 'none',
				specSelected:[],
				g_id:0,
				cellData:'', //商品详情
				selectIndex:[0,1,2],    //属性名下标
				selectChildIndex:[0,0,0],  ///属性值   下标对应属性名
				cartNum:null,
				cartCount:1,
				cartType: null,
				isPointExchange: false,
				favorite: true,
				shareList: [],
				
				desc: `
					<div style="width:100%">
						<img style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i4/479184430/O1CN01nCpuLc1iaz4bcSN17_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd2.alicdn.com/imgextra/i2/479184430/O1CN01gwbN931iaz4TzqzmG_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i3/479184430/O1CN018wVjQh1iaz4aupv1A_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd4.alicdn.com/imgextra/i4/479184430/O1CN01tWg4Us1iaz4auqelt_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd1.alicdn.com/imgextra/i1/479184430/O1CN01Tnm1rU1iaz4aVKcwP_!!479184430.jpg_400x400.jpg" />
					</div>
				`,
			
				
			};
		},
		
		watch:{
			selectChildIndex:function(){
				let _this = this;
				_this.specSelected = [];
				// 已选规格属性
				this.cellData.g_attr.forEach((item,i)=>{
					_this.specSelected.push((Object.values(item))[0].split(' ')[_this.selectChildIndex[i]]);
				})
			}
		},
		computed: {
			...mapState(['hasLogin','userInfo'])   
		},
		async onLoad(options){
			
			//接收传值,id里面放的是标题，因为测试数据并没写id 
			this.g_id = options.id;
			this.dataLoad();
			this.handleCartItemCreate(); //获取购物车数量 
			
			this.shareList = await this.$api.json('shareList');
		},
		methods:{
			
			dataLoad(){
				var _this = this;
				
				let opts={
					url:`/goodsM/${this.g_id}`, 
					method:'post',
				};
				let param={};
			
				_this.$http.httpTokenRequest(opts, param).then(async res=>{
					
					try {
						if(res.statusCode==500){
							uni.showToast({
								icon:'none',
								title:'服务器错误！',
								duration:2000,
							})
						}else if(res.data.status==1){
							// await _this.$store.commit('login',res.data.data);
							_this.cellData = res.data.data[0];
							
							_this.specSelected = [];
							//默认的 已选规格属性
							this.cellData.g_attr.forEach((item)=>{
								_this.specSelected.push((Object.values(item))[0].split(' ')[_this.selectChildIndex[0]]);
							})
						
							
						}else if(res.data.status==0){
							uni.showToast({
								icon:'none',
								title:res.data.msg,
								duration:2000,
								
							})
						}
					} catch (error) {
						uni.showToast({
							title:'出错了',
							icon:'none'
						})
					}
																					
					
					
				
				});
			},
			
			
			// 购物车红点初始化
			async initData(id) {
				
				this.cartNum = uni.getStorageSync('cartNum');
				// this.productDetail.id = id;
				// await this.getProductDetail(id);
			},
			addCart(type, isPointExchange){
				// if (!this.productDetail.id) return;
				
				if(!this.hasLogin){
					let url = '/pages/public/login';
					uni.navigateTo({
						url
					}) 
					 return;
				}
				this.specClass = 'show';
				this.cartType = type;
				this.isPointExchange = isPointExchange;
			},
			//规格弹窗开关
			toggleSpec(e) {  
				let _this = this;
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					// this.specSelected
					let param = [];  //传参
				
					let phone = this.$store.state.userInfo.phone;
				
					param.push(this.cellData.g_id,this.specSelected,this.cartCount,phone);
			
					if (this.cartType === 'cart') {
						this.orderInf(param,'cart');  //提交给后端
						setTimeout(()=>{
							this.handleCartItemCreate(); //获取购物车数量
						},1000)
					} else if (this.cartType === 'buy') {
						this.orderInf(param,'buy_now');  //提交给后端
						setTimeout(()=>{
							_this.buy(_this.cellData.g_id);
						},1000)
						
					}
					this.cartType = null;
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.specClass = 'show';
				}
			},
			//下单信息传给后端
			orderInf(paramArr,buy_type){
				uni.showLoading({
					mask:true
				})
				var _this = this;
				
				let opts={
					url:'/goodsBuy', 
					method:'post',
				};
				let param={
					data:paramArr,
					buy_type
				};
				
				_this.$http.httpTokenRequest(opts, param).then(async res=>{
					
					if(res.statusCode==500){
						uni.showToast({
							icon:'none',
							title:'服务器错误！',
							duration:2000,
						})
					}else if(res.data.status==1){
						
					}
				})
			},
			//购买
			async buy() {
				uni.hideLoading();
				this.$store.commit('setBuy_type','buy_now');
				uni.navigateTo({
						url: `/pages/order/createOrder`
				})
			
			},
			// 添加商品至购物车
			async handleCartItemCreate () {
				let _this = this;
				// 获取购物车信息，只要数量
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
						
						uni.setStorageSync('cartNum',res.data.data[0].length);
						_this.initData();
					}
				})
		
						
			
			},
			numberChange(data){
				this.cartCount = data.number;
				console.log('data:',data)
			},
			//选择规格
			selectSpec(index,childIndex){
				
				// let selectArr =  Object.values(this.cellData.g_attr[index])[0].split(' ');
			
				console.log('index,childIndex',index,childIndex)
				// 以下不会触发视图更新
				// this.selectIndex[index] = index;
				// this.selectChildIndex[index] = childIndex;
				
				//通过索引修改数组的值不会触发视图更新，应改用splice方法或者用Vue.set(arr,index,value)
				this.$set(this.selectIndex,index, index);
				this.$set(this.selectChildIndex,index, childIndex);
				// console.log('选中：',this.selectIndex[index],this.selectChildIndex[index]);
			
				

				
				
			},
			//分享
			share(){
				this.$refs.share.toggleMask();	
			},
			//收藏
			toFavorite(){
				this.favorite = !this.favorite;
			},
			// buy(){
			// 	uni.navigateTo({
			// 		url: `/pages/order/createOrder`
			// 	})
			// },
			stopPrevent(){}
		},

	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
	}
	.carousel {
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;
		.share-icon{
			display:flex;
			align-items:center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position:relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;
			&:after{
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position:absolute;
				background: $uni-color-primary;
			}
		}
		.icon-xingxing{
			position:relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}
		.tit{
			font-size: $font-base;
			margin-left:10upx;
		}
		.icon-bangzhu1{
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}
	
	.c-list{
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	
	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.tit{
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}
			.tip{
				flex: 1;
				text-align: right;
			}
			.icon-you{
				margin-left: 10upx;
			}
		}
	}
	.eva-box{
		display: flex;
		padding: 20upx 0;
		.portrait{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10upx 30upx;
		.select-count {
			padding: 30upx 0 10upx;
			margin: 20upx 0;
			border-top: 1px solid #ccc;
			display: flex;
			justify-content:space-between;
			overflow: hidden;
			position: relative;
			font-size: $font-base + 6upx;
			color: $font-color-base;
			line-height: 60upx;
			.step {
				position: absolute;
				left: 60vw;
				bottom: 10upx;
			}
		}
		.a-t{
			display: flex;
			image{
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 10upx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}
		.item-list{
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.selected{
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			.btn{
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
	}
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		.cart {
			position: relative;
			.badge {
				position: absolute;
				top: -8upx;
				right: 0upx;
			}
		}
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			.yticon{
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			.icon-shoucang{
				font-size: 46upx;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	
</style>
