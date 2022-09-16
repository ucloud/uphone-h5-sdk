import axios from "axios"
import cookie from "./cookie";
import router from "../router";
const api = "https://api.ucloud.cn/"
// const api = "https://api-test03.ucloudadmin.com/" 
const service = axios.create({
    baseURL: api, // 定义统一的请求头部
    headers: {
        'Authorization': 'U-CSRF-Token', // 此处对应后台AOP验证,
        'Content-Type': 'application/json' //默认方式提交数据
        // 'Content-Type': 'multipart/form-data', //表单方式提交数据
        // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' //表单方式提交数据
    },
    timeout: 300000,
    // 如果用的JSONP，可以配置此参数带上cookie凭证，如果是代理和CORS不用设置
    withCredentials: true
})


service.interceptors.request.use(config => {
    let token = cookie.getCookie('U_CSRF_TOKEN')
    console.log(token)
    // 在header中自定义token参数名：tokenHeader，可添加项目token
    if (token) {
        config.headers['U-CSRF-Token'] = token
    }
    return config;
});

service.interceptors.response.use((response) => {
        const res = response.data;
        if (res.RetCode === 0) {
            return res;
        } else if (res.RetCode === 170) {
            //登录超时或未登录情况下 跳转错误页面
            router.push({
                path: "/error"
            }).catch((error) => {
            })
            return res;
        } else {
            // 错误显示可在service中控制，某些场景不要展示错误
            // Message.error(res.message);
            return res;
        }
    },
    (error) => {
        return error
        console.log(error)
        // Message.error('网络请求异常，请稍后重试!');
    }
);
export default service;