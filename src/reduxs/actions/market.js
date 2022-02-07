import { GET_MARKET_LIST, GET_CATEGORY_LIST, SET_MARKET_LIST } from '../types/market'
import { parseRestError } from '../errorHelper'
import { get, post } from 'utils/request'
export const getMarketList =
	(params = {}, token) =>
	(dispatch) => {
		dispatch({ type: GET_MARKET_LIST.PENDING })
		return post('/api/v1/trans/market', params, token)
			.then((res) => {
				if (res && res.status == 200) {
					dispatch({
						type: GET_MARKET_LIST.SUCCESS,
						payload: {
							data: res.data?.data || {},
							page: params.page,
						},
					})
				} else {
					const error = parseRestError(res)
					dispatch({ type: GET_MARKET_LIST.ERROR })
				}
				return res
			})
			.catch((error) => {
				dispatch({ type: GET_MARKET_LIST.ERROR })
			})
	}

export const setMarketList =
	(params = [], token) =>
	(dispatch) => {
		dispatch({
			type: SET_MARKET_LIST.SUCCESS,
			payload: {
				data: params,
			},
		})
	}

export const getCategoryList =
	(params = {}, token) =>
	(dispatch) => {
		dispatch({ type: GET_CATEGORY_LIST.PENDING })
		return get('/api/v1/info/category_mutil', null, token)
			.then((res) => {
				if (res && res.status == 200) {
					dispatch({
						type: GET_CATEGORY_LIST.SUCCESS,
						payload: {
							data: res.data?.data || [],
						},
					})
				} else {
					const error = parseRestError(res)
					dispatch({ type: GET_CATEGORY_LIST.ERROR })
				}
				return res
			})
			.catch((error) => {
				dispatch({ type: GET_CATEGORY_LIST.ERROR })
			})
	}
