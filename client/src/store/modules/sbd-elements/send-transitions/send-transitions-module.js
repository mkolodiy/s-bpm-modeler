import feathersClient from '@/api/feathers-client'

const SET_SEND_TRANSITIONS = 'SET_SEND_TRANSITIONS'
const CREATE_SEND_TRANSITION = 'CREATE_SEND_TRANSITION'
const REMOVE_SEND_TRANSITION = 'REMOVE_SEND_TRANSITION'

const sendTransitionsService = feathersClient.service('send-transitions')

const state = {
  sendTransitions: []
}

const mutations = {
  [SET_SEND_TRANSITIONS] (state, payload) {
    state.sendTransitions = payload
  },
  [CREATE_SEND_TRANSITION] (state, payload) {
    state.sendTransitions.push(payload)
  },
  [REMOVE_SEND_TRANSITION] (state, payload) {
    const index = state.sendTransitions.findIndex((el) => {
      return el._id.toString() === payload._id.toString()
    })
    if (index !== -1) {
      state.sendTransitions.splice(index, 1)
    }
  }
}

const actions = {
  createSendTransition ({commit}, payload) {
    return sendTransitionsService.create(payload)
      .then(result => {
        commit(CREATE_SEND_TRANSITION, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  removeSendTransition ({commit}, payload) {
    return sendTransitionsService.remove(payload)
      .then(result => {
        commit(REMOVE_SEND_TRANSITION, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  patchSendTransition ({dispatch}, payload) {
    return sendTransitionsService.patch(payload.id, payload.body)
      .then(() => {
        return dispatch('fetchSendTransitions')
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchSendTransitions ({rootGetters, commit}) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: rootGetters['modeler/currentSelectedSubjectId']
      }
    }
    return sendTransitionsService.find(params)
      .then(result => {
        return commit(SET_SEND_TRANSITIONS, result.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchSendTransitionsByParentId ({rootGetters}, payload) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: payload
      }
    }

    return sendTransitionsService.find(params)
      .then(result => {
        return result.data
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

const getters = {
  sendTransitions (state) {
    return state.sendTransitions
  }
}

const sendTransitionsModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default sendTransitionsModule
