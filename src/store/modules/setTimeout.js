const setTimeout = {
  state: {
    count: 0
  },

  mutations: {
    INCREMENT_COUNT: (state, data) => {
      state.count += data
    },
    DECREMENT_COUNT: (state, data) => {
      state.count -= data
    }
  },

  actions: {
    IncrementCount: ({ commit }, data) => {
      commit('INCREMENT_COUNT', data)
    },
    DecrementCount: ({ commit }, data) => {
      commit('DECREMENT_COUNT', data)
    }
  }
}

export default setTimeout
