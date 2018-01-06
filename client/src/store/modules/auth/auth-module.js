import feathersClient from '@/api/feathers-client'

const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
const SET_PAYLOAD = 'SET_PAYLOAD'
const SET_USER = 'SET_USER'
const LOGOUT = 'LOGOUT'

const userService = feathersClient.service('users')

const state = {
  accessToken: '',
  user: null,
  payload: null
}

const mutations = {
  [SET_ACCESS_TOKEN] (state, accessToken) {
    state.accessToken = accessToken
  },
  [SET_PAYLOAD] (state, payload) {
    state.payload = payload
  },
  [SET_USER] (state, user) {
    state.user = user
  },
  [LOGOUT] (state) {
    state.payload = null
    state.accessToken = ''
    if (state.user) {
      state.user = null
    }
  }
}

const actions = {
  register ({commit}, user) {
    return userService.create(user)
      .then(user => {
        return user
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  login ({commit, dispatch}, data) {
    return feathersClient.authenticate(data)
      .then(response => {
        commit(SET_ACCESS_TOKEN, response.accessToken)

        return feathersClient.passport.verifyJWT(response.accessToken)
          .then(payload => {
            commit(SET_PAYLOAD, payload)

            if (payload.hasOwnProperty('userId')) {
              return dispatch('populateUser', payload.userId)
            }
            return response
          })
          .catch(error => {
            return Promise.reject(error)
          })
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  populateUser ({commit}, userId) {
    return userService.get(userId)
      .then(user => {
        commit(SET_USER, user)
        return user
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  logout ({commit}) {
    return feathersClient.logout()
      .then(response => {
        commit(LOGOUT)
        return response
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

const getters = {
  userId (state) {
    return state.user._id.toString()
  }
}

const authModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default authModule
