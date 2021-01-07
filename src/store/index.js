import Vue from 'vue'
import Vuex from 'vuex'
import chainState from './modules/chainState.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    chainState
  }
})
