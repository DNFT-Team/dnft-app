import axios from './default';
import request from './request';
import response from './response';
import {Message} from 'element-react';
export default new (class Axios {
  constructor () {
    this.axios = axios.create(); // 创建实例
    this.axios.interceptors.request.use(
      // 添加请求拦截器
      request.config,
      request.error
    );
    this.axios.interceptors.response.use(
      // 添加响应拦截器
      response.res,
      response.error
    );

    this.Toast = Message;
    this._requestList = [];
  }

  get requestList () {
    return this._requestList;
  }

  set requestList (list) {
    this._requestList = list; // 设置请求队列
    if (this._requestList.length === 0) {
      // 如果请求队列为空了，就关闭loading
    } else {
      // 反知显示loading
    }
  }

  /**
   * 当请求队列发生变化的时候，触发此方法
   * @param {Object} id  �请求队列入队或出队的id
   * @param {Boolean} remove  true: 出队   false: 默认  进队
   */
  setRequestList ({id = '', remove = false} = {}) {
    const array = [...this._requestList];
    remove ? array.splice(array.indexOf(id), 1) : array.push(id);
    this.requestList = array;
  }
})();
