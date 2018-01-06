import feathersClient from '@/api/feathers-client'

const SET_RECEIVE_TRANSITIONS = 'SET_RECEIVE_TRANSITIONS'
const CREATE_RECEIVE_TRANSITION = 'CREATE_RECEIVE_TRANSITION'
const REMOVE_RECEIVE_TRANSITION = 'REMOVE_RECEIVE_TRANSITION'

const receiveTransitionsService = feathersClient.service('receive-transitions')

const state = {
  receiveTransitions: []
}

const mutations = {
  [SET_RECEIVE_TRANSITIONS] (state, payload) {
    state.receiveTransitions = payload
  },
  [CREATE_RECEIVE_TRANSITION] (state, payload) {
    state.receiveTransitions.push(payload)
  },
  [REMOVE_RECEIVE_TRANSITION] (state, payload) {
    const index = state.receiveTransitions.findIndex((el) => {
      return el._id.toString() === payload._id.toString()
    })
    if (index !== -1) {
      state.receiveTransitions.splice(index, 1)
    }
  }
}

const actions = {
  createReceiveTransition ({commit}, payload) {
    return receiveTransitionsService.create(payload)
      .then(result => {
        commit(CREATE_RECEIVE_TRANSITION, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  removeReceiveTransition ({commit}, payload) {
    return receiveTransitionsService.remove(payload)
      .then(result => {
        commit(REMOVE_RECEIVE_TRANSITION, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  patchReceiveTransition ({dispatch}, payload) {
    return receiveTransitionsService.patch(payload.id, payload.body)
      .then(() => {
        return dispatch('fetchReceiveTransitions')
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchReceiveTransitions ({rootGetters, commit}) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: rootGetters['modeler/currentSelectedSubjectId']
      }
    }
    return receiveTransitionsService.find(params)
      .then(result => {
        return commit(SET_RECEIVE_TRANSITIONS, result.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchReceiveTransitionsByParentId ({rootGetters}, payload) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: payload
      }
    }

    return receiveTransitionsService.find(params)
      .then(result => {
        return result.data
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

const getters = {
  receiveTransitions (state) {
    return state.receiveTransitions
  }
}

const receiveTransitionsModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default receiveTransitionsModule
