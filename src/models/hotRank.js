import { getHotIsUpsRank, getHotIsDownsRank, getHotCoinVolRank, getHotTurnoverRank } from '@/services/hot';
const UserModel = {
    namespace: 'hot',
    state: {
        isUps: [],
        isDowns: [],
        coinVal: [],
        turnover: []
    },
    effects: {
        *fetchIsUps({ payload }, { call, put }) {
            const response = yield call(getHotIsUpsRank, payload);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        *fetchIsDowns({ payload }, { call, put }) {
            const response = yield call(getHotIsDownsRank, payload);
            yield put({
                type: 'save1',
                payload: response,
            });
        },
        *fetchCoinVal({ payload }, { call, put }) {
            const response = yield call(getHotCoinVolRank, payload);
            yield put({
                type: 'save2',
                payload: response,
            });
        },
        *fetchTurnover({ payload }, { call, put }) {
            const response = yield call(getHotTurnoverRank);
            yield put({
                type: 'save3',
                payload: response,
            });
        },

    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                isUps: payload && payload.data || []
            };
        },
        save1(state, { payload }) {
            return {
                ...state,
                isDowns: payload && payload.data || []
            };
        },
        save2(state, { payload }) {
            return {
                ...state,
                coinVal: payload && payload.data && payload.data.list || []
            };
        },
        save3(state, { payload }) {
            return {
                ...state,
                turnover: payload && payload.data || []
            };
        },
    },
};
export default UserModel;
