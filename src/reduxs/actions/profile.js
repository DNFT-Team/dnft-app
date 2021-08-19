import { GET_MY_PROFILE_LIST, SET_PROFILE_ADDRESS, GET_MY_PROFILE_TOKEN, GET_MY_PROFILE_BATCH, GET_MY_PROFILE_OWNED, GET_MY_PROFILE_CREATED, GET_MY_PROFILE_SAVE } from '../types/profile';
import { parseRestError } from '../errorHelper';
import { Message } from 'element-react';
import { get, post } from 'utils/request';
export const getMyProfileList = (params = {},token) => (dispatch) => {
  dispatch({ type: GET_MY_PROFILE_LIST.PENDING });
  return get('/api/v1/users', params, token)
    .then((res) => {
      if (res && res.status == 200) {
        dispatch({
          type: GET_MY_PROFILE_LIST.SUCCESS, payload: {
            data: res.data,
          }
        })
      } else {
        const error = parseRestError(res);
        dispatch({ type: GET_MY_PROFILE_LIST.ERROR })
      }
      return res
    })
    .catch((error) => {
      dispatch({ type: GET_MY_PROFILE_LIST.ERROR })
    })
}
export const getMyProfileBatch = (params = {},token) => (dispatch) => {
  dispatch({ type: GET_MY_PROFILE_BATCH.PENDING });
  return post('/api/v1/nft/batch', params, token)
    .then((res) => {
      if (res && res.status == 200) {
        dispatch({
          type: GET_MY_PROFILE_BATCH.SUCCESS, payload: {
            data: res.data?.data,
          }
        })
      } else {
        const error = parseRestError(res);
        dispatch({ type: GET_MY_PROFILE_BATCH.ERROR })
      }
      return res
    })
    .catch((error) => {
      dispatch({ type: GET_MY_PROFILE_BATCH.ERROR })
    })
}
export const getMyProfileOwned = (params = {},token) => (dispatch) => {
  dispatch({ type: GET_MY_PROFILE_OWNED.PENDING });
  return post('/api/v1/nft/owned', params, token)
    .then((res) => {
      if (res && res.status == 200) {
        dispatch({
          type: GET_MY_PROFILE_OWNED.SUCCESS, payload: {
            data: res.data?.data,
          }
        })
      } else {
        const error = parseRestError(res);
        dispatch({ type: GET_MY_PROFILE_OWNED.ERROR })
      }
      return res
    })
    .catch((error) => {
      dispatch({ type: GET_MY_PROFILE_OWNED.ERROR })
    })
}
export const getMyProfileCreated = (params = {},token) => (dispatch) => {
  dispatch({ type: GET_MY_PROFILE_CREATED.PENDING });
  return post('/api/v1/nft/created', params, token)
    .then((res) => {
      if (res && res.status == 200) {
        dispatch({
          type: GET_MY_PROFILE_CREATED.SUCCESS, payload: {
            data: res.data?.data,
          }
        })
      } else {
        const error = parseRestError(res);
        dispatch({ type: GET_MY_PROFILE_CREATED.ERROR })
      }
      return res
    })
    .catch((error) => {
      dispatch({ type: GET_MY_PROFILE_CREATED.ERROR })
    })
}
export const setProfileAddress = (params = {}) => (dispatch) => {
  dispatch({
    type: SET_PROFILE_ADDRESS.SUCCESS, payload: {
      address: params.address,
      chainType: params.chainType
    }
  })
}
export const setProfileToken = (params = {}) => (dispatch) => {
  dispatch({ type: GET_MY_PROFILE_TOKEN.PENDING });
  return post('/api/v1/auth/nonce', params)
    .then((res) => {
      console.log('-------------------- GET_MY_PROFILE_LIST result is:', res)

      if (res && res.status == 200) {
        dispatch({
          type: GET_MY_PROFILE_TOKEN.SUCCESS, payload: {
            data: `${res.data.tokenType} ${res.data.accessToken}`,
          }
        })
      } else {
        const error = parseRestError(res);
        dispatch({ type: GET_MY_PROFILE_TOKEN.ERROR })
      }

      return res
    })
    .catch((error) => {
      dispatch({ type: GET_MY_PROFILE_TOKEN.ERROR })
    })
}
export const setProfileLike = (params = {}, token) => (dispatch) => (
  post('/api/v1/nft/like', params, token)
    .then((res) => {
      console.log('-------------------- GET_MY_PROFILE_LIST result is:', res)

      if (res && res.status == 200) {
        // dispatch({
        //   type: GET_MY_PROFILE_TOKEN.SUCCESS, payload: {
        //     data: `${res.data.tokenType} ${res.data.accessToken}`,
        //   }
        // })
      } else {
        const error = parseRestError(res);
        dispatch({ type: GET_MY_PROFILE_TOKEN.ERROR })
      }

      return res
    })
    .catch((error) => {
      dispatch({ type: GET_MY_PROFILE_TOKEN.ERROR })
    })
)
export const setProfileSave = (params = {}, token) => (dispatch) => (
  post('/api/v1/nft/save', params, token)
    .then((res) => {
      console.log('-------------------- GET_MY_PROFILE_LIST result is:', res)

      if (res && res.status == 200) {
        // dispatch({
        //   type: GET_MY_PROFILE_TOKEN.SUCCESS, payload: {
        //     data: `${res.data.tokenType} ${res.data.accessToken}`,
        //   }
        // })
      } else {
        const error = parseRestError(res);
        // dispatch({ type: GET_MY_PROFILE_SAVE.ERROR })
      }

      return res
    })
    .catch((error) => {
      dispatch({ type: GET_MY_PROFILE_SAVE.ERROR })
    })
)