<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.real_name" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.phone" placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">地址</text>
			 
			 <text @click="openAddres" class="input">
			 	{{addressData.province}} {{addressData.city}} {{addressData.district}}
			 </text>
		
			<text class="yticon icon-shouhuodizhi"></text>
		</view>
		<view class="row b-b"> 
			<input class="input" type="text" v-model="addressData.detail" placeholder="详细地址: 如道路、小区、楼栋号、单元室等" placeholder-class="placeholder" />
		</view>
		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="Boolean(addressData.is_default)" color="#F47E0D" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
		<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor="#F47E0D"></simple-address>
	</view>
</template>

<script>
	import simpleAddress from '@/components/simple-address/simple-address.nvue';
	export default {
		components: {
			simpleAddress
		},
		data() {
			return {
				cityPickerValueDefault: [0, 0, 1],
				addressData:{
					is_default:0,
				}
			}
		},
		onLoad(option){
			let title = '新增收货地址';
			if(option.type==='edit'){
				title = '编辑收货地址'
				this.addressData = JSON.parse(option.data);
			}
			
			this.manageType = option.type;
			
			//动态设置当前页面的标题。
			uni.setNavigationBarTitle({ 
				title
			})
		},
	
		methods: {
			
			switchChange(e){
				this.addressData.is_default = e.detail.value*1; //true为开
				 uni.$emit('setDefault',{msg:this.addressData.is_default}); //把值传给收货地址页面 
			},
			// 选择地址联动
			openAddres() {
				this.cityPickerValueDefault = [0,0,1]
				this.$refs.simpleAddress.open();
			},
			// 地址联动的确定按钮
			onConfirm(e) {
				this.addressData.province = e.labelArr[0];
				this.addressData.city = e.labelArr[1];
				this.addressData.district = e.labelArr[2];
				// this.addressData.addressName = e.labelArr.join(' ')
				this.$forceUpdate();   
			},
		
			//提交
			confirm(){
				uni.showLoading({
					mask:true
				})
				const _this = this;
				let data = this.addressData;
				this.addressData = Object.assign(_this.addressData,{user_phone:_this.$store.state.userInfo.phone});
				if(!data.real_name){
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.phone)){
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if(!data.province){
					this.$api.msg('请选择所在位置');
					return;
				}
				if(!data.detail){
					this.$api.msg('请填写详细地址信息');
					return;
				}
				let opts={ //编辑|新增地址信息
					url:'/address/editUserAddress',
					method: 'POST',
					// token:true
				};
				let param={
					...this.addressData,
					
				};
				
				_this.$http.httpTokenRequest(opts, param).then(async res=>{
					uni.hideLoading();
					if(res.data.status){
						uni.showToast({
							title:res.data.msg
							
						})
						// this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
						setTimeout(()=>{
							uni.navigateBack()
						}, 800)
					}else{
						if(res.data.data){
							uni.showToast({
								title:res.data.data,
								icon:'none'
							})
						}
					}
				});
				
				
				//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
				// this.$api.prePage().refreshList(data, this.manageType);
				
			},
		}
	}
</script>

<style lang="scss">
	page,body,.content{
		height: 100%;
	}
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			height: 40rpx;
			color: $font-color-dark;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		position: absolute;
		bottom: 89rpx;
		left: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 0 auto;
		
		font-size: $font-lg;
		color: #fff;
		background-color:$base-color;
		border-radius: 44upx;
	}
</style>
