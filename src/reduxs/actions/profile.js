import { GET_MY_PROFILE_LIST } from '../types/profile';
import { parseRestError } from '../errorHelper';
import { Message } from 'element-react';
import { get } from 'utils/request';
export const getMyProfileList = (params = {}) => (dispatch) => {
  dispatch({ type: GET_MY_PROFILE_LIST.PENDING });
  return get('/api/v1/users', params)
    .then((res) => {
      console.log('-------------------- GET_MY_PROFILE_LIST result is:', res)

      if (res && res.status == 200) {
        dispatch({
          type: GET_MY_PROFILE_LIST.SUCCESS, payload: {
            params,
            data: res.data,
          }
        })
      } else {
        const error = parseRestError(res);
        console.log('====== error text::', error);
        // toast(error);
        dispatch({ type: GET_MY_PROFILE_LIST.ERROR })
      }

      return res
    })
    .catch((error) => {
      dispatch({ type: GET_MY_PROFILE_LIST.ERROR })
    })
}
