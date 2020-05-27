import store from '@/store'

var baseUrl = store.state.baseUrl;


//带Token请求
const httpTokenRequest = (opts, data) => {
	let token = "";
	uni.getStorage({
		key: 'token',
		success: function(ress) {
			token = ress.data
		}
	});
	if(opts.token){
		 data = Object.assign(data,{'header[access_token]':token})
	}
	
    let httpDefaultOpts = {
        url: baseUrl+opts.url,
        data: data,
        method: opts.method,
        header: opts.token? {
		// 'header[access_token]':token,	
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		"Accept": "application/json, text/javascript, */*; q=0.01"
    } : {
		"Content-Type": "application/json; charset=UTF-8",
    },
        dataType: 'json'
    }
    let promise = new Promise(function(resolve, reject) {
        uni.request(httpDefaultOpts).then(
            (res) => {
                resolve(res[1])
				 //console.log(res[1].data)
				// if(res[1].data.code==0){
				// 	uni.redirectTo({
				// 		url:'/pages/login/login'
				// 	})
				// }
            }
        ).catch(
            (response) => {
                reject(response)
				console.log('暂停访问',response);
            }
        )
    })
    return promise
};

export default {
	    baseUrl,
		httpTokenRequest					
}