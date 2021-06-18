import Vue from 'vue'
import Vuex from 'vuex'
import chainState from "./modules/chainState";

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    address:''
  },
  mutations:{
    updateAddress(state, adr){
      state.address = adr
    }
  },
  modules: {chainState}
})
