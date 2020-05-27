<template>
	<view class="regBg">
		<view class="right-top-sign"></view>
		<view class="left-bottom-sign"></view>	
		
		<view class="regBox" v-if="pageLoad">
			<form @submit="formSubmit">
			<view class="input-flex">
				<!-- <view class="input-flex-label">手机</view> -->
				<input class="input-flex-text" name="telephone" v-model="telephone" type="text" @blur="verifyPhone"   placeholder="请填手机号码">
			</view>	
			
			<view class="input-flex">
				<!-- <view class="input-flex-label">验证码</view> -->
				<input type="text" class="input-flex-text" name="yzm" v-model="yzm"    placeholder="请输入验证码">
				<view class="input-flex-btn" v-bind:class="yzmClass" @click="getYzm()">{{yzmStatus}}</view>
			</view>
			
			<view class="input-flex">
				<!-- <view class="input-flex-label">昵称</view> -->
				<input class="input-flex-text" v-model="nickname"  name="nickname" type="text" placeholder="请填写昵称">
			</view>
			
			<view class="input-flex">
				<!-- <view class="input-flex-label">密码</view> -->
				<input class="input-flex-text" v-model="password" name="password" type="text" password=true  placeholder="请填写密码">
			</view>
			
			 
			
			<button type="primary" form-type="submit" class="btn-row-submit btn-success">立即注册</button>
		   
			</form>
		</view>
	</view>
</template>

<script>
	 
	var yzmTimer=60,yzmTime=59,yzmEnable=true;
	export default{
		data:function(){
			return {
				pageLoad:false, 
				pageData:{},
				yzm:"",  //用户填写的
				real_yzm:'', //后端传过来的  传给后端，后端验证 real_yzm和yzm是否一致
				telephone:"",
				yzmClass:"",
				nickname:'',
				password:'',
				yzmStatus:"获取验证码",
			 
			};
		},
		onLoad:function(option){
			this.pageLoad=true;
		},
		 
		methods:{
			downTimer:function(){
				var that=this;
				var it=setInterval(function(){
					yzmEnable=false;
					that.yzmStatus="倒计时"+yzmTime+"秒";
					that.yzmClass="yzmDisable";
					yzmTime--;
					if(yzmTime==0){
						yzmTime=59;
						yzmEnable=true;
						that.yzmClass="";
						that.yzmStatus="获取验证码";
						clearInterval(it);
					}
				},1000);
			},
			getYzm:function(){
					if(!yzmEnable) return false;
					//后端返回随机验证码 充当短信验证码
					let _this = this;
					
					let opts={
						url:'/registerGetYZM', 
						method: 'post',
						token:true
					};
					let param={
						phone:this.telephone,
					};
					
					_this.$http.httpTokenRequest(opts, param).then(async res=>{
						
						if(res.data.status){
							_this.downTimer();
							_this.real_yzm = res.data.data;
							uni.showToast({
								title:'验证码：'+res.data.data,
								icon:'none',
								duration: 4000
							})
							
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
						}
					})
					
					// var that=this;
					// uni.request({
					// 	url:that.app.apiHost+"?m=register&a=SendSms&ajax=1",
					// 	data:{
					// 		telephone:this.telephone,
					// 		fromapp:that.app.fromapp()
					// 	},
					// 	success:function(res){
					// 		console.log("验证：",res);
					// 		uni.showToast({
					// 			title:res.data.message,
					// 		})
					// 		if(res.data.error==1){  
					// 			return;
					// 		}else{ //获取验证码
					// 			console.log("获取",res,res.data.message);
					// 			that.downTimer();
					// 		}
							
					// 	}
					// })
			},
			verifyPhone(e){
				let _this = this;
				if(!this.telephone.trim()){
					uni.showToast({
						title:'手机号不能为空',
						icon:'none'
					})
				}else{
					let regPhone = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
					let phRes = this.telephone.search(regPhone); // -1即不符合手机格式，> -1 为下标
					if(phRes==-1){
						uni.showToast({
							title:'请正确填写手机格式',
							icon:'none'
						})
					}
				}	
			},		 
			formSubmit:function(e){  //注册按钮
			
				let _this = this;
				
				let opts={
					url:'/register', 
					method: 'post',
					// token:true
				};
				let param={
					phone:this.telephone,
					real_yzm:_this.real_yzm,
					yzm:_this.yzm,
					nickname:_this.nickname,
					password:_this.password
				};
				_this.$http.httpTokenRequest(opts, param).then(async res=>{
					if(res.data.status){  //注册成功
						uni.showToast({
							title:res.data.msg,
							
						})
					}else{  //验证码错误或出错
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
				// var that=this;
				// e.detail.value.password2=e.detail.value.password;
				// uni.request({
				// 	url:that.app.apiHost+"?m=register&a=regsave&ajax=1",
				// 	method:"POST",
				// 	header:{
				// 		"content-type":"application/x-www-form-urlencoded"
				// 	},
				// 	data:e.detail.value,
				// 	success:function(res){
				// 		var data=res.data;
				// 		if(res.data.error){
				// 			uni.showToast({
				// 				"title":res.data.message
				// 			})
				// 		}else{
				// 			that.app.setAuthCode(data.data.authcode);
				// 			that.app.goHome();
				// 		}
						
				// 	}
				// })
				
			}
		},
	}
</script>

<style scoped lang="scss">
	
	input{
		
		
	}
	.input-flex{
		position: relative;
		display: flex;
		align-items: center;
		padding: 20rpx;
		background: #f5f5f5;
		margin-bottom: 28rpx;
		.input-flex-label{
			font-size: 32rpx!important;
			line-height: 60rpx;
			padding: 0 10rpx;
			margin-right: 30rpx;
		}
			
		.input-flex-btn{ //获取验证码
			right: 20rpx;
			position: absolute;
			font-size: 28rpx;
			color: #b71c22;
			background: #fff;
			border: 2rpx solid #b2b2b2;
			padding: 10rpx;
			border-radius: 8rpx;
			text-align: center;
		}
	}
	
	.btn-row-submit{
		margin-top: 50rpx;
	}
	.right-top-sign{
		position:absolute;
		top: -60upx;
		right: 10upx;
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
	.yzmDisable{
		background-color: #eee;
		color: #999;
	}
	.regBox{
		position: absolute;
		top: 50%;
		left: 30upx;
		right: 30upx;
		margin-top: -390upx;
		padding:30upx 20upx;
		
		border-radius: 20upx;
	}
	.regBg{
		 // background: linear-gradient( #eaeaea,#d68e6a);
		 background-color: #fff;
		position: absolute;
		top: 0upx;
		bottom: 0upx;
		left: 0upx;
		right: 0upx;
		.left-bottom-sign{
			position:absolute;
			left: -270upx;
			bottom: -320upx;
			border: 100upx solid #d0d1fd;
			border-radius: 50%;
			padding: 180upx;
		}
	}
	button{
		background-color: #fa436a;
	}
</style>

