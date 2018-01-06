import feathersClient from '@/api/feathers-client'

const SET_FUNCTION_TRANSITIONS = 'SET_FUNCTION_TRANSITIONS'
const CREATE_FUNCTION_TRANSITION = 'CREATE_FUNCTION_TRANSITION'
const REMOVE_FUNCTION_TRANSITION = 'REMOVE_FUNCTION_TRANSITION'

const functionTransitionsService = feathersClient.service('function-transitions')

const state = {
  functionTransitions: []
}

const mutations = {
  [SET_FUNCTION_TRANSITIONS] (state, payload) {
    state.functionTransitions = payload
  },
  [CREATE_FUNCTION_TRANSITION] (state, payload) {
    state.functionTransitions.push(payload)
  },
  [REMOVE_FUNCTION_TRANSITION] (state, payload) {
    const index = state.functionTransitions.findIndex((el) => {
      return el._id.toString() === payload._id.toString()
    })
    if (index !== -1) {
      state.functionTransitions.splice(index, 1)
    }
  }
}

const actions = {
  createFunctionTransition ({commit}, payload) {
    return functionTransitionsService.create(payload)
      .then(result => {
        commit(CREATE_FUNCTION_TRANSITION, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  removeFunctionTransition ({commit}, payload) {
    return functionTransitionsService.remove(payload)
      .then(result => {
        commit(REMOVE_FUNCTION_TRANSITION, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  patchFunctionTransition ({dispatch}, payload) {
    return functionTransitionsService.patch(payload.id, payload.body)
      .then(() => {
        return dispatch('fetchFunctionTransitions')
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchFunctionTransitions ({rootGetters, commit}) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: rootGetters['modeler/currentSelectedSubjectId']
      }
    }
    return functionTransitionsService.find(params)
      .then(result => {
        return commit(SET_FUNCTION_TRANSITIONS, result.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchFunctionTransitionsByParentId ({rootGetters}, payload) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: payload
      }
    }

    return functionTransitionsService.find(params)
      .then(result => {
        return result.data
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

const getters = {
  functionTransitions (state) {
    return state.functionTransitions
  }
}

const functionTransitionsModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default functionTransitionsModule
