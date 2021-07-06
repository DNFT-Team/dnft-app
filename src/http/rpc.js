const axios = require('axios');
// 测试网服务
// const API_CHAIN_ID = 5;
// axios.defaults.baseURL = 'http://beta.public.nerve.network';
// 主网服务
const API_CHAIN_ID = 9;
// axios.defaults.baseURL = 'https://public.nerve.network';
axios.defaults.baseURL = '/nerve';
axios.defaults.timeout = 9000;
axios.defaults.headers.post['Content-Type'] = 'application/json';

/**
 * 封装post请求
 * Encapsulation post method
 * @param url
 * @param methodName
 * @param data
 * @returns {Promise}
 */
module.exports = {
    post(url, methodName, data = []) {
        return new Promise((resolve, reject) => {
            data.unshift(API_CHAIN_ID);
            const params = {"jsonrpc": "2.0", "method": methodName, "params": data, "id": Math.floor(Math.random() * 1000)};
            axios.post(url, params)
                .then(response => {
                    resolve(response.data)
                }, err => {
                    reject(err)
                })
        })
    },

    postComplete(url, methodName, data = []) {
        return new Promise((resolve, reject) => {
            const params = {"jsonrpc": "2.0", "method": methodName, "params": data, "id": Math.floor(Math.random() * 1000)};
            axios.post(url, params)
                .then(response => {
                    resolve(response.data)
                }, err => {
                    reject(err)
                })
        })
    }
};
