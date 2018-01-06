function generateChildren (itemId, processModels, processLayers) {
  const filteredProcessModels = processModels.filter(processModel => processModel.parent.toString() === itemId)
  const children = []
  filteredProcessModels.forEach(processModel => {
    const filteredProcessLayers = []
    processLayers.forEach(processLayer => {
      if (processLayer.parent.toString() === processModel._id.toString()) {
        filteredProcessLayers.push({
          id: processLayer._id.toString(),
          name: processLayer.name
        })
      }
    })
    children.push({
      id: processModel._id.toString(),
      name: processModel.name,
      layers: filteredProcessLayers,
      models: generateChildren(processModel._id.toString(), processModels, processLayers)
    })
  })
  return children
}

function generateBreadcrumbsForProcessModels (processModels, processGroups, itemId) {
  let breadcrumbsData = []
  processModels.find(processModel => {
    if (processModel._id.toString() === itemId) {
      breadcrumbsData.push({
        itemId: processModel._id.toString(),
        itemName: processModel.name,
        itemType: 'processModel'
      })
      if (processModel.processGroup.toString() === processModel.parent.toString()) {
        processGroups.find(processGroup => {
          if (processGroup._id.toString() === processModel.parent.toString()) {
            breadcrumbsData.push({
              itemId: processGroup._id.toString(),
              itemName: processGroup.name,
              itemType: 'processGroup'
            })
          }
        })
      } else {
        breadcrumbsData = breadcrumbsData.concat(generateBreadcrumbsForProcessModels(processModels, processGroups, processModel.parent.toString()))
      }
    }
  })

  return breadcrumbsData
}

const SET_TREE_DATA = 'SET_TREE_DATA'
const SET_CURRENT_SELECTION = 'SET_CURRENT_SELECTION'
const SET_BREADCRUMBS_DATA = 'SET_BREADCRUMBS_DATA'
const SET_DATA_LOADING = 'SET_DATA_LOADING'

const state = {
  treeData: [],
  currentSelection: null,
  breadcrumbsData: [],
  dataLoading: false
}

const mutations = {
  [SET_TREE_DATA] (state, payload) {
    state.treeData = payload
  },
  [SET_CURRENT_SELECTION] (state, payload) {
    state.currentSelection = payload
  },
  [SET_BREADCRUMBS_DATA] (state, payload) {
    state.breadcrumbsData = payload
  },
  [SET_DATA_LOADING] (state, payload) {
    state.dataLoading = payload
  }
}

