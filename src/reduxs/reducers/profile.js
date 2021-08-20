import { GET_MY_PROFILE_LIST, SET_PROFILE_ADDRESS, GET_MY_PROFILE_TOKEN, GET_MY_PROFILE_BATCH, GET_MY_PROFILE_OWNED, GET_MY_PROFILE_CREATED, GET_MY_PROFILE_SAVE, GET_MY_PROFILE_LIKE} from '../types/profile';

const initialState = {
  pending: false,
  datas: null,
  address: null,
  chainType: null,
  batch: null,
  owned: null,
  created: null,
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
      token: action.payload.data
    }
  case GET_MY_PROFILE_BATCH.SUCCESS:
    return {
      ...state,
      batch: action.payload.data
    }
  case GET_MY_PROFILE_OWNED.SUCCESS:
    return {
      ...state,
      owned: action.payload.data
    }
  case GET_MY_PROFILE_CREATED.SUCCESS:
    return {
      ...state,
      created: action.payload.data
    }
  case GET_MY_PROFILE_SAVE.SUCCESS:
    let batch = state.batch.slice();
    batch.map((obj) => {
      if(obj.id === action.payload.data.nftId)
        obj.isSaved = !!action.payload.data.saved
    })
    let owned = state.owned.slice();
    owned.map((obj) => {
      if(obj.id === action.payload.data.nftId)
        obj.isSaved = !!action.payload.data.saved
    })
    let created = state.created.slice();
    created.map((obj) => {
      if(obj.id === action.payload.data.nftId)
        obj.isSaved = !!action.payload.data.saved
    })
    return {
      ...state,
      batch,
      owned,
      created,
    }
  case GET_MY_PROFILE_LIKE.SUCCESS:
    let _batch = state.batch.slice();
    _batch.map((obj) => {
      if(obj.id === action.payload.data.nftId) {
        obj.isLiked = !!action.payload.data.like;
        obj.likeCount = obj.likeCount + (obj.isLiked ? 1 : -1)
      }
    })
    let _owned = state.owned.slice();
    _owned.map((obj) => {
      if(obj.id === action.payload.data.nftId) {
        obj.isLiked = !!action.payload.data.like;
        obj.likeCount = obj.likeCount + (obj.isLiked ? 1 : -1)
      }
    })
    let _created = state.created.slice();
    _created.map((obj) => {
      if(obj.id === action.payload.data.nftId) {
        obj.isLiked = !!action.payload.data.like;
        obj.likeCount = obj.likeCount + (obj.isLiked ? 1 : -1)
      }
    })
    return {
      ...state,
      batch: _batch,
      owned: _owned,
      created: _created,
    }
  default:  return state
  }
}
export default Profile;