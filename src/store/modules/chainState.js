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

    types['Address'] = 'MultiAddress'
    types['LookupSource'] = 'MultiAddress'

    //  chain api instance
    const apiPromise = await ApiPromise.create({ provider, types })
    const isReady = apiPromise.isReady.then(async () => {
      console.log('Chain Connect Success : ',apiUrl);
      store.state.Api = apiPromise
      store.state.apiUrl = apiUrl
      store.state.isConnected = true
    })
  } catch (err) {
    console.log(err)
    store.state.isConnected = false
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,
  state: {
    apiUrl: conf.Chain_Api_Url,
    isConnected: false,
    Api: null
  },
  plugins: [apiPlugin]
})
