import { SET_LNG } from '../types/lng'
import i18n from 'i18n_config'
import { LNG } from 'utils/constant'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { fromJS, is } from 'immutable'
import _ from 'lodash'
const initialState = {
	lng: LNG.EN,
}
const _lng = (state = initialState, { type, payload = 'en' }) => {
	switch (type) {
		case SET_LNG:
			// eslint-disable-next-line no-case-declarations
			const value = _.isEqual(state.lng, LNG.ZH) ? LNG.ZH : LNG.EN
			i18n.changeLanguage(payload)
			return {
				...state,
				lng: payload,
			}
		default:
			return state
	}
}
const persistConfig = {
	key: 'lng',
	storage: storage,
	whitelist: ['lng'],
}
export default persistReducer(persistConfig, _lng)
