import { GET_MY_PROFILE_LIST } from '../types/profile';

const initialState = {
  pending: false,
  datas: null,

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
  default:  return state
  }
}
export default Profile;
