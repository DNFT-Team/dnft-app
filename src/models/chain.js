import conf from '../config/conf.js'
import types from '../config/dnft.json'
import { ApiPromise, WsProvider } from '@polkadot/api'
import {
    web3Accounts,
    web3Enable,
    web3FromAddress
} from '@polkadot/extension-dapp';
import { numberToHex } from '@polkadot/util';
const apiPlugin = async () => {
    const apiUrl = conf.Chain_Api_Url
    try {
        //  ws connect
        const provider = new WsProvider(apiUrl)
        console.log(provider)
        types['Address'] = 'MultiAddress'
        types['LookupSource'] = 'MultiAddress'
        let state = {}

        //  chain api instance
        const apiPromise = await ApiPromise.create({ provider, types })
        const isReady = apiPromise.isReady.then(async () => {
            console.log('Chain Connect Success : ', apiUrl);
            state.Api = apiPromise
            state.apiUrl = apiUrl
            const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
            try {
                const allInjected = await web3Enable('NFT')
                const allAccounts = await web3Accounts()
                const sender = allAccounts[0].address
                const { data: { free } } = await apiPromise.query.system.account(sender);
                let a = free.toHuman();
                let account = a.split(' ') && a.split(' ')[0] //账户余额数字
                const amount = 10 //    默认转帐10个单位币额
                const value = numberToHex(amount * 1e3 * 10 ** (12))
                state.account = a;
                state.sender = sender;
                // console.log(`${sender} has a current balance of`, value, 'value', sender, account,a, free.toHuman());

            } catch (e) {
                console.log(e)
            }

            //  sync bestNumber
            await apiPromise.derive.chain.bestNumber(
                (value) => {
                    // console.log('#bestNumber',value.toNumber());
                    state.bestNumber = value.toNumber()
                }
            )
            //  sync bestNumberFinalized
            await apiPromise.derive.chain.bestNumberFinalized(
                (value) => {
                    // console.log('#bestNumberFinalized',value.toNumber());
                    state.bestNumberFinalized = value.toNumber()
                }
            )
        })

        return state;
    } catch (err) {
        console.log(331313)
        console.log(err)
    }
}
const UserModel = {
    namespace: 'chainState',
    state: {
        state: {
            apiUrl: conf.Chain_Api_Url,
            Api: null,
            bestNumber: 0,
            bestNumberFinalized: 0,
        },
        account: 0,

    },
    effects: {
        *apiPlugin({ payload }, { call, put }) {
            const response = yield call(apiPlugin)
            yield put({ type: 'save', payload: response })
            window.state = response;
        },

    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                state: {
                    apiUrl: payload.Chain_Api_Url,
                    Api: payload.Api,
                    bestNumber: payload.bestNumber,
                    bestNumberFinalized: payload.bestNumberFinalized,
                },
                account: payload.account,
            };
        },

    },
};
export default UserModel;
