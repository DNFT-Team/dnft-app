import { GET_HOME_LIST, GET_TOKEN_PRICE } from '../types/home'
import { parseRestError } from '../errorHelper'
import { get } from 'utils/request'
export const getHomeList =
	(params = { a: 1 }) =>
	(dispatch) => {
		dispatch({ type: GET_HOME_LIST.PENDING })
		return get('/type', params)
			.then((res) => {
				console.log('-------------------- GET_HOME_LIST result is:', res)

				if (res && res.status == 200) {
					dispatch({
						type: GET_HOME_LIST.SUCCESS,
						payload: {
							params,
							data: res.data,
						},
					})
				} else {
					const error = parseRestError(res)
					console.log('====== error text::', error)
					// toast(error);
					dispatch({ type: GET_HOME_LIST.ERROR })
				}

				return res
			})
			.catch((error) => {
				dispatch({ type: GET_HOME_LIST.ERROR })
			})
	}


	export const getTokenList =
	(params = {}, token) =>
	(dispatch) => {
		dispatch({ type: GET_TOKEN_PRICE.PENDING })
		return Promise.allSettled([
			get('/api/v1/info/price/DNFT'),
			get('/api/v1/info/price/BUSD')
		]).then((results) => {
				let res = {};
				let tokenList = ['DNFT', 'BUSD']
				tokenList.forEach((t, i) => {
					if (results[i].status === 'fulfilled') {
						const _data = results[i].value
						res[t] = _data?.data?.data || 1
					} else {
						res[t] = 1
					}
				})
				dispatch({
					type: GET_TOKEN_PRICE.SUCCESS,
					payload: {
						data: res,
					},
				})
				return results
			})
			.catch((error) => {
				dispatch({ type: GET_TOKEN_PRICE.ERROR })
			})
	}
