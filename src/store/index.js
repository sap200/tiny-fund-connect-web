import { createStore } from 'vuex'

export default createStore({
  state: {
      email: "",
      firstName: "",
      lastName: "",
      flowId: "",
      customerId: "",
      ip: "",
      mfaEnrollSent: false,
      wasCreatePoolApiHit: false,
      withdrawlLimit: 0,
      wasWithdrawlDone: false,
      currentPollId: "",
      myOwnVoteDetails: null,
      myOwnPollDetails: null,
      isPollApiHit: false,
      isAddMemberApiHit: false,


  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
