const SET_CURRENT_SELECTED_VIEW = 'SET_CURRENT_SELECTED_VIEW'
const SET_CURRENT_SELECTED_SUBJECT = 'SET_CURRENT_SELECTED_SUBJECT'
const SET_CURRENT_SELECTED_BEHAVIOR = 'SET_CURRENT_SELECTED_BEHAVIOR'
const SET_CURRENT_SELECTED_ELEMENT = 'SET_CURRENT_SELECTED_ELEMENT'
const SET_CURRENT_SELECTED_PROCESS_LAYER = 'SET_CURRENT_SELECTED_PROCESS_LAYER'
const SET_SBD_VIEW_ENABLED = 'SET_SBD_VIEW_ENABLED'

const state = {
  currentSelectedView: null,
  currentSelectedSubject: null,
  currentSelectedBehavior: null,
  currentSelectedElement: null,
  currentSelectedProcessLayer: null,
  sbdViewEnabled: false
}

const mutations = {
  [SET_CURRENT_SELECTED_VIEW] (state, currentSelectedView) {
    state.currentSelectedView = currentSelectedView
  },
  [SET_CURRENT_SELECTED_SUBJECT] (state, currentSelectedSubject) {
    state.currentSelectedSubject = currentSelectedSubject
  },
  [SET_CURRENT_SELECTED_BEHAVIOR] (state, currentSelectedBehavior) {
    state.currentSelectedBehavior = currentSelectedBehavior
  },
  [SET_CURRENT_SELECTED_ELEMENT] (state, currentSelectedElement) {
    state.currentSelectedElement = currentSelectedElement
  },
  [SET_CURRENT_SELECTED_PROCESS_LAYER] (state, currentSelectedProcessLayer) {
    state.currentSelectedProcessLayer = currentSelectedProcessLayer
  },
  [SET_SBD_VIEW_ENABLED] (state, sbdViewEnabled) {
    state.sbdViewEnabled = sbdViewEnabled
  }
}

const actions = {
  setCurrentSelectedView ({commit}, currentSelectedView) {
    commit(SET_CURRENT_SELECTED_VIEW, currentSelectedView)
  },
  setCurrentSelectedSubject ({commit}, currentSelectedSubject) {
    commit(SET_CURRENT_SELECTED_SUBJECT, currentSelectedSubject)
  },
  setCurrentSelectedBehavior ({commit}, currentSelectedBehavior) {
    commit(SET_CURRENT_SELECTED_BEHAVIOR, currentSelectedBehavior)
  },
  setCurrentSelectedElement ({commit}, currentSelectedElement) {
    commit(SET_CURRENT_SELECTED_ELEMENT, currentSelectedElement)
  },
  setCurrentSelectedProcessLayer ({commit}, currentSelectedProcessLayer) {
    commit(SET_CURRENT_SELECTED_PROCESS_LAYER, currentSelectedProcessLayer)
  },
  setSbdViewEnabled ({commit}, sbdViewEnabled) {
    commit(SET_SBD_VIEW_ENABLED, sbdViewEnabled)
  }
}

const getters = {
  currentSelectedView (state) {
    return state.currentSelectedView
  },
  currentSelectedSubject (state) {
    return state.currentSelectedSubject
  },
  currentSelectedSubjectId (state) {
    return state.currentSelectedSubject._id.toString()
  },
  currentSelectedBehavior (state) {
    return state.currentSelectedBehavior
  },
  currentSelectedElement (state) {
    return state.currentSelectedElement
  },
  currentSelectedProcessLayer (state) {
    return state.currentSelectedProcessLayer
  },
  sbdViewEnabled (state) {
    return state.sbdViewEnabled
  }
}

const modelerModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default modelerModule
