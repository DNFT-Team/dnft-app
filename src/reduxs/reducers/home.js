import { GET_HOME_LIST } from '../types/home';

const initialState = {
    pending: false,
    datas: null,

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
        default:  return state
    }
}
export default home;