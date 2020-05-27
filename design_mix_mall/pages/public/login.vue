<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				欢迎回来！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input 
						type="number" 
						:value="phone" 
						placeholder="请输入手机号码"
						maxlength="11"
						data-key="phone"
						@input="inputChange"
					/>
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input 
						type="phone" 
						value="" 
						placeholder="请输入密码"
						placeholder-class="input-empty"
						maxlength="20"
						password 
						data-key="password"
						@input="inputChange"
						@confirm="toLogin"
					/>
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
			<view class="forget-section">
				忘记密码?
			</view>
		</view>
		<view class="register-section">
			还没有账号?
			<text @click="toRegist">马上注册</text>
		</view>
	</view>
</template>

<script>
	import {  
        mapMutations  
    } from 'vuex';
	
	export default{
		data(){
			return {
				phone: '',
				password: '',
				logining: false
			}
		},
		onLoad(){
			
		},
		methods: {
			...mapMutations(['login']),
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
			toRegist(){
				uni.navigateTo({
				    url: 'register'
				});
				// this.$api.msg('去注册');
			},
			async toLogin(){  //登录
			
				var _this = this;
				if(!this.phone.trim()){
					uni.showToast({
						title:'手机号不能为空',
						icon:'none'
					})
				}else if(!this.password.trim()){
					uni.showToast({
						title:'密码不能为空',
						icon:'none'
					})
				}else{
					let regPhone = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
					let phRes = this.phone.search(regPhone); // -1即不符合手机格式，> -1 为下标
					if(phRes==-1){
						uni.showToast({
							title:'请正确填写手机格式',
							icon:'none'
						})
					}else{
						uni.showLoading({
							mask:true
						});
						// 登录，发送后端
						let opts={
							url: '/userInf', //登录接口
							method: 'post'
						};
						let param={
							phone: _this.phone,
							password:_this.password
						};
						_this.$http.httpTokenRequest(opts, param).then(res=>{
							uni.hideLoading();
							if(res.data.status){  //1是登录成功
								uni.showToast({
									title:res.data.msg,
									success() {
										_this.$store.commit('login',{userInf:res.data.data[0],access_token:res.data.data[1]});
										// uni.setStorageSync('token',res.data.data[1]);
										uni.setStorageSync('isFromLogin','yes');  
										setTimeout(()=>{
											uni.switchTab({
												url:'/pages/index/index',
												success() {
													//记住密码
													if(_this.checked){ 
														uni.setStorageSync('password_key',_this.password);
														uni.setStorageSync('phone_key',_this.phone);
													
													}else{
													
														uni.removeStorageSync('password_key');
														uni.removeStorageSync('phone_key');
													}
												}
											})
										},1500)
									}
								})
								
								
							}else{  //登录失败
								uni.showToast({
									title:res.data.msg,
									icon:'none'
								})
							}
							
						})
					}
				}
			},
			
			// async toLogin(){
			// 	this.logining = true;
			// 	const {phone, password} = this;
			// 	/* 数据验证模块
			// 	if(!this.$api.match({
			// 		phone,
			// 		password
			// 	})){
			// 		this.logining = false;
			// 		return;
			// 	}
			// 	*/
			// 	const sendData = {
			// 		phone,
			// 		password
			// 	};
			// 	const result = await this.$api.json('userInfo');
			// 	if(result.status === 1){
			// 		this.login(result.data);
   //                  uni.navigateBack();  
			// 	}else{
			// 		this.$api.msg(result.msg);
			// 		this.logining = false;
			// 	}
			// }
		},

	}
</script>

<style lang='scss'>
	page{
		background: #fff;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 120upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	.right-top-sign{
		position:absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after{
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}	
	}

	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>

