const BASE_URL = process.env.REACT_APP_CORE_ENDPOINT
const STACK_URL = process.env.REACT_APP_TRACK_ENDPOINT

const FETCH_TIMEOUT = 15 * 1000
let _token = ''

export function setTokenForReq(token) {
	_token = token
}

export default function request(url, options) {
	// if (BASE_URL.length == 0) {return;}
	const defaultOptions = { headers: {} }
	const newOptions = { ...defaultOptions, ...options }
	if (
		newOptions.method === 'POST' ||
		newOptions.method === 'PUT' ||
		newOptions.method === 'DELETE'
	) {
		console.log(!(newOptions.body instanceof FormData), '!(newOptions.body instanceof FormData)')
		if (!(newOptions.body instanceof FormData)) {
			newOptions.headers = {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
				// Authorization: _token,
				...newOptions.headers,
			}
			newOptions.body = JSON.stringify(newOptions.body)
		} else {
			// newOptions.body is FormData
			newOptions.headers = {
				Accept: 'application/json',
				// 'Content-Type': 'multipart/form-data',
				// Authorization: _token,
				...newOptions.headers,
			}
		}
	} else {
		newOptions.headers = {
			// Authorization: _token,
			...newOptions.headers,
		}
	}

	// let URL = BASE_URL + url
	let URL = (newOptions?.baseURL || BASE_URL) + url
	const req = Promise.race([
		fetch(URL, newOptions),
		new Promise((resolve, reject) => {
			setTimeout(
				() =>
					reject(
						new RequestError({
							message: 'request time out',
							code: '408',
						}),
					),
				FETCH_TIMEOUT,
			)
		}),
	])

	return req
		.then(checkCode)
		.then((response) => {
			const statusCode = response.status
			const data = response.json()
			return Promise.all([{ status: statusCode }, data])
		})
		.then((text) => {
			console.log('RESP:', text)
			return { ...text[0], data: text[1] }
		})
		.catch((e) => {
			if (process.env.NODE_ENV !== 'production') {
				console.groupCollapsed(`%c RESP error :${BASE_URL + url}`, 'background:black;color:red')
				console.warn(e)
				console.groupEnd(`RESP error:${url}`)
			}
		})
}

export const get = (url, params, token) =>
	request(params ? `${url}?${stringify({ ...params })}` : url, {
		method: 'GET',
		headers: {
			Authorization: token,
		},
	})

export const stack_post = (url, params, headers = {}) =>
	request(url, {
		method: 'POST',
		body: params,
		baseURL: STACK_URL,
		headers: {
			// Authorization: token,
			...headers,
			time: new Date().toISOString(),
		},
	})

export const put = (url, params, token) =>
	request(url, {
		method: 'PUT',
		body: params,
		headers: {
			Authorization: token,
		},
	})

export const post = (url, params, token, headers = {}) =>
	request(url, {
		method: 'POST',
		body: params,
		headers: {
			Authorization: token,
			...headers,
		},
	})

export const _delete = (url, params, token) =>
	request(`${url}?${stringify({ ...params })}`, {
		method: 'DELETE',
		headers: {
			Authorization: token,
		},
	})

function stringify(params) {
	let tempParams = []
	Object.keys(params).forEach((key) => {
		let value = params[key]
		if (value === '' || value === null || value === undefined) {
			return
		}
		tempParams.push([key, encodeURIComponent(value)].join('='))
	})
	return tempParams.join('&')
}

function checkCode(res) {
	return res
}

class RequestError extends Error {
	constructor(props) {
		super(props)
		this.success = false
		this.message = props.message
		this.code = props.code
	}
}
