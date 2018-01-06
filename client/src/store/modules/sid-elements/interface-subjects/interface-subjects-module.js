import feathersClient from '@/api/feathers-client'

const SET_INTERFACE_SUBJECTS = 'SET_INTERFACE_SUBJECTS'
const CREATE_INTERFACE_SUBJECT = 'CREATE_INTERFACE_SUBJECT'
const REMOVE_INTERFACE_SUBJECT = 'REMOVE_INTERFACE_SUBJECT'

const interfaceSubjectsService = feathersClient.service('interface-subjects')

const state = {
  interfaceSubjects: []
}

const mutations = {
  [SET_INTERFACE_SUBJECTS] (state, payload) {
    state.interfaceSubjects = payload
  },
  [CREATE_INTERFACE_SUBJECT] (state, payload) {
    state.interfaceSubjects.push(payload)
  },
  [REMOVE_INTERFACE_SUBJECT] (state, payload) {
    const index = state.interfaceSubjects.findIndex((el) => {
      return el._id.toString() === payload._id.toString()
    })
    if (index !== -1) {
      state.interfaceSubjects.splice(index, 1)
    }
  }
}

const actions = {
  createInterfaceSubject ({commit}, payload) {
    return interfaceSubjectsService.create(payload)
      .then(result => {
        commit(CREATE_INTERFACE_SUBJECT, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  removeInterfaceSubject ({commit}, payload) {
    return interfaceSubjectsService.remove(payload)
      .then(result => {
        commit(REMOVE_INTERFACE_SUBJECT, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  patchInterfaceSubject ({dispatch}, payload) {
    return interfaceSubjectsService.patch(payload.id, payload.body)
      .then(() => {
        return dispatch('fetchInterfaceSubjects')
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchInterfaceSubjects ({rootGetters, commit}) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: rootGetters['modeler/currentSelectedProcessLayer']
      }
    }
    return interfaceSubjectsService.find(params)
      .then(result => {
        return commit(SET_INTERFACE_SUBJECTS, result.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchInterfaceSubjectsByParentId ({rootGetters}, payload) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: payload
      }
    }

    return interfaceSubjectsService.find(params)
      .then(result => {
        return result.data
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

const getters = {
  interfaceSubjects (state) {
    return state.interfaceSubjects
  },
  getInterfaceSubjectNameById: (state) => (subjectId) => {
    const subject = state.interfaceSubjects.find(el => el._id.toString() === subjectId)
    if (typeof subject !== 'undefined') {
      return subject.name
    }
  }
}

const interfaceSubjectsModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default interfaceSubjectsModule
