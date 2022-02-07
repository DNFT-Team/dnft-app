import {
	GET_MY_PROFILE_LIST,
	SET_PROFILE_ADDRESS,
	GET_MY_PROFILE_TOKEN,
	GET_MY_PROFILE_BATCH,
	GET_MY_PROFILE_OWNED,
	GET_MY_PROFILE_CREATED,
	GET_MY_PROFILE_SAVE,
	GET_MY_PROFILE_LIKE,
} from '../types/profile'
const initialState = {
	net_env: process.env.REACT_APP_NET_ENV,
	pending: false,
	datas: null,
	address: null,
	chainType: null,
	token: null,
	batch: null,
	owned: null,
	created: null,
}
const Profile = (state = initialState, action) => {
	switch (action.type) {
		case GET_MY_PROFILE_LIST.PENDING:
			return {
				...state,
				pending: true,
			}
		case GET_MY_PROFILE_LIST.SUCCESS:
			return {
				...state,
				pending: false,
				datas: action.payload.data,
			}
		case GET_MY_PROFILE_LIST.ERROR:
			return {
				...state,
				pending: false,
			}
		case SET_PROFILE_ADDRESS.SUCCESS:
			return {
				...state,
				address: action.payload.address,
				chainType: action.payload.chainType,
			}
		case GET_MY_PROFILE_TOKEN.SUCCESS:
			return {
				...state,
				token: action.payload.data,
			}
		case GET_MY_PROFILE_BATCH.SUCCESS:
			// eslint-disable-next-line no-case-declarations
			let _batch = (Array.isArray(action.payload.data) && action.payload.data.slice()) || []
			_batch = _batch.filter(
				(obj) => Array.isArray(obj.nftAvatorUrls) && obj.nftAvatorUrls.length > 0,
			)
			return {
				...state,
				batch: action.payload.data,
			}
		case GET_MY_PROFILE_OWNED.SUCCESS:
			return {
				...state,
				owned: action.payload.data,
			}
		case GET_MY_PROFILE_CREATED.SUCCESS:
			return {
				...state,
				created: action.payload.data,
			}
		case GET_MY_PROFILE_SAVE.SUCCESS:
			// eslint-disable-next-line no-case-declarations
			let dataAll = state?.[action.payload.data.type]?.slice() || []
			dataAll.map((obj) => {
				if (obj.id === action.payload.data.nftId) {
					obj.isSaved = !!action.payload.data.saved
				}
			})
			return {
				...state,
				[action.payload.data.type]: dataAll,
			}
		case GET_MY_PROFILE_LIKE.SUCCESS:
			// eslint-disable-next-line no-case-declarations
			let _dataAll = state?.[action.payload.data.type]?.slice()
			_dataAll.map((obj) => {
				if (obj.id === action.payload.data.nftId) {
					obj.isLiked = !!action.payload.data.like
					obj.likeCount = obj.likeCount + (obj.isLiked ? 1 : -1)
				}
			})
			return {
				...state,
				[action.payload.data.type]: _dataAll,
			}
		default:
			return state
	}
}
export default Profile
