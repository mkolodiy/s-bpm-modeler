import feathersClient from '@/api/feathers-client'

const SET_PROCESS_GROUPS = 'SET_PROCESS_GROUPS'
const CREATE_PROCESS_GROUP = 'CREATE_PROCESS_GROUP'
const REMOVE_PROCESS_GROUP = 'REMOVE_PROCESS_GROUP'

const processGroupsService = feathersClient.service('process-groups')

const state = {
  processGroups: []
}

const mutations = {
  [SET_PROCESS_GROUPS] (state, payload) {
    state.processGroups = payload
  },
  [CREATE_PROCESS_GROUP] (state, payload) {
    state.processGroups.push(payload)
  },
  [REMOVE_PROCESS_GROUP] (state, payload) {
    const index = state.processGroups.findIndex(el => el._id.toString() === payload._id.toString())
    if (index !== -1) {
      state.processGroups.splice(index, 1)
    }
  }
}

const actions = {
  createProcessGroup ({commit}, payload) {
    return processGroupsService.create(payload)
      .then(result => {
        commit(CREATE_PROCESS_GROUP, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  removeProcessGroup ({commit}, payload) {
    return processGroupsService.remove(payload)
      .then(result => {
        commit(REMOVE_PROCESS_GROUP, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  patchProcessGroup ({dispatch}, payload) {
    return processGroupsService.patch(payload.id, payload.body)
      .then(() => {
        return dispatch('fetchProcessGroups')
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchProcessGroups ({rootGetters, commit}) {
    const params = {
      query: {
        $limit: 9999,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId']
      }
    }
    return processGroupsService.find(params)
      .then(result => {
        return commit(SET_PROCESS_GROUPS, result.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

const getters = {
  processGroups (state) {
    return state.processGroups
  },
  selectReadyProcessGroups (state) {
    const arr = []

    arr.push({
      text: 'No selection',
      value: null
    })

    state.processGroups.map(el => {
      arr.push({
        text: el.name,
        value: el._id.toString()
      })
    })
    return arr
  },
  getProcessGroupById: (state) => (payload) => {
    return state.processGroups.find(el => {
      if (el._id.toString() === payload.toString()) {
        return el
      }
    })
  }
}

const processGroupsModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default processGroupsModule
