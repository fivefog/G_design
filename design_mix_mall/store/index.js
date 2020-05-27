import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const ACCESSTOKEN = uni.getStorageSync('token') || '';

const store = new Vuex.Store({
	state: {
		//购物车 cart 还是立即购买 buy_now
		buy_type:'',  
		//用户token
		token: ACCESSTOKEN,
		//用户信息
		// userInfo: USER.member
		 //真实接口
		baseUrl:'http://localhost:2020/uni',
		hasLogin: false,
		userInfo: {},
	},
	mutations: {
		
		login(state, provider) {
			state.hasLogin = true;
			state.token = provider.access_token;
			// state.refreshToken=provider.refresh_token;
			// state.userInfo = provider.member;
			state.userInfo = provider.userInf;
		    uni.setStorageSync('userInfo', provider.userInf);
			uni.setStorageSync('token', provider.access_token);
			// uni.setStorageSync('refreshToken', provider.refresh_token);
			// uni.setStorageSync('userInfo', provider.member);
		},
		
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
		        key: 'userInfo'  
		    });
			uni.removeStorage({
			    key: 'token'  
			})
			// uni.clearStorageSync(); //清除缓存，会使记住密码失效
			
		},
		setBuy_type(state,payload){
			state.buy_type = payload;
		},
	
		setSelfIntro(state,payload){
			state.selfIntro = payload;
		},
		setUserName(state,name){
			state.userInfo.name = name;

			uni.setStorage({//修改昵称后重置缓存的用户信息
			    key: 'userInfo',
			    data: state.userInfo,
			}) 
		
		},
	},
	actions: {
	
	}
})

export default store
