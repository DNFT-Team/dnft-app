import { GET_MARKET_LIST } from '../types/market';

const initialState = {
  pending: false,
  datas: null,

}
const market = (state = initialState, action) => {
  switch (action.type) {
  case GET_MARKET_LIST.PENDING:
    return {
      ...state,
      pending: true
    }
  case GET_MARKET_LIST.SUCCESS:
    return {
      ...state,
      pending: false,
      datas: action.payload.data
    }
  case GET_MARKET_LIST.ERROR:
    return {
      ...state,
      pending: false,
    }
  default:  return state
  }
}
export default market;
