import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rtclist: [],
    phoneList: [],
    timeout: 3000
  },
  mutations: {
    setPhoneList(state, payload) {
      state.phoneList = payload.phoneList
      // console.log(payload.phoneList) 
    },
    setRtcList(state, payload) {
      state.rtclist.push(payload)
      // console.log(state.rtclist)
    },
    setTime(state, payload) {
      state.timeout = payload
    },
    clearRtc(state, payload) {
      state.rtclist.splice(payload, 1)
      // console.log(state.rtclist)
    }
  },
  actions: {

  },
  modules: {}
})