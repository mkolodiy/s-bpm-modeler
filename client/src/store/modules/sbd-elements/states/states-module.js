import feathersClient from '@/api/feathers-client'

const SET_STATES = 'SET_STATES'
const CREATE_STATE = 'CREATE_STATE'
const REMOVE_STATE = 'REMOVE_STATE'

const statesService = feathersClient.service('states')

const state = {
  states: []
}

const mutations = {
  [SET_STATES] (state, payload) {
    state.states = payload
  },
  [CREATE_STATE] (state, payload) {
    state.states.push(payload)
  },
  [REMOVE_STATE] (state, payload) {
    const index = state.states.findIndex((el) => {
      return el._id.toString() === payload._id.toString()
    })
    if (index !== -1) {
      state.states.splice(index, 1)
    }
  }
}

const actions = {
  createState ({commit}, payload) {
    return statesService.create(payload)
      .then(result => {
        commit(CREATE_STATE, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  removeState ({commit, dispatch}, payload) {
    return statesService.remove(payload)
      .then(result => {
        commit(REMOVE_STATE, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  patchState ({commit, dispatch}, payload) {
    return statesService.patch(payload.id, payload.body)
      .then(() => {
        return dispatch('fetchStates')
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchStates ({rootGetters, commit}) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: rootGetters['modeler/currentSelectedSubjectId']
      }
    }
    return statesService.find(params)
      .then(result => {
        return commit(SET_STATES, result.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchStatesByParentId ({rootGetters}, payload) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: payload
      }
    }

    return statesService.find(params)
      .then(result => {
        return result.data
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

const getters = {
  states (state) {
    return state.states
  }
}

const statesModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default statesModule
