import { getType, getProduct, getProductSearch } from '@/services/project';
import { exchangeObj } from '@/utils/parse';
const UserModel = {
    namespace: 'project',
    state: {
        nav: {},
        product: []
    },
    effects: {
        *fetchType({ payload }, { call, put }) {
            const response = yield call(getType, payload);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        *getProduct({ payload }, { call, put }) {
            const response = yield call(getProduct, payload);
            yield put({
                type: 'save1',
                payload: response && response.data && exchangeObj(response.data) || [],
            });
        },
        *getProductSearch({ payload }, { call, put }) {
            const response = yield call(getProductSearch, payload);
            console.log(response)
            yield put({
                type: 'save1',
                payload: response && response.data && response.data.project && exchangeObj(response.data.project) || [],
            });
        },
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                nav: payload
            };
        },
        save1(state, { payload }) {
            return {
                ...state,
                product: payload
            };
        },
    },
};
export default UserModel;
