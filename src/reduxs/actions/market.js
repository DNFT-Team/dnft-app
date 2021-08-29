import { GET_MARKET_LIST } from '../types/market';

import { parseRestError } from '../errorHelper';
import { Message } from 'element-react';
import { get, post } from 'utils/request';
export const getMarketList = (params = {},token) => (dispatch) => {
  dispatch({ type: GET_MARKET_LIST.PENDING });
  return post('/api/v1/trans/market', params, token)
    .then((res) => {
      if (res && res.status == 200) {
        dispatch({
          type: GET_MARKET_LIST.SUCCESS, payload: {
            data: res.data?.data?.content || [],
          }
        })
      } else {
        const error = parseRestError(res);
        dispatch({ type: GET_MARKET_LIST.ERROR })
      }
      return res
    })
    .catch((error) => {
      dispatch({ type: GET_MARKET_LIST.ERROR })
    })
}