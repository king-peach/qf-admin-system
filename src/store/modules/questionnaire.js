import { deepClone } from '@/utils/deepClone'

const questionnaire = {
  state: {
    data: {
      title: '标题',
      titleTip: '',
      questionnaireData: []
    }
  },

  mutations: {
    'UPDATE_QUESTIONNAIRE': (state, data) => {
      state.data = deepClone(data)
    }
  },

  actions: {
    UpdateQuestionnaire: (({commit}, data) => {
      commit('UPDATE_QUESTIONNAIRE', data)
    })
  }
}

export default questionnaire