import feathersClient from '@/api/feathers-client'

const SET_MESSAGE_SPECIFICATIONS = 'SET_MESSAGE_SPECIFICATIONS'
const CREATE_MESSAGE_SPECIFICATION = 'CREATE_MESSAGE_SPECIFICATION'
const REMOVE_MESSAGE_SPECIFICATION = 'REMOVE_MESSAGE_SPECIFICATION'

const messagesSpecificationsService = feathersClient.service('message-specifications')

const state = {
  messageSpecifications: []
}

const mutations = {
  [SET_MESSAGE_SPECIFICATIONS] (state, payload) {
    state.messageSpecifications = payload
  },
  [CREATE_MESSAGE_SPECIFICATION] (state, payload) {
    state.messageSpecifications.push(payload)
  },
  [REMOVE_MESSAGE_SPECIFICATION] (state, payload) {
    const index = state.messageSpecifications.findIndex((el) => el._id.toString() === payload._id.toString())
    if (index !== -1) {
      state.messageSpecifications.splice(index, 1)
    }
  }
}

const actions = {
  createMessageSpecification ({commit}, payload) {
    return messagesSpecificationsService.create(payload)
      .then(result => {
        commit(CREATE_MESSAGE_SPECIFICATION, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  removeMessageSpecification ({commit, dispatch}, payload) {
    return messagesSpecificationsService.remove(payload)
      .then(result => {
        commit(REMOVE_MESSAGE_SPECIFICATION, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  patchMessageSpecification ({commit, dispatch}, payload) {
    return messagesSpecificationsService.patch(payload.id, payload.body)
      .then(() => {
        return dispatch('fetchMessageSpecifications')
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchMessageSpecifications ({rootGetters, commit}) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: rootGetters['modeler/currentSelectedProcessLayer']
      }
    }
    return messagesSpecificationsService.find(params)
      .then(result => {
        return commit(SET_MESSAGE_SPECIFICATIONS, result.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchMessageSpecificationsByParentId ({rootGetters}, payload) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: payload
      }
    }

    return messagesSpecificationsService.find(params)
      .then(result => {
        return result.data
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

const getters = {
  messageSpecifications (state) {
    return state.messageSpecifications
  },
  selectReadyMessageSpecifications (state) {
    return state.messageSpecifications.map(messageSpecification => {
      return {
        text: messageSpecification.name,
        value: messageSpecification._id.toString()
      }
    })
  },
  getMessageSpecificationNameById: (state) => (messageSpecificationId) => {
    const messageSpecification = state.messageSpecifications.find(el => el._id.toString() === messageSpecificationId)
    if (typeof messageSpecification !== 'undefined') {
      return messageSpecification.name
    }
  }
}

const messageSpecificationsModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default messageSpecificationsModule
