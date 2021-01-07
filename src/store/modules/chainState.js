import Vue from 'vue'
import Vuex from 'vuex'
import types from '../../config/dnft.json'
import conf from '../../config/conf.js'
import {ApiPromise, WsProvider} from '@polkadot/api'



const apiPlugin = async (store) => {

  const apiUrl = conf.Chain_Api_Url

  try {
    //  ws connect
    const provider = new WsProvider(apiUrl)

    types['Address'] = 'AccountId'
    types['LookupSource'] = 'AccountId'

    //  chain api instance
    const apiPromise = await ApiPromise.create({ provider, types })
    const isReady = apiPromise.isReady.then(async () => {
      console.log('Chain Connect Success : ',apiUrl);
      store.state.Api = apiPromise
      store.state.apiUrl = apiUrl

      //  sync bestNumber
      await apiPromise.derive.chain.bestNumber(
        (value) => {
          // console.log('#bestNumber',value.toNumber());
          store.state.bestNumber = value.toNumber()
        }
      )
      //  sync bestNumberFinalized
      await apiPromise.derive.chain.bestNumberFinalized(
        (value) => {
          // console.log('#bestNumberFinalized',value.toNumber());
          store.state.bestNumberFinalized = value.toNumber()
        }
      )
    })
  } catch (err) {
    console.log(err)
  }
}



Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiUrl: conf.Chain_Api_Url,
    Api: null,
    bestNumber: 0,
    bestNumberFinalized: 0
  },
  plugins: [apiPlugin]
})
