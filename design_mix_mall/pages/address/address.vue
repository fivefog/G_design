<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)" >
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.is_default" class="tag">默认</text>
					<text class="address" v-if="item.province">{{item.province}}{{item.city}}{{item.district}}{{item.detail}}</text>
					<text class="address" v-else></text>
				</view>
				<view class="u-box">
					<text class="name">{{item.real_name}}</text>
					<text class="mobile">{{item.phone}}</text>
				</view>
			</view>
			<view class="iconBox">
				<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)">编辑</text>
				<text class="yticon icon-iconfontshanchu1" @click.stop="delAddress(item)">删除</text>
				
			</view>
		</view>
	
		
		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				source: 0,
				addressList:[],
			
			}
		},
		onLoad(option){
			this.source = option.source;
			// this.loadData();
		},
		onShow() {
			this.loadData();
			uni.$on("setDefault",function(data){
		
			})
		},
		methods: {
			loadData(){
				let _this = this;
				let opts={ //获取地址信息
					url:'/address/getUserAddressList',
					method: 'POST',
					// token:true
				};
				let param={
					phone:this.$store.state.userInfo.phone
				};
				
				_this.$http.httpTokenRequest(opts, param).then(async res=>{
					if(res.data.status){
						_this.addressList = res.data.data;
						
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
					
				});
			},
			//选择地址
			checkAddress(item){
				if(this.source == 1){
					
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					console.log('this.$api.prePage().addressData',this.$api.prePage().addressData)
					this.$api.prePage().has_checkAddr = true;
					uni.navigateBack()
				}
			},
			addAddress(type, item){
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			// 删除地址
			delAddress(item){
				let _this = this;
				uni.showModal({
				    content: '确认要删除该地址吗？',
					confirmColor:'#DD524D',
				    success: function (res) {
				        if (res.confirm) {
				            let opts={ 
				            	url:'/api/address/removeUserAddress',
				            	method: 'POST',
				            	token:true
				            };
				            let param={
								id:item.id
							};
				            _this.$http.httpTokenRequest(opts, param).then(async res=>{
				            	if(res.data.status){
									uni.showToast({
										title:res.data.data.message,
										icon:'none'
									})
									_this.loadData();
								}
							})
				        } else if (res.cancel) {
				            
				        }
				    }
				});
			},
			//添加或修改成功之后回调
			refreshList(data, type){
				if(type=='edit'){ //编辑地址数据
					
				}else if(type=='add'){ //新增地址数据
					//这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
					this.addressList.unshift(data);	
				}
				// console.log("这是上一个页面：",data, type);
			}
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120upx;
	}
	.content{
		position: relative;
	}
	.list{
		/* display: flex;
		
		align-items: center; */
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
		.iconBox{
			display: flex;justify-content: flex-end;
			align-items: center;
		}
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.iconBox{
		font-size: 28rpx;
		color: $font-color-light;
		text:first-child{
			margin-right: 30rpx;
		}
		
	}
	.icon-bianji::before,.icon-iconfontshanchu1::before{
	/* 	display: flex;
		align-items: center; */
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-right: 18upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 87upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color:$base-color;
		border-radius: 44upx;
	}
</style>
