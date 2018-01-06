import feathersClient from '@/api/feathers-client'

const SET_PROCESS_MODELS = 'SET_PROCESS_MODELS'
const CREATE_PROCESS_MODEL = 'CREATE_PROCESS_MODEL'
const REMOVE_PROCESS_MODEL = 'REMOVE_PROCESS_MODEL'

const processModelsService = feathersClient.service('process-models')

const state = {
  processModels: []
}

const mutations = {
  [SET_PROCESS_MODELS] (state, payload) {
    state.processModels = payload
  },
  [CREATE_PROCESS_MODEL] (state, payload) {
    state.processModels.push(payload)
  },
  [REMOVE_PROCESS_MODEL] (state, payload) {
    const index = state.processModels.findIndex(el => el._id.toString() === payload._id.toString())
    if (index !== -1) {
      state.processModels.splice(index, 1)
    }
  }
}

const actions = {
  createProcessModel ({commit}, payload) {
    return processModelsService.create(payload)
      .then(result => {
        commit(CREATE_PROCESS_MODEL, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  removeProcessModel ({commit}, payload) {
    return processModelsService.remove(payload)
      .then(result => {
        commit(REMOVE_PROCESS_MODEL, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  patchProcessModel ({dispatch}, payload) {
    return processModelsService.patch(payload.id, payload.body)
      .then(() => {
        return dispatch('fetchProcessModels')
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchProcessModels ({rootGetters, commit}) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId']
      }
    }
    return processModelsService.find(params)
      .then(result => {
        return commit(SET_PROCESS_MODELS, result.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

const getters = {
  processModels (state) {
    return state.processModels
  },
  selectReadyProcessModels: (state) => (payload) => {
    const arr = []

    arr.push({
      text: 'No selection',
      value: null
    })

    state.processModels.forEach(el => {
      if (el.processGroup.toString() === payload.processGroupId.toString()) {
        if (typeof payload.processModelId !== 'undefined') {
          if (el._id.toString() !== payload.processModelId.toString() && el.parent.toString() !== payload.processModelId.toString()) {
            arr.push({
              text: el.name,
              value: el._id.toString()
            })
          }
        } else {
          arr.push({
            text: el.name,
            value: el._id.toString()
          })
        }
      }
    })

    return arr
  },
  getProcessModelById: (state) => (payload) => {
    return state.processModels.find(el => {
      if (el._id.toString() === payload.toString()) {
        return el
      }
    })
  },
  getProcessModelsByParentId: (state) => (payload) => {
    return state.processModels.filter(el => el.parent.toString() === payload.toString())
  }
}

const processModelsModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default processModelsModule
