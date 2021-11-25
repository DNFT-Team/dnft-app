import { GET_MARKET_LIST, GET_CATEGORY_LIST, SET_MARKET_LIST } from '../types/market';

const initialState = {
  pending: false,
  datas: [],
  pageAble: true,
  category: null
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
      datas: (action.payload.page == 1 ? [] : state.datas).concat(action.payload.data?.content || []),
      pageAble: action.payload.data?.pageAble
    }
  case GET_MARKET_LIST.ERROR:
    return {
      ...state,
      pending: false,
    }
  case SET_MARKET_LIST.SUCCESS:
    return {
      ...state,
      datas: action.payload.data,
    }
  case GET_CATEGORY_LIST.SUCCESS:
    let category = action.payload.data?.slice() || []
    Array.isArray(category) && category?.unshift('All')
    return {
      ...state,
      category
    }
  default:  return state
  }
}
export default market;
