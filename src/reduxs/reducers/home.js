import { GET_HOME_LIST, GET_TOKEN_PRICE } from '../types/home';

const DEFAUTL_PRICE = {
  _isOk: false,
  DNFT: 1,
  BUSD: 1,
}

const initialState = {
  pending: false,
  datas: null,
  tokenPrice: {...DEFAUTL_PRICE},
}
const home = (state = initialState, action) => {
  switch (action.type) {
    case GET_HOME_LIST.PENDING:
      return {
        ...state,
        pending: true
      }
    case GET_HOME_LIST.SUCCESS:
      return {
        ...state,
        pending: false,
        datas: action.payload.data
      }
    case GET_HOME_LIST.ERROR:
      return {
        ...state,
        pending: false,
      }
    case GET_TOKEN_PRICE.PENDING:
      return {
        ...state,
        pending: true
      }
    case GET_TOKEN_PRICE.SUCCESS:
      return {
        ...state,
        pending: false,
        tokenPrice: {...action.payload.data, _isOk: true}
      }
    case GET_TOKEN_PRICE.ERROR:
      return {
        ...state,
        pending: false,
        tokenPrice: {...DEFAUTL_PRICE}
      }
    default:  return state
  }
}
export default home;