const actions = {
  generateTreeData ({rootGetters, commit}) {
    const treeData = []

    const processGroups = rootGetters['processGroups/processGroups']
    const processModels = rootGetters['processModels/processModels']
    const processLayers = rootGetters['processLayers/processLayers']

    processGroups.forEach(el => {
      treeData.push({
        id: el._id.toString(),
        name: el.name,
        models: generateChildren(el._id.toString(), processModels, processLayers)
      })
    })
    commit(SET_TREE_DATA, treeData)
  },
  generateBreadcrumbsData ({rootGetters, state, commit}) {
    let breadcrumbsData = []

    const currentSelection = state.currentSelection

    const processGroups = rootGetters['processGroups/processGroups']
    const processModels = rootGetters['processModels/processModels']
    const processLayers = rootGetters['processLayers/processLayers']

    if (currentSelection.itemType === 'processGroup') {
      breadcrumbsData.push(currentSelection)
    }

    if (currentSelection.itemType === 'processModel') {
      breadcrumbsData = generateBreadcrumbsForProcessModels(processModels, processGroups, currentSelection.itemId)
    }

    if (currentSelection.itemType === 'processLayer') {
      processLayers.find(el => {
        if (el._id.toString() === currentSelection.itemId) {
          breadcrumbsData = generateBreadcrumbsForProcessModels(processModels, processGroups, el.parent)
        }
      })
      breadcrumbsData.unshift(currentSelection)
    }

    return commit(SET_BREADCRUMBS_DATA, breadcrumbsData.reverse())
  },
  setCurrentSelection ({commit}, payload) {
    return commit(SET_CURRENT_SELECTION, payload)
  },
  generateOwlData ({rootGetters, dispatch}, payload) {
    const owlData = {}

    // Process groups
    const processGroups = []
    payload.forEach(el => processGroups.push(rootGetters['processGroups/getProcessGroupById'](el)))
    owlData.processGroups = processGroups

    // Process models
    let processModels = []
    owlData.processGroups.forEach(processGroup => {
      processModels = [].concat(processModels, rootGetters['processModels/getProcessModelsByParentId'](processGroup._id.toString()))
    })
    owlData.processModels = processModels

    // Process layers
    let processLayers = []
    owlData.processModels.forEach(processModel => {
      processLayers = [].concat(processLayers, rootGetters['processLayers/getProcessLayersByParentId'](processModel._id.toString()))
    })
    owlData.processLayers = processLayers

    // Subjects
    let subjects = []
    owlData.processLayers.forEach(processLayer => {
      subjects = [].concat(subjects, dispatch('subjects/fetchSubjectsByParentId', processLayer._id.toString(), {root: true}))
    })

    // Interface subjects
    let interfaceSubjects = []
    owlData.processLayers.forEach(processLayer => {
      interfaceSubjects = [].concat(interfaceSubjects, dispatch('interfaceSubjects/fetchInterfaceSubjectsByParentId', processLayer._id.toString(), {root: true}))
    })

    // Message exchanges
    let messageExchanges = []
    owlData.processLayers.forEach(processLayer => {
      messageExchanges = [].concat(messageExchanges, dispatch('messageExchanges/fetchMessageExchangesByParentId', processLayer._id.toString(), {root: true}))
    })

    // Message specifications
    let messageSpecifications = []
    owlData.processLayers.forEach(processLayer => {
      messageSpecifications = [].concat(messageSpecifications, dispatch('messageSpecifications/fetchMessageSpecificationsByParentId', processLayer._id.toString(), {root: true}))
    })

    return Promise.all(subjects)
      .then(subjects => {
        let arr = []
        subjects.forEach(el => {
          arr = [].concat(arr, el)
        })
        owlData.subjects = arr
      })
      .then(() => Promise.all(interfaceSubjects))
      .then(interfaceSubjects => {
        let arr = []
        interfaceSubjects.forEach(el => {
          arr = [].concat(arr, el)
        })
        owlData.interfaceSubjects = arr
      })
      .then(() => Promise.all(messageExchanges))
      .then(messageExchanges => {
        let arr = []
        messageExchanges.forEach(el => {
          arr = [].concat(arr, el)
        })
        owlData.messageExchanges = arr
      })
      .then(() => Promise.all(messageSpecifications))
      .then(messageSpecifications => {
        let arr = []
        messageSpecifications.forEach(el => {
          arr = [].concat(arr, el)
        })
        owlData.messageSpecifications = arr
      })
      .then(() => {
        // States
        let states = []
        owlData.subjects.forEach(subject => {
          states = [].concat(states, dispatch('states/fetchStatesByParentId', subject._id.toString(), {root: true}))
        })
        return Promise.all(states)
      })
      .then(states => {
        let arr = []
        states.forEach(el => {
          arr = [].concat(arr, el)
        })
        owlData.states = arr
      })
      .then(() => {
        // Send transitions
        let sendTransitions = []
        owlData.subjects.forEach(subject => {
          sendTransitions = [].concat(sendTransitions, dispatch('sendTransitions/fetchSendTransitionsByParentId', subject._id.toString(), {root: true}))
        })
        return Promise.all(sendTransitions)
      })
      .then(sendTransitions => {
        let arr = []
        sendTransitions.forEach(el => {
          arr = [].concat(arr, el)
        })
        owlData.sendTransitions = arr
      })
      .then(() => {
        // Receive transitions
        let receiveTransitions = []
        owlData.subjects.forEach(subject => {
          receiveTransitions = [].concat(receiveTransitions, dispatch('receiveTransitions/fetchReceiveTransitionsByParentId', subject._id.toString(), {root: true}))
        })
        return Promise.all(receiveTransitions)
      })
      .then(receiveTransitions => {
        let arr = []
        receiveTransitions.forEach(el => {
          arr = [].concat(arr, el)
        })
        owlData.receiveTransitions = arr
      })
      .then(() => {
        // Function transitions
        let functionTransitions = []
        owlData.subjects.forEach(subject => {
          functionTransitions = [].concat(functionTransitions, dispatch('functionTransitions/fetchFunctionTransitionsByParentId', subject._id.toString(), {root: true}))
        })
        return Promise.all(functionTransitions)
      })
      .then(functionTransitions => {
        let arr = []
        functionTransitions.forEach(el => {
          arr = [].concat(arr, el)
        })
        owlData.functionTransitions = arr
      })
      .then(() => owlData)
  },
  setDataLoading ({commit}, payload) {
    return commit(SET_DATA_LOADING, payload)
  }
}

const getters = {
  treeData (state) {
    return state.treeData
  },
  currentSelection (state) {
    return state.currentSelection
  },
  breadcrumbsData (state) {
    return state.breadcrumbsData
  },
  dataLoading (state) {
    return state.dataLoading
  }
}

const commonModule = {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default commonModule
