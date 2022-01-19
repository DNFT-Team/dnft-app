export default {
	res: (res) => {
		if (~~res.status === 200) {
			return res.data
		}
		return Promise.reject(res.data)
	},
	error: (error) => Promise.reject(error),
}
