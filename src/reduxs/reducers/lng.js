import { SET_LNG } from '../types/lng';
import i18n from 'i18n_config';
import { LNG } from 'utils/constant';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { fromJS, is } from 'immutable';
import _ from 'lodash'
const initialState = {
  lng: LNG.EN,
}
const _lng = (state = initialState, { type, payload }) => {
  switch (type) {
  case SET_LNG:
    const value = _.isEqual(state.lng, LNG.ZH) ? LNG.EN : LNG.ZH;
    i18n.changeLanguage(value.value);
    return {
      ...state,
      lng: value
    }
  default:
    return state;
  }
}
const persistConfig = {
  key: 'lng',
  storage: storage,
  whitelist: ['lng']
};
export default persistReducer(persistConfig, _lng)
