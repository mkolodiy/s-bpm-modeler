import feathersClient from '@/api/feathers-client'

const SET_MESSAGE_EXCHANGES = 'SET_MESSAGE_EXCHANGES'
const CREATE_MESSAGE_EXCHANGE = 'CREATE_MESSAGE_EXCHANGE'
const REMOVE_MESSAGE_EXCHANGE = 'REMOVE_MESSAGE_EXCHANGE'

const messageExchangesService = feathersClient.service('message-exchanges')

const state = {
  messageExchanges: []
}

const mutations = {
  [SET_MESSAGE_EXCHANGES] (state, payload) {
    state.messageExchanges = payload
  },
  [CREATE_MESSAGE_EXCHANGE] (state, payload) {
    state.messageExchanges.push(payload)
  },
  [REMOVE_MESSAGE_EXCHANGE] (state, payload) {
    const index = state.messageExchanges.findIndex(el => el._id.toString() === payload._id.toString())
    if (index !== -1) {
      state.messageExchanges.splice(index, 1)
    }
  }
}

const actions = {
  createMessageExchange ({commit}, payload) {
    return messageExchangesService.create(payload)
      .then(result => {
        commit(CREATE_MESSAGE_EXCHANGE, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  removeMessageExchange ({commit, dispatch}, payload) {
    return messageExchangesService.remove(payload)
      .then(result => {
        commit(REMOVE_MESSAGE_EXCHANGE, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  patchMessageExchange ({commit, dispatch}, payload) {
    return messageExchangesService.patch(payload.id, payload.body)
      .then(() => {
        return dispatch('fetchMessageExchanges')
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchMessageExchanges ({rootGetters, commit}) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: rootGetters['modeler/currentSelectedProcessLayer']
      }
    }
    return messageExchangesService.find(params)
      .then(result => {
        return commit(SET_MESSAGE_EXCHANGES, result.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchMessageExchangesByParentId ({rootGetters}, payload) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: payload
      }
    }

    return messageExchangesService.find(params)
      .then(result => {
        return result.data
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

const getters = {
  messageExchanges (state) {
    return state.messageExchanges
  }
}

const messageExchangesModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default messageExchangesModule
