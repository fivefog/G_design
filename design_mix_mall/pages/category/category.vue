<template>
	<view class="content">
		<!-- 左侧导航 -->
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.id" class="f-item b-b" :class="{active: item.c_name === currentId}" @click="tabtap(item)">
				{{item.c_name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view v-for="item in slist" :key="item.id" class="s-list" :id="'main-'+item.id">
				<text class="s-item">{{item.c_name}}</text>
				
				<view class="t-list">
					<view @click="navToList(titem.g_id)"  v-if="titem.c_name === item.c_name"  v-for="titem in tlist" class="t-item"  :key="titem.id">
						<image :src="titem.g_imgurl"></image>
						<text class="g_name">{{titem.g_name}}</text>
					</view>
				</view>
			</view>
			<!-- <view class="t-list">
				<view @click="navToList(item.id, titem.id)" v-for="titem in tlist" class="t-item"  :key="titem.id">
					<image :src="titem.g_imgurl"></image>
					<text>{{titem.g_name}}</text>
				</view>
			</view> -->
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: '男装',
				flist: [],   //左侧导航栏
				slist: [], //右边分类标题
				tlist: [],  // 商品
			}
		},
		onLoad(){
			this.loadData();
		},
		methods: {
			async loadData(){
				// let list = await this.$api.json('cateList');
				
				// let list 
				 var _this = this;
				// 获取首页资料，并存到本地
				let opts={
					url:'/category', 
					method:'get',
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
					
						_this.flist = res.data.data[0];
						_this.slist = _this.flist;
						
					}else if(res.data.status==0){
						uni.showToast({
							icon:'none',
							title:res.data.msg,
							duration:2000,
							
						})
					}
				
				});
				//获取所有商品
				let optsgoods={
					url:'/goodsM', 
					method:'post',
				};
				let paramgoods={};
							
				_this.$http.httpTokenRequest(optsgoods, paramgoods).then(async res=>{
					if(res.statusCode==500){
						uni.showToast({
							icon:'none',
							title:'服务器错误！',
							duration:2000,
						})
					}else if(res.data.status==1){
					
						_this.tlist = res.data.data[0];
					}else if(res.data.status==0){
						uni.showToast({
							icon:'none',
							title:res.data.msg,
							duration:2000,
							
						})
					}
				
				});
				// list.forEach(item=>{
				// 	if(!item.pid){
				// 		this.flist.push(item);  //pid为父级id, 没有pid或者pid=0是一级分类
				// 	}else if(!item.picture){
				// 		this.slist.push(item); //没有图的是2级分类
				// 	}else{
				// 		this.tlist.push(item); //3级分类
				// 	}
				// }) 
			},
			//一级分类点击
			tabtap(item){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				this.currentId = item.c_name;
				let index = this.slist.findIndex(sitem=>sitem.c_name === item.c_name);
				this.tabScrollTop = this.slist[index].top;
			},
			//右侧栏滚动
			asideScroll(e){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item=>item.top <= scrollTop).reverse();
				if(tabs.length > 0){
					this.currentId = tabs[0].c_name;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let h = 0;
				this.slist.forEach(item=>{
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			navToList(g_id){
				
				uni.navigateTo({
					url: `/pages/product/product?id=${g_id}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}
	.t-list{
		
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
		.g_name{
			text-align: center;
			width: 140rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
		
		image{
			width: 140upx;
			height: 140upx;
		}
	}
</style>
