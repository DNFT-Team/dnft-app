const UserModel = {
    namespace: 'assets',
    state: {
        product: []
    },
    effects: {
        *fetchProduct({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload,
            });
        },
        
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                product: payload
            };
        },
    },
};
export default UserModel;
