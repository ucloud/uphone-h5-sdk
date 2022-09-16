export default {
    // 通过jsonp获得你想要的数据。
    jsonp(url, params = {}, { jsonp = "cb" }) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            // 将对象转为urlencoded格式 {a:1,b:2}===> a=1&b=2
            function _random(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
            const fnName = _random(100000, 999999);
            params[jsonp] = "F" + Date.now() + fnName;
            // 接收值
            window[params[jsonp]] = function (data) {
                resolve(data);
            }

            const urlencoded = Object.keys(params).map(v => v + "=" + params[v]).join("&");
            url = url + (url.includes("?") ? "&" : "?") + urlencoded;
            script.src = url;
            console.log(url);
            document.body.appendChild(script);
            // 当地址加载完毕之后执行。异步
            script.onload = function () {
                document.body.removeChild(script);
                delete window[fnName];
            }
            // 当你请求失败的时候会触发该函数
            script.onerror = function () {
                reject("网址异常");
            }
        })
    },
    post(url, data) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("post", url);
            xhr.setRequestHeader("content-type","application/json");
            xhr.send(JSON.stringify(data));
            //xhr.timeout = 8000;
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject("网络异常:" + xhr.statusText);
                    }
                }
            }
        })
    },
    delete(url, { params }) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            url = url + (url.includes("?") ? "&" : "?") + Object.keys(params).map(v => v + "=" + params[v]).join("&")
            xhr.open("delete", url);
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject("网络异常:" + xhr.statusText);
                    }
                }
            }
        })
    },
    put(url, { params }) {
        // obj ---> urlencoded
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            url = url + (url.includes("?") ? "&" : "?") + Object.keys(params).map(v => v + "=" + params[v]).join("&")
            xhr.open("put", url);
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject("网络异常:" + xhr.statusText);
                    }
                }
            }
        })
    },
    get(url, { params }) {
        // obj ---> urlencoded
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            url = url + (url.includes("?") ? "&" : "?") + Object.keys(params).map(v => v + "=" + params[v]).join("&")
            xhr.open("get", url);
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject("网络异常:" + xhr.statusText);
                    }
                }
            }
        })
    }
    // get post delete,put

}