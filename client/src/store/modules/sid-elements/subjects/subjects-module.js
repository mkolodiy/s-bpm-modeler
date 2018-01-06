import feathersClient from '@/api/feathers-client'

const SET_SUBJECTS = 'SET_SUBJECTS'
const CREATE_SUBJECT = 'CREATE_SUBJECT'
const REMOVE_SUBJECT = 'REMOVE_SUBJECT'

const subjectsService = feathersClient.service('subjects')

const state = {
  subjects: []
}

const mutations = {
  [SET_SUBJECTS] (state, payload) {
    state.subjects = payload
  },
  [CREATE_SUBJECT] (state, payload) {
    state.subjects.push(payload)
  },
  [REMOVE_SUBJECT] (state, payload) {
    const index = state.subjects.findIndex((el) => {
      return el._id.toString() === payload._id.toString()
    })
    if (index !== -1) {
      state.subjects.splice(index, 1)
    }
  }
}

const actions = {
  createSubject ({commit}, payload) {
    return subjectsService.create(payload)
      .then(result => {
        commit(CREATE_SUBJECT, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  removeSubject ({commit}, payload) {
    return subjectsService.remove(payload)
      .then(result => {
        commit(REMOVE_SUBJECT, result)
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  patchSubject ({dispatch}, payload) {
    return subjectsService.patch(payload.id, payload.body)
      .then(() => {
        return dispatch('fetchSubjects')
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchSubjects ({rootGetters, commit}) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: rootGetters['modeler/currentSelectedProcessLayer']
      }
    }
    return subjectsService.find(params)
      .then(result => {
        return commit(SET_SUBJECTS, result.data)
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchSubjectsByParentId ({rootGetters}, payload) {
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: payload
      }
    }

    return subjectsService.find(params)
      .then(result => {
        return result.data
      })
      .catch(error => {
        return Promise.reject(error)
      })
  },
  fetchSubjectsByLayerId ({rootGetters}, payload) {
    // TODO
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId'],
        parent: payload.processLayerId
      }
    }
    const result = subjectsService.find(params)
      .then(result => {
        return result.data
      })
      .catch(error => {
        return Promise.reject(error)
      })

    return Promise.resolve(result)
      .then(result => {
        const arr = result.map(el => {
          return {
            text: el.name,
            value: el._id.toString()
          }
        })

        arr.unshift({
          text: 'No selection',
          value: null
        })

        return arr
      })
  },
  fetchSubjectById ({rootGetters}, payload) {
    // TODO
    const params = {
      query: {
        $limit: 2000,
        $sort: {createdAt: 1},
        creator: rootGetters['auth/userId']
      }
    }
    return subjectsService.get(payload.id, params)
      .then(result => {
        return result
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }
}

const getters = {
  subjects (state) {
    return state.subjects
  },
  getSubjectNameById: (state) => (subjectId) => {
    const subject = state.subjects.find(el => el._id.toString() === subjectId)
    if (typeof subject !== 'undefined') {
      return subject.name
    }
  }
}

const subjectsModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default subjectsModule
