import Axios from './axios.config'

export default async function request({
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
	const id = `${url}TIME${new Date().getTime()}`
	if (!silent) {
		Axios.setRequestList({ id })
	}
	try {
		const result = await Axios.axios({
			url,
			method,
			headers,
			data,
			params,
		})
		console.log({ id, url, result })

		Axios.setRequestList({ el: id, remove: true })
		success(result)
		console.log(result, 'result')
	} catch (error) {
		Axios.setRequestList({ el: id, remove: true })
		if (!silent) {
			Axios.Toast.error(error.msg || error.message || error)
		}
		fail(error)
	} finally {
		complete()
	}
}
