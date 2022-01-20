import axios from './default'
import request from './request'
import response from './response'
import { Message } from 'element-react'
export default new (class Axios {
	constructor() {
		this.axios = axios.create()
		this.axios.interceptors.request.use(request.config, request.error)
		this.axios.interceptors.response.use(response.res, response.error)

		this.Toast = Message
		this._requestList = []
	}

	get requestList() {
		return this._requestList
	}

	set requestList(list) {
		this._requestList = list
		if (this._requestList.length === 0) {
			// do something
		} else {
			// do something
		}
	}

	setRequestList({ id = '', remove = false } = {}) {
		const array = [...this._requestList]
		remove ? array.splice(array.indexOf(id), 1) : array.push(id)
		this.requestList = array
	}
})()
