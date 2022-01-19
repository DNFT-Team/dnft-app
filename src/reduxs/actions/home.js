import { GET_HOME_LIST } from '../types/home'
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
