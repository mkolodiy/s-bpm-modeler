import feathersClient from '@/api/feathers-client'

const SET_PROCESS_LAYERS = 'SET_PROCESS_LAYERS'
const CREATE_PROCESS_LAYER = 'CREATE_PROCESS_LAYER'
const REMOVE_PROCESS_LAYER = 'REMOVE_PROCESS_LAYER'

const processLayersService = feathersClient.service('process-layers')

const state = {
  processLayers: []
}

const mutations = {
  [SET_PROCESS_LAYERS] (state, payload) {
    state.processLayers = payload
  },
  [CREATE_PROCESS_LAYER] (state, payload) {
    state.processLayers.push(payload)
  },
  [REMOVE_PROCESS_LAYER] (state, payload) {
    const index = state.processLayers.findIndex(el => el._id.toString() === payload._id.toString())
    if (index !== -1) {
      state.processLayers.splice(index, 1)
    }
  }
}

const actions = {
  createProcessLayer ({commit}, payload) {
    return processLayersService.create(payload)
      .then(result => {
        commit(CREATE_PROCESS_LAYER, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  removeProcessLayer ({commit}, payload) {
    return processLayersService.remove(payload)
      .then(result => {
        commit(REMOVE_PROCESS_LAYER, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  patchProcessLayer ({commit, dispatch}, payload) {
    return processLayersService.patch(payload.id, payload.body)
      .then(() => {
        return dispatch('fetchProcessLayers')
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchProcessLayers ({rootGetters, commit}) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId']
      }
    }
    return processLayersService.find(params)
      .then(result => {
        return commit(SET_PROCESS_LAYERS, result.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

const getters = {
  processLayers (state) {
    return state.processLayers
  },
  getProcessLayerById: (state) => (payload) => {
    return state.processLayers.find(el => {
      if (el._id.toString() === payload.toString()) {
        return el
      }
    })
  },
  selectReadyProcessLayers: (state) => (payload) => {
    const arr = []

    arr.push({
      text: 'No selection',
      value: null
    })

    state.processLayers.forEach(el => {
      if (el.parent.toString() === payload.processModelId.toString()) {
        arr.push({
          text: el.name,
          value: el._id.toString()
        })
      }
    })

    return arr
  },
  getProcessLayersByParentId: (state) => (payload) => {
    return state.processLayers.filter(el => el.parent.toString() === payload.toString())
  }
}

const processLayersModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default processLayersModule
