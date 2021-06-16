import {SET_LNG} from '../types/lng';

// SET
export const _setLng = (params = {}) => dispatch => {
    dispatch({ type: SET_LNG })
}