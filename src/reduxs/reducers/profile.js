import { GET_MY_PROFILE_LIST, SET_PROFILE_ADDRESS, GET_MY_PROFILE_TOKEN } from '../types/profile';

const initialState = {
  pending: false,
  datas: null,
  address: null,
  chainType: null,
}
const Profile = (state = initialState, action) => {
  switch (action.type) {
  case GET_MY_PROFILE_LIST.PENDING:
    return {
      ...state,
      pending: true
    }
  case GET_MY_PROFILE_LIST.SUCCESS:
    return {
      ...state,
      pending: false,
      datas: action.payload.data
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
      token: action.payload.accessToken
    }
  default:  return state
  }
}
export default Profile;