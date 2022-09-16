import instance from './interceptor'
import instancesec from "./interceptersec"
/**
 * 核心函数，可通过它处理一切请求数据，并做横向扩展
 * @param {url} 请求地址
 * @param {params} 请求参数
 * @param {options} 请求配置，针对当前本次请求；
 * @param loading 是否显示loading
 * @param mock 本次是否请求mock而非线上
 * @param error 本次是否显示错误
 */
function request(url, params, options = {
    formdata: false,
    loading: true,
    mock: false,
    error: true,
    // timeout: 20000
}, method) {
    //     let loadingInstance = '';
    //    // 请求前loading
    //     if (options.loading) loadingInstance = Loading.service({background:'transparent'});
    return new Promise((resolve, reject) => {
        let data = {}

        if (method == 'get') data = {
            params
        }

        if (method == 'post') data = {
            data: params
        }

        if (method == 'delete') data = {
            params
        }

        if (options.mock) url = 'http://www.mock.com/mock/xxxx/api';
        if (options.formdata == true) {
            instance({
                url,
                method,
                ...data
            }).then((res) => {
                if (res && res.RetCode === 0) {
                    resolve(res);
                } else {
                    // 通过配置可关闭错误提示
                    // if (res && options.error) Message.error(res.message_cn);
                    resolve(res);
                }
            }).catch((error) => {
                // console.log(error)
                // Message.error(error.message)
            }).finally(() => {
                // loadingInstance.close();
            })
        } else {
            instancesec({
                url,
                method,
                timeout: options.timeout,
                ...data
            }).then((res) => {
                if (res && res.RetCode === 0) {
                    resolve(res);
                } else {
                    resolve(res);
                    // 通过配置可关闭错误提示
                    // if (res && options.error) Message.error(res.message_cn);
                    // resolve(res);
                }
            }).catch((error) => {
                console.log(error)
                // Message.error(error.message)
            }).finally(() => {
                // loadingInstance.close();
            })
        }

    })
}
// 封装GET请求
function get(url, params, options) {
    return request(url, params, options, 'get')
}
// 封装POST请求
function post(url, params, options) {
    return request(url, params, options, 'post')
}
// 封装DELETE请求
function Delete(url, params, options) {
    return request(url, params, options, 'delete')
}
export default {
    get,
    post,
    Delete
}