import Axios from './axios.config';

/**
 * 请求方法
 *
 * @param {String}    url      接口地址
 * @param {String}    methods  请求方法
 * @param {Object}    headers  headers 设置
 * @param {Object}    data     参数
 * @param {Boolean}   silent   静默模式
 * @param {Function}  success  请求成功回调
 * @param {Function}  fail  请求失败回调
 * @param {Function}  complete   请求结束回调
 *
 */

export default async function request ({
  url = '',
  method = 'get',
  data = {},
  params = {},
  headers = {},
  success = () => {},
  fail = () => {},
  complete = () => {},
  silent = false,
} = {}) {
  // console.log(`${url}============>`, methods, data, silent)
  const id = `${url}TIME${new Date().getTime()}`; // 生成id
  if (!silent) {
  // 非静默模式，压入请求队列
    Axios.setRequestList({id});
  }
  try {
    const result = await Axios.axios({
      url,
      method,
      headers,
      data,
      params,
    });
    console.log({id, url, result})

    Axios.setRequestList({el: id, remove: true}); // 请求完成后，出队
    success(result);
    console.log(result, 'result')
  } catch (error) {
    Axios.setRequestList({el: id, remove: true}); // 请求完成后，出队
    if (!silent) {Axios.Toast.error(error.msg || error.message || error);}
    fail(error);
  } finally {
    complete();
  }
}
