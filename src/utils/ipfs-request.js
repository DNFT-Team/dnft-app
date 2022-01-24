const BASE_URL = process.env.REACT_APP_IPFS_ENDPOINT
const SENSI_URL = process.env.REACT_APP_AI_ENDPOINT
const FETCH_TIMEOUT = 60 * 1000

export const IPFS_PREFIX = 'ipfs://'

export const IpfsUrl = (cid) => (cid ? IPFS_PREFIX + cid : '')

function request(url, options) {
	if (BASE_URL.length == 0) {
		return
	}
	const defaultOptions = { headers: {} }
	const newOptions = { ...defaultOptions, ...options }
	if (
		newOptions.method === 'POST' ||
		newOptions.method === 'PUT' ||
		newOptions.method === 'DELETE'
	) {
		if (!(newOptions.body instanceof FormData)) {
			newOptions.headers = {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
				...newOptions.headers,
			}
			newOptions.body = JSON.stringify(newOptions.body)
		} else {
			// newOptions.body is FormData
			newOptions.headers = {
				Accept: 'application/json',
				...newOptions.headers,
			}
		}
	} else {
		newOptions.headers = {
			...newOptions.headers,
		}
	}

	const URL = (newOptions?.baseURL || BASE_URL) + url

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
				console.groupCollapsed(`%c RESP error :${url}`, 'background:black;color:red')
				console.warn(e)
				console.groupEnd(`RESP error:${url}`)
			}
		})
}

export const sensi_post = (url, params) =>
	request(url, {
		method: 'POST',
		body: params,
		baseURL: SENSI_URL,
	})

export const ipfs_post = (url, params, token) =>
	request(url, {
		method: 'POST',
		body: params,
		headers: {
			Authorization: token,
		},
	})

export const ipfs_add = async (_file) => {
	try {
		const fileData = new FormData()
		fileData.append('file', _file)
		const { data } = await request('/v0/add', { method: 'POST', body: fileData })
		return data?.Hash || null
	} catch {
		return null
	}
}

export const ipfs_media = async (files, isMedia) => {
	let cidImage, cidAnimate
	try {
		// if (isMedia && files.length === 2) {
		// cidImage = await ipfs_add(files[0])
		// cidAnimate = await ipfs_add(files[1])
		if (isMedia) {
			cidAnimate = await ipfs_add(files[0])
			return {
				image: '',
				animation_url: cidAnimate,
				isOk: !!cidAnimate,
			}
		} else {
			cidImage = await ipfs_add(files[0])
			return {
				image: cidImage,
				animation_url: '',
				isOk: !!cidImage,
			}
		}
	} catch {
		return {
			image: '',
			animation_url: '',
			isOk: false,
		}
	}
}

class RequestError extends Error {
	constructor(props) {
		super(props)
		this.success = false
		this.message = props.message
		this.code = props.code
	}
}
