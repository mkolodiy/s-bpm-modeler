import rdflibConstants from '@/rdflib-services/rdflib-constants'
import * as StringBuilder from 'stringbuilder'
import dateformat from 'dateformat'
import jointOptions from '@/joint-services/joint-options'

const descriptors = {
  processModel: {
    type: 'PASSProcessModel',
    id: 'hasModelComponentID',
    name: 'hasModelComponentLabel',
    referenceToElement: 'contains'
  },
  processLayer: {
    type: 'ModelLayer',
    id: 'hasModelComponentID',
    name: 'hasModelComponentLabel',
    referenceToElement: 'contains'
  },
  subject: {
    type: 'FullySpecifiedSingleSubject',
    id: 'hasModelComponentID',
    name: 'hasModelComponentLabel',
    referenceToBehavior: 'containsBehavior',
    referenceToBaseBehavior: 'containsBaseBehavior',
    referenceToVisualRepresentation: 'hasVisualRepresentation'
  },
  interfaceSubject: {
    type: 'InterfaceSubject',
    id: 'hasModelComponentID',
    name: 'hasModelComponentLabel',
    referenceToElement: 'references',
    referenceToVisualRepresentation: 'hasVisualRepresentation'
  },
  messageSpecification: {
    type: 'MessageSpecification',
    id: 'hasModelComponentID',
    name: 'hasModelComponentLabel'
  },
  messageExchange: {
    type: 'MessageExchange',
    id: 'hasModelComponentID',
    name: 'hasModelComponentLabel',
    referenceToSender: 'hasSender',
    referenceToReceiver: 'hasReceiver',
    referenceToMessage: 'hasMessageType',
    referenceToVisualRepresentation: 'hasVisualRepresentation'
  },
  messageExchangeList: {
    type: 'MessageExchangeList',
    id: 'hasModelComponentID',
    name: 'hasModelComponentLabel',
    referenceToElement: 'contains'
  },
  behavior: {
    type: 'SubjectBehavior',
    id: 'hasModelComponentID',
    name: 'hasModelComponentLabel',
    referenceToInitialState: 'hasInitialState',
    referenceToEndState: 'hasEndState',
    referenceToElement: 'contains'
  },
  state: {
    type: {
      send: 'SendState',
      receive: 'ReceiveState',
      function: 'DoState',
      initial: 'InitialState',
      end: 'EndState'
    },
    id: 'hasModelComponentID',
    name: 'hasModelComponentLabel',
    referenceToVisualRepresentation: 'hasVisualRepresentation'
  },
  sendTransition: {
    type: 'SendTransition',
    id: 'hasModelComponentID',
    name: 'hasModelComponentLabel',
    referenceToSourceState: 'hasSourceState',
    referenceToTargetState: 'hasTargetState',
    referenceToElement: 'refersTo',
    referenceToVisualRepresentation: 'hasVisualRepresentation'
  },
  receiveTransition: {
    type: 'ReceiveTransition',
    id: 'hasModelComponentID',
    name: 'hasModelComponentLabel',
    referenceToSourceState: 'hasSourceState',
    referenceToTargetState: 'hasTargetState',
    referenceToElement: 'refersTo',
    referenceToVisualRepresentation: 'hasVisualRepresentation'
  },
  functionTransition: {
    type: 'DoTransition',
    id: 'hasModelComponentID',
    name: 'hasModelComponentLabel',
    referenceToSourceState: 'hasSourceState',
    referenceToTargetState: 'hasTargetState',
    referenceToVisualRepresentation: 'hasVisualRepresentation'
  },
  action: {
    type: 'Action',
    id: 'hasModelComponentID',
    name: 'hasModelComponentLabel',
    referenceToElement: 'contains'
  },
  nodeRepresentation: {
    type: 'NodeRepresentation',
    id: 'hasId',
    name: 'hasLabel',
    referenceToCoordinates: 'hasCoordinates',
    referenceToMeasurements: 'hasMeasurements'
  },
  linkRepresentation: {
    type: 'LinkRepresentation',
    id: 'hasId',
    name: 'hasLabel',
    referenceToSourceNode: 'hasSourceNode',
    referenceToTargetNode: 'hasTargetNode',
    referenceContainsVertex: 'containsVertex'
  },
  coordinates: {
    type: 'Coordinates',
    id: 'hasId',
    name: 'hasLabel',
    xCoordinate: 'hasXCoordinate',
    yCoordinate: 'hasYCoordinate'
  },
  measurements: {
    type: 'Measurements',
    id: 'hasId',
    name: 'hasLabel',
    height: 'hasHeight',
    width: 'hasWidth'
  },
  vertex: {
    type: 'Vertex',
    id: 'hasId',
    name: 'hasLabel',
    referenceToCoordinates: 'hasCoordinates'
  }
}

const constants = {
  SPO: 'standard-pass-ont',
  SPO_URI: 'http://www.i2pm.net/standard-pass-ont#',
  APO: 'abstract-pass-ont',
  APO_URI: 'http://www.imi.kit.edu/abstract-pass-ont#',
  FILE_URI: null,
  PAGE_URI: 'http://www.s-bpm-ont.at'
}

const serviceState = {
  owlData: null,
  includeVisualRepresentation: false,
  owlVisualRepresentation: {
    nodeRepresentation: [],
    linkRepresentation: [],
    coordinates: [],
    measurements: [],
    vertices: []
  }
}

class StandardExportService {
  export (owlData, includeVisualRepresentation) {
    StringBuilder.extend('string')
    serviceState.owlData = this.prepareOwlData(owlData)
    serviceState.includeVisualRepresentation = includeVisualRepresentation
    console.log(serviceState.owlData)
    return this.buildOwlFiles()
  }

  /***************************************************
   *************** PREPARE OWL DATA ******************
   ***************************************************/

  prepareOwlData (owlData) {
    // Message Specifications
    const messageSpecifications = this.prepareMessageSpecifications(owlData.messageSpecifications)

    // Message Connection - contains Message Exchanges and Message Exchange Lists
    const messageConnection = this.prepareMessageConnection(owlData.messageExchanges, owlData.subjects, owlData.interfaceSubjects)

    // States
    const states = this.prepareStates(owlData.states)

    // Send Transitions
    const sendTransitions = this.prepareSendTransitions(owlData.sendTransitions, owlData.states, messageConnection.messageExchanges)

    // Receive Transitions
    const receiveTransitions = this.prepareReceiveTransitions(owlData.receiveTransitions, owlData.states, messageConnection.messageExchanges)

    // Function Transitions
    const functionTransitions = this.prepareFunctionTransitions(owlData.functionTransitions, owlData.states)

    // Actions
    const actions = this.prepareActions(states, sendTransitions, receiveTransitions, functionTransitions)

    // Behaviors
    const behaviors = this.prepareBehaviors(owlData.subjects, owlData.states, owlData.sendTransitions, owlData.receiveTransitions, owlData.functionTransitions)

    // Subjects
    const subjects = this.prepareSubjects(owlData.subjects, behaviors)

    // Interface Subjects
    const interfaceSubjects = this.prepareInterfaceSubjects(owlData.interfaceSubjects)

    // Process Layers
    const processLayers = this.prepareProcessLayers(owlData.processLayers, subjects, behaviors, interfaceSubjects, messageConnection, messageSpecifications)

    // Process Models
    const processModels = this.prepareProcessModels(owlData.processModels)

    // Process Groups
    const processGroups = this.prepareProcessGroups(owlData.processGroups)

    const preparedData = {
      messageSpecifications: messageSpecifications,
      messageConnection: messageConnection,
      states: states,
      sendTransitions: sendTransitions,
      receiveTransitions: receiveTransitions,
      functionTransitions: functionTransitions,
      actions: actions,
      behaviors: behaviors,
      subjects: subjects,
      interfaceSubjects: interfaceSubjects,
      processLayers: processLayers,
      processModels: processModels,
      processGroups: processGroups
    }

    return preparedData
  }

  prepareMessageSpecifications (messageSpecifications) {
    return messageSpecifications.map(messageSpecification => {
      return {
        id: messageSpecification._id,
        name: messageSpecification.name,
        processLayer: messageSpecification.parent
      }
    })
  }

  prepareMessageConnection (messageConnections, subjects, interfaceSubjects) {
    const getSubjectId = (complementaryId) => {
      let subject = subjects.find(el => el.canvasId === complementaryId)
      if (typeof subject === 'undefined') {
        subject = interfaceSubjects.find(el => el.canvasId === complementaryId)
      }
      return subject._id
    }

    let messageExchanges = []
    const messageExchangeLists = []

    messageConnections.forEach(messageExchange => {
      const sourceToTarget = []
      messageExchange.sourceToTargetMessageSpecifications.forEach(el => {
        sourceToTarget.push({
          id: this.generateRandonAlphanumericString(),
          name: 'Message Exchange',
          senderId: getSubjectId(messageExchange.source.id),
          receiverId: getSubjectId(messageExchange.target.id),
          messageSpecificationId: el._id,
          processLayer: messageExchange.parent,
          visualRepresentation: this.createLinkRepresentation(messageExchange.vertices, getSubjectId(messageExchange.source.id), getSubjectId(messageExchange.target.id))
        })
      })

      const messageExchangeListFromSource = {
        id: this.generateRandonAlphanumericString(),
        name: 'Message Exchange List',
        elements: sourceToTarget.map(el => el.id),
        processLayer: messageExchange.parent
      }

      messageExchangeLists.push(messageExchangeListFromSource)

      messageExchanges = [].concat(messageExchanges, sourceToTarget)

      if (messageExchange.isBidirectional) {
        const targetToSource = []
        messageExchange.targetToSourceMessageSpecifications.forEach(el => {
          targetToSource.push({
            id: this.generateRandonAlphanumericString(),
            name: 'Message Exchange',
            senderId: getSubjectId(messageExchange.target.id),
            receiverId: getSubjectId(messageExchange.source.id),
            messageSpecificationId: el._id,
            processLayer: messageExchange.parent,
            visualRepresentation: this.createLinkRepresentation([], getSubjectId(messageExchange.source.id), getSubjectId(messageExchange.target.id))
          })
        })

        const messageExchangeListFromTarget = {
          id: this.generateRandonAlphanumericString(),
          name: 'Message Exchange List',
          elements: targetToSource.map(el => el.id),
          processLayer: messageExchange.parent
        }

        messageExchangeLists.push(messageExchangeListFromTarget)

        messageExchanges = [].concat(messageExchanges, targetToSource)
      }
    })

    return {
      messageExchanges: messageExchanges,
      messageExchangeLists: messageExchangeLists
    }
  }

  prepareStates (states) {
    return states.map(state => {
      return {
        id: state._id,
        name: state.name,
        isInitial: state.startState,
        isEnd: state.endState,
        type: state.type,
        subjectId: state.parent,
        visualRepresentation: this.createNodeRepresentation(state.position, state.size)
      }
    })
  }

  prepareSendTransitions (sendTransitions, states, messageExchanges) {
    const getStateId = (complementaryId) => {
      return states.find(el => el.canvasId === complementaryId)._id
    }
    const getMessageExchangeId = (messageSpecificationId) => {
      return messageExchanges.find(el => el.messageSpecificationId === messageSpecificationId).id
    }

    return sendTransitions.map(sendTransition => {
      return {
        id: sendTransition._id,
        name: 'Send Transition',
        subjectId: sendTransition.parent,
        sourceStateId: getStateId(sendTransition.source.id),
        targetStateId: getStateId(sendTransition.target.id),
        messageExchangeId: getMessageExchangeId(sendTransition.messageSpecification),
        visualRepresentation: this.createLinkRepresentation(sendTransition.vertices, getStateId(sendTransition.source.id), getStateId(sendTransition.target.id))
      }
    })
  }

  prepareReceiveTransitions (receiveTransitions, states, messageExchanges) {
    const getStateId = (complementaryId) => {
      return states.find(el => el.canvasId === complementaryId)._id
    }
    const getMessageExchangeId = (messageSpecificationId) => {
      return messageExchanges.find(el => el.messageSpecificationId === messageSpecificationId).id
    }

    return receiveTransitions.map(receiveTransition => {
      return {
        id: receiveTransition._id,
        name: 'Receive Transition',
        subjectId: receiveTransition.parent,
        sourceStateId: getStateId(receiveTransition.source.id),
        targetStateId: getStateId(receiveTransition.target.id),
        messageExchangeId: getMessageExchangeId(receiveTransition.messageSpecification),
        visualRepresentation: this.createLinkRepresentation(receiveTransition.vertices, getStateId(receiveTransition.source.id), getStateId(receiveTransition.target.id))
      }
    })
  }

  prepareFunctionTransitions (functionTransitions, states) {
    const getStateId = (complementaryId) => {
      return states.find(el => el.canvasId === complementaryId)._id
    }

    return functionTransitions.map(functionTransition => {
      return {
        id: functionTransition._id,
        name: functionTransition.name,
        subjectId: functionTransition.parent,
        sourceStateId: getStateId(functionTransition.source.id),
        targetStateId: getStateId(functionTransition.target.id),
        visualRepresentation: this.createLinkRepresentation(functionTransition.vertices, getStateId(functionTransition.source.id), getStateId(functionTransition.target.id))
      }
    })
  }

  prepareActions (states, sendTransitions, receiveTransitions, functionTransitions) {
    const getSendTransitionsIds = (stateId) => {
      return sendTransitions
        .filter(sendTransition => sendTransition.sourceStateId === stateId)
        .map(sendTransition => sendTransition.id)
    }
    const getReceiveTransitionsIds = (stateId) => {
      return receiveTransitions
        .filter(receiveTransition => receiveTransition.sourceStateId === stateId)
        .map(receiveTransition => receiveTransition.id)
    }
    const getFunctionTransitionsIds = (stateId) => {
      return functionTransitions
        .filter(functionTransition => functionTransition.sourceStateId === stateId)
        .map(functionTransition => functionTransition.id)
    }

    const actions = []

    states.forEach(state => {
      const action = {
        id: this.generateRandonAlphanumericString(),
        name: 'Action',
        elements: [],
        subjectId: state.subjectId
      }

      action.elements.push(state.id)
      action.elements = [].concat(action.elements, getSendTransitionsIds(state.id))
      action.elements = [].concat(action.elements, getReceiveTransitionsIds(state.id))
      action.elements = [].concat(action.elements, getFunctionTransitionsIds(state.id))

      actions.push(action)
    })

    return actions
  }

  prepareBehaviors (subjects, states, sendTransitions, receiveTransitions, functionTransitions) {
    const getStates = (subjectId) => {
      return states.filter(state => state.parent === subjectId).map(state => state._id)
    }
    const getSendTransitions = (subjectId) => {
      return sendTransitions.filter(sendTransition => sendTransition.parent === subjectId).map(sendTransition => sendTransition._id)
    }
    const getReceiveTransitions = (subjectId) => {
      return receiveTransitions.filter(receiveTransition => receiveTransition.parent === subjectId).map(receiveTransition => receiveTransition._id)
    }
    const getFunctionTransitions = (subjectId) => {
      return functionTransitions.filter(functionTransition => functionTransition.parent === subjectId).map(functionTransition => functionTransition._id)
    }

    return subjects.map(subject => {
      const behavior = {
        id: this.generateRandonAlphanumericString(),
        name: 'SBD: {0}'.format(subject.name),
        subjectId: subject._id,
        elements: [],
        processLayer: subject.parent
      }

      behavior.elements = [].concat(behavior.elements, getStates(subject._id))
      behavior.elements = [].concat(behavior.elements, getSendTransitions(subject._id))
      behavior.elements = [].concat(behavior.elements, getReceiveTransitions(subject._id))
      behavior.elements = [].concat(behavior.elements, getFunctionTransitions(subject._id))

      return behavior
    })
  }

  prepareSubjects (subjects, behaviors) {
    const getBehavior = (subjectId) => {
      return behaviors.find(el => el.subjectId === subjectId).id
    }

    return subjects.map(subject => {
      return {
        id: subject._id,
        name: subject.name,
        behavior: getBehavior(subject._id),
        processLayer: subject.parent,
        visualRepresentation: this.createNodeRepresentation(subject.position, subject.size)
      }
    })
  }

  prepareInterfaceSubjects (interfaceSubjects) {
    return interfaceSubjects.map(subject => {
      return {
        id: subject._id,
        name: subject.name,
        reference: subject.reference,
        processLayer: subject.parent,
        visualRepresentation: this.createNodeRepresentation(subject.position, subject.size)
      }
    })
  }

  prepareProcessGroups (processGroups) {
    return processGroups.map(processGroup => {
      return {
        id: processGroup._id,
        name: processGroup.name
      }
    })
  }

  prepareProcessLayers (processLayers, subjects, behaviors, interfaceSubjects, messageConnection, messageSpecifications) {
    const getSubjects = (processLayerId) => {
      return subjects.filter(subject => subject.processLayer === processLayerId).map(subject => subject.id)
    }
    const getBehaviors = (processLayerId) => {
      return behaviors.filter(behavior => behavior.processLayer === processLayerId).map(behavior => behavior.id)
    }
    const getInterfaceSubjects = (processLayerId) => {
      return interfaceSubjects.filter(subject => subject.processLayer === processLayerId).map(subject => subject.id)
    }
    const getMessageExchangeLists = (processLayerId) => {
      return messageConnection.messageExchangeLists
        .filter(messageExchangeList => messageExchangeList.processLayer === processLayerId)
        .map(messageExchangeList => messageExchangeList.id)
    }
    const getMessageExchange = (processLayerId) => {
      return messageConnection.messageExchanges
        .filter(messageExchange => messageExchange.processLayer === processLayerId)
        .map(messageExchange => messageExchange.id)
    }
    const getMessageSpecifications = (processLayerId) => {
      return messageSpecifications
        .filter(messageSpecification => messageSpecification.processLayer === processLayerId)
        .map(messageSpecification => messageSpecification.id)
    }

    return processLayers.map(el => {
      const processLayer = {
        id: el._id,
        name: el.name,
        elements: [],
        processModel: el.parent
      }

      processLayer.elements = [].concat(processLayer.elements, getSubjects(el._id))
      processLayer.elements = [].concat(processLayer.elements, getBehaviors(el._id))
      processLayer.elements = [].concat(processLayer.elements, getInterfaceSubjects(el._id))
      processLayer.elements = [].concat(processLayer.elements, getMessageExchangeLists(el._id))
      processLayer.elements = [].concat(processLayer.elements, getMessageExchange(el._id))
      processLayer.elements = [].concat(processLayer.elements, getMessageSpecifications(el._id))

      return processLayer
    })
  }

  prepareProcessModels (processModels) {
    return processModels.map(processModel => {
      return {
        id: processModel._id,
        name: processModel.name,
        processGroup: processModel.processGroup
      }
    })
  }

  createNodeRepresentation (position, size) {
    const nodeRepresentation = {
      id: this.generateRandonAlphanumericString(),
      name: 'Node Representation',
      coordinates: this.createCoordinates(position),
      measurements: this.createMeasurements(size)
    }

    serviceState.owlVisualRepresentation.nodeRepresentation.push(nodeRepresentation)
    return nodeRepresentation.id
  }

  createLinkRepresentation (vertices, sourceId, targetId) {
    const linkRepresentation = {
      id: this.generateRandonAlphanumericString(),
      name: 'Link Representation',
      source: sourceId,
      target: targetId,
      vertices: this.createVertices(vertices)
    }

    serviceState.owlVisualRepresentation.linkRepresentation.push(linkRepresentation)
    return linkRepresentation.id
  }

  createVertices (vertices) {
    const verticesIds = []
    vertices.forEach(el => {
      const vertex = {
        id: this.generateRandonAlphanumericString(),
        name: 'Vertex',
        coordinates: this.createCoordinates(el)
      }
      serviceState.owlVisualRepresentation.vertices.push(vertex)
      verticesIds.push(vertex.id)
    })

    return verticesIds
  }

  createCoordinates (position) {
    const coordinates = {
      id: this.generateRandonAlphanumericString(),
      name: 'Coordinates',
      xCoordinate: position.x,
      yCoordinate: position.y
    }

    serviceState.owlVisualRepresentation.coordinates.push(coordinates)
    return coordinates.id
  }

  createMeasurements (size) {
    const measurements = {
      id: this.generateRandonAlphanumericString(),
      name: 'Measurements',
      height: size.height,
      width: size.width
    }

    serviceState.owlVisualRepresentation.measurements.push(measurements)
    return measurements.id
  }

  generateRandonAlphanumericString () {
    var text = ''
    var possible = 'abcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < 24; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
  }

  /***************************************************
   *************** GENERATE OWL FILE *****************
   ***************************************************/

  prepareOwlFile () {
    const owlFile = new StringBuilder({newline: '\r\n'})

    const entities = new StringBuilder({newline: '\r\n'})
    const ENTITY = '<!ENTITY {0} "{1}" >'

    entities
      .append(rdflibConstants.SINGLE_TAB).appendLine(ENTITY, rdflibConstants.OWL, rdflibConstants.OWL_URI)
      .append(rdflibConstants.SINGLE_TAB).appendLine(ENTITY, rdflibConstants.XSD, rdflibConstants.XSD_URI)
      .append(rdflibConstants.SINGLE_TAB).appendLine(ENTITY, rdflibConstants.RDFS, rdflibConstants.RDFS_URI)
      .append(rdflibConstants.SINGLE_TAB).appendLine(ENTITY, rdflibConstants.RDF, rdflibConstants.RDF_URI)

    // TODO Append loaded ontologies
    entities
      .append(rdflibConstants.SINGLE_TAB).appendLine(ENTITY, constants.SPO, constants.SPO_URI)
      .append(rdflibConstants.SINGLE_TAB).appendLine(ENTITY, constants.APO, constants.APO_URI)

    owlFile
      .appendLine('<?xml version="1.0"?>')
      .appendLine('<!DOCTYPE rdf:RDF [')
      .append(entities)
      .appendLine(']>')

    return owlFile
  }

  buildOwlFiles () {
    const owlFiles = []

    // Start building process groups
    serviceState.owlData.processGroups.forEach(processGroup => {
      owlFiles.push({
        name: processGroup.name,
        file: this.buildOwlFile(processGroup)
      })
    })

    return owlFiles
  }

  buildOwlFile (processGroup) {
    /* Create file URI */
    constants.FILE_URI = '{0}/{1}#'.format(constants.PAGE_URI, this.removeWhitespaces(processGroup.name))

    /* Create file attributes */
    const staticAttr = new StringBuilder({newline: '\r\n'})
    staticAttr
      .append(rdflibConstants.SINGLE_TAB).appendLine(rdflibConstants.ATTR, rdflibConstants.XMLNS, rdflibConstants.OWL, rdflibConstants.OWL_URI)
      .append(rdflibConstants.SINGLE_TAB).appendLine(rdflibConstants.ATTR, rdflibConstants.XMLNS, rdflibConstants.XSD, rdflibConstants.XSD_URI)
      .append(rdflibConstants.SINGLE_TAB).appendLine(rdflibConstants.ATTR, rdflibConstants.XMLNS, rdflibConstants.RDFS, rdflibConstants.RDFS_URI)
      .append(rdflibConstants.SINGLE_TAB).appendLine(rdflibConstants.ATTR, rdflibConstants.XMLNS, rdflibConstants.RDF, rdflibConstants.RDF_URI)
      .append(rdflibConstants.SINGLE_TAB).appendLine('{0}="{1}"', rdflibConstants.XMLNS, constants.FILE_URI)

    // TODO
    const dynamicAttr = new StringBuilder({newline: '\r\n'})
    dynamicAttr
      .append(rdflibConstants.SINGLE_TAB).appendLine(rdflibConstants.ATTR, rdflibConstants.XMLNS, constants.SPO, constants.SPO_URI)
      .append(rdflibConstants.SINGLE_TAB).append(rdflibConstants.ATTR, rdflibConstants.XMLNS, constants.APO, constants.APO_URI)

    /* Prepare owl file */
    const owlFile = this.prepareOwlFile()

    /* Get process group as owl */
    const processGroupAsOwl = this.processGroupToOwl(processGroup)

    /* Start building */
    // Start
    owlFile
      .appendLine(rdflibConstants.SPLIT_START_TAG.P1, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RDF)
      .append(staticAttr)
      .append(dynamicAttr)
      .appendLine(rdflibConstants.SPLIT_START_TAG.P2)

    // Content
    owlFile.append(processGroupAsOwl)

    // End
    owlFile.appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RDF)

    return owlFile
  }

  processGroupToOwl (processGroup) {
    /* Get process models as owl */
    const processModels = serviceState.owlData.processModels.filter(processModel => processModel.processGroup === processGroup.id)
    const processModelsAsOwl = processModels.map(processModel => this.processModelToOwl(processModel))

    /* Prepare string builder for writing process group related data */
    const processGroupAsOwl = new StringBuilder({newline: '\r\n'})

    /* Start building */
    // Start
    processGroupAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.ONTOLOGY, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, constants.FILE_URI))

    // Static content
    processGroupAsOwl
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.VERSION_IRI, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}/{1}'.format(constants.FILE_URI, dateformat(new Date(), 'dd-mm-yyyy'))))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.VERSION_IRI)

    // Dynamic content
    // TODO Append loaded ontologies
    processGroupAsOwl
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.IMPORTS, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, constants.SPO_URI))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.IMPORTS)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.IMPORTS, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, constants.APO_URI))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.IMPORTS)

    // End
    processGroupAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.ONTOLOGY)

    // Corresponding elements
    processModelsAsOwl.forEach(processModelAsOwl => processGroupAsOwl.append(processModelAsOwl))

    return processGroupAsOwl
  }

  processModelToOwl (processModel) {
    /* Get process layers as owl */
    const processLayers = serviceState.owlData.processLayers.filter(processLayer => processLayer.processModel === processModel.id)
    const processLayersAsOwl = processLayers.map(processLayer => this.processLayerToOwl(processLayer))

    /* Prepare string builder for writing process model related data */
    const processModelAsOwl = new StringBuilder({newline: '\r\n'})

    /* Start building */
    // Start
    processModelAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(processModel.id)))

    // Process model attributes
    processModelAsOwl.append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.processModel.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.processModel.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(processModel.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.processModel.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.processModel.name)
      .append(processModel.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.processModel.name)

    // Process layers
    processLayers.forEach(processLayer => {
      processModelAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.processModel.referenceToElement, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(processLayer.id)))
        .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.processModel.referenceToElement)

      processLayer.elements.forEach(el => {
        processModelAsOwl
          .append(rdflibConstants.DOUBLE_TAB)
          .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.processModel.referenceToElement, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(el)))
          .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.processModel.referenceToElement)
      })
    })

    // End
    processModelAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    // Corresponding elements
    processLayersAsOwl.forEach(processLayerAsOwl => processModelAsOwl.append(processLayerAsOwl))

    return processModelAsOwl
  }

  processLayerToOwl (processLayer) {
    const subjects = serviceState.owlData.subjects.filter(subject => subject.processLayer === processLayer.id)
    const behaviors = serviceState.owlData.behaviors.filter(behavior => behavior.processLayer === processLayer.id)
    const interfaceSubjects = serviceState.owlData.interfaceSubjects.filter(subject => subject.processLayer === processLayer.id)
    const messageSpecifications = serviceState.owlData.messageSpecifications.filter(messageSpecification => messageSpecification.processLayer === processLayer.id)
    const messageExchanges = serviceState.owlData.messageConnection.messageExchanges.filter(messageExchange => messageExchange.processLayer === processLayer.id)
    const messageExchangeLists = serviceState.owlData.messageConnection.messageExchangeLists.filter(messageExchangeList => messageExchangeList.processLayer === processLayer.id)

    const subjectsAsOwl = subjects.map(subject => this.subjectToOwl(subject))
    const interfaceSubjectsAsOwl = interfaceSubjects.map(subject => this.interfaceSubjectToOwl(subject))
    const messageSpecificationsAsOwl = messageSpecifications.map(messageSpecification => this.messageSpecificationToOwl(messageSpecification))
    const messageExchangesAsOwl = messageExchanges.map(messageExchange => this.messageExchangeToOwl(messageExchange))
    const messageExchangeListsAsOwl = messageExchangeLists.map(messageExchangeList => this.messageExchangeListToOwl(messageExchangeList))
    const behaviorsAsOwl = behaviors.map(behavior => this.behaviorToOwl(behavior))

    /* Prepare string builder for writing process layer related data */
    const processLayerAsOwl = new StringBuilder({newline: '\r\n'})
    const processModelUri = this.createURI(processLayer.id)

    /* Start building */
    // Start
    processLayerAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, processModelUri))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.processLayer.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.processLayer.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(processLayer.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.processLayer.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.processLayer.name)
      .append(processLayer.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.processLayer.name)

    // Content
    processLayer.elements.forEach(el => {
      processLayerAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.processLayer.referenceToElement, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(el)))
        .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.processLayer.referenceToElement)
    })

    // End
    processLayerAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    // Corresponding elements
    subjectsAsOwl.forEach(subjectAsOwl => processLayerAsOwl.append(subjectAsOwl))
    interfaceSubjectsAsOwl.forEach(interfaceSubjectAsOwl => processLayerAsOwl.append(interfaceSubjectAsOwl))
    messageSpecificationsAsOwl.forEach(messageSpecificationAsOwl => processLayerAsOwl.append(messageSpecificationAsOwl))
    messageExchangesAsOwl.forEach(messageExchangeAsOwl => processLayerAsOwl.append(messageExchangeAsOwl))
    messageExchangeListsAsOwl.forEach(messageExchangeListAsOwl => processLayerAsOwl.append(messageExchangeListAsOwl))
    behaviorsAsOwl.forEach(behaviorAsOwl => processLayerAsOwl.append(behaviorAsOwl))

    return processLayerAsOwl
  }

  subjectToOwl (subject) {
    /* Get subject behavior */
    const behavior = serviceState.owlData.behaviors.find(behavior => behavior.subjectId === subject.id)

    /* Prepare string builder for writing  related data */
    const subjectAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    subjectAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(subject.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.subject.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.subject.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(subject.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.subject.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.subject.name)
      .append(subject.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.subject.name)

    if (serviceState.includeVisualRepresentation) {
      subjectAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.subject.referenceToVisualRepresentation, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(subject.visualRepresentation)))
        .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.subject.referenceToVisualRepresentation)
    }

    // Content
    subjectAsOwl
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.subject.referenceToBehavior, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(behavior.id)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.subject.referenceToBehavior)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.subject.referenceToBaseBehavior, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(behavior.id)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.subject.referenceToBaseBehavior)

    // End
    subjectAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    if (serviceState.includeVisualRepresentation) {
      subjectAsOwl.append(this.nodeRepresentationToOwl(subject.visualRepresentation))
    }

    return subjectAsOwl
  }

  interfaceSubjectToOwl (subject) {
    /* Prepare string builder for writing  related data */
    const subjectAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    subjectAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(subject.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.interfaceSubject.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.interfaceSubject.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(subject.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.interfaceSubject.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.interfaceSubject.name)
      .append(subject.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.interfaceSubject.name)

    if (typeof subject.reference !== 'undefined' && subject.reference !== null) {
      subjectAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.interfaceSubject.referenceToElement, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(subject.reference)))
        .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.interfaceSubject.referenceToElement)
    }

    if (serviceState.includeVisualRepresentation) {
      subjectAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.subject.referenceToVisualRepresentation, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(subject.visualRepresentation)))
        .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.subject.referenceToVisualRepresentation)
    }

    // End
    subjectAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    if (serviceState.includeVisualRepresentation) {
      subjectAsOwl.append(this.nodeRepresentationToOwl(subject.visualRepresentation))
    }

    return subjectAsOwl
  }

  messageSpecificationToOwl (messageSpecification) {
    /* Prepare string builder for writing  related data */
    const messageSpecificationAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    messageSpecificationAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(messageSpecification.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.messageSpecification.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.messageSpecification.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(messageSpecification.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.messageSpecification.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.messageSpecification.name)
      .append(messageSpecification.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.messageSpecification.name)

    // End
    messageSpecificationAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    return messageSpecificationAsOwl
  }

  messageExchangeToOwl (messageExchange) {
    /* Prepare string builder for writing  related data */
    const messageExchangeAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    messageExchangeAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(messageExchange.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.messageExchange.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.messageExchange.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(messageExchange.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.messageExchange.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.messageExchange.name)
      .append(messageExchange.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.messageExchange.name)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.messageExchange.referenceToSender, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(messageExchange.senderId)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.messageExchange.referenceToSender)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.messageExchange.referenceToReceiver, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(messageExchange.receiverId)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.messageExchange.referenceToReceiver)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.messageExchange.referenceToMessage, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(messageExchange.messageSpecificationId)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.messageExchange.referenceToMessage)

    if (serviceState.includeVisualRepresentation) {
      messageExchangeAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.messageExchange.referenceToVisualRepresentation, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(messageExchange.visualRepresentation)))
        .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.messageExchange.referenceToVisualRepresentation)
    }

    // End
    messageExchangeAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    if (serviceState.includeVisualRepresentation) {
      messageExchangeAsOwl.append(this.linkRepresentationToOwl(messageExchange.visualRepresentation))
    }

    return messageExchangeAsOwl
  }

  messageExchangeListToOwl (messageExchangeList) {
    /* Prepare string builder for writing  related data */
    const messageExchangeListAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    messageExchangeListAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(messageExchangeList.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.messageExchangeList.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.messageExchangeList.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(messageExchangeList.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.messageExchangeList.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.messageExchangeList.name)
      .append(messageExchangeList.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.messageExchangeList.name)

    messageExchangeList.elements.forEach(el => {
      messageExchangeListAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, 'contains', rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(el)))
        .appendLine(rdflibConstants.END_TAG, constants.SPO, 'contains')
    })

    // End
    messageExchangeListAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    return messageExchangeListAsOwl
  }

  behaviorToOwl (behavior) {
    const states = serviceState.owlData.states.filter(state => state.subjectId === behavior.subjectId)
    const sendTransitions = serviceState.owlData.sendTransitions.filter(sendTransition => sendTransition.subjectId === behavior.subjectId)
    const receiveTransitions = serviceState.owlData.receiveTransitions.filter(receiveTransition => receiveTransition.subjectId === behavior.subjectId)
    const functionTransitions = serviceState.owlData.functionTransitions.filter(functionTransition => functionTransition.subjectId === behavior.subjectId)
    const actions = serviceState.owlData.actions.filter(action => action.subjectId === behavior.subjectId)

    const getInitialStateId = () => {
      const state = states.find(state => state.isInitial)
      if (typeof state !== 'undefined') {
        return state.id
      }
      return 'undefined'
    }
    const getEndStateId = () => {
      const state = states.find(state => state.isEnd)
      if (typeof state !== 'undefined') {
        return state.id
      }
      return 'undefined'
    }

    const statesAsOwl = states.map(state => this.stateToOwl(state))
    const sendTransitionsAsOwl = sendTransitions.map(sendTransition => this.sendTransitionToOwl(sendTransition))
    const receiveTransitionsAsOwl = receiveTransitions.map(receiveTransition => this.receiveTransitionToOwl(receiveTransition))
    const functionTransitionsAsOwl = functionTransitions.map(functionTransition => this.functionTransitionToOwl(functionTransition))
    const actionsAsOwl = actions.map(action => this.actionToOwl(action))

    /* Prepare string builder for writing  related data */
    const behaviorAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    behaviorAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(behavior.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.behavior.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.behavior.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(behavior.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.behavior.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.behavior.name)
      .append(behavior.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.behavior.name)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.behavior.referenceToInitialState, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(getInitialStateId())))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.behavior.referenceToInitialState)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.behavior.referenceToEndState, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(getEndStateId())))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.behavior.referenceToEndState)

    behavior.elements.forEach(el => {
      behaviorAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.behavior.referenceToElement, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(el)))
        .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.behavior.referenceToElement)
    })

    // End
    behaviorAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    // Corresponding elements
    statesAsOwl.forEach(stateAsOwl => behaviorAsOwl.append(stateAsOwl))
    sendTransitionsAsOwl.forEach(sendTransitionAsOwl => behaviorAsOwl.append(sendTransitionAsOwl))
    receiveTransitionsAsOwl.forEach(receiveTransitionAsOwl => behaviorAsOwl.append(receiveTransitionAsOwl))
    functionTransitionsAsOwl.forEach(functionTransitionAsOwl => behaviorAsOwl.append(functionTransitionAsOwl))
    actionsAsOwl.forEach(actionAsOwl => behaviorAsOwl.append(actionAsOwl))

    return behaviorAsOwl
  }

  stateToOwl (state) {
    /* Prepare string builder for writing  related data */
    const stateAsOwl = new StringBuilder({newline: '\r\n'})

    let stateType = ''
    if (state.type === jointOptions.types.elements.SEND_STATE_ELEMENT) {
      stateType = descriptors.state.type.send
    } else if (state.type === jointOptions.types.elements.RECEIVE_STATE_ELEMENT) {
      stateType = descriptors.state.type.receive
    } else if (state.type === jointOptions.types.elements.FUNCTION_STATE_ELEMENT) {
      stateType = descriptors.state.type.function
    }

    // Start
    stateAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(state.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, stateType)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.state.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(state.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.state.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.state.name)
      .append(state.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.state.name)

    if (serviceState.includeVisualRepresentation) {
      stateAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.state.referenceToVisualRepresentation, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(state.visualRepresentation)))
        .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.state.referenceToVisualRepresentation)
    }

    if (state.isInitial) {
      stateAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.state.type.initial)))
        .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
    } else if (state.isEnd) {
      stateAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.state.type.end)))
        .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
    }

    // End
    stateAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    // Corresponding elements
    if (serviceState.includeVisualRepresentation) {
      stateAsOwl.append(this.nodeRepresentationToOwl(state.visualRepresentation))
    }

    return stateAsOwl
  }

  sendTransitionToOwl (sendTransition) {
    /* Prepare string builder for writing  related data */
    const sendTransitionAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    sendTransitionAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(sendTransition.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.sendTransition.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.sendTransition.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(sendTransition.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.sendTransition.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.sendTransition.name)
      .append('Send Transition')
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.sendTransition.name)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.sendTransition.referenceToSourceState, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(sendTransition.sourceStateId)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.sendTransition.referenceToSourceState)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.sendTransition.referenceToTargetState, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(sendTransition.targetStateId)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.sendTransition.referenceToTargetState)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.sendTransition.referenceToElement, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(sendTransition.messageExchangeId)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.sendTransition.referenceToElement)

    if (serviceState.includeVisualRepresentation) {
      sendTransitionAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.sendTransition.referenceToVisualRepresentation, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(sendTransition.visualRepresentation)))
        .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.sendTransition.referenceToVisualRepresentation)
    }

    // End
    sendTransitionAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    if (serviceState.includeVisualRepresentation) {
      sendTransitionAsOwl.append(this.linkRepresentationToOwl(sendTransition.visualRepresentation))
    }

    return sendTransitionAsOwl
  }

  receiveTransitionToOwl (receiveTransition) {
    /* Prepare string builder for writing  related data */
    const receiveTransitionAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    receiveTransitionAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(receiveTransition.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.receiveTransition.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.receiveTransition.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(receiveTransition.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.receiveTransition.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.receiveTransition.name)
      .append('Receive Transition')
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.receiveTransition.name)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.receiveTransition.referenceToSourceState, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(receiveTransition.sourceStateId)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.receiveTransition.referenceToSourceState)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.receiveTransition.referenceToTargetState, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(receiveTransition.targetStateId)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.receiveTransition.referenceToTargetState)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.receiveTransition.referenceToElement, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(receiveTransition.messageExchangeId)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.receiveTransition.referenceToElement)

    if (serviceState.includeVisualRepresentation) {
      receiveTransitionAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.receiveTransition.referenceToVisualRepresentation, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(receiveTransition.visualRepresentation)))
        .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.receiveTransition.referenceToVisualRepresentation)
    }

    // End
    receiveTransitionAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    if (serviceState.includeVisualRepresentation) {
      receiveTransitionAsOwl.append(this.linkRepresentationToOwl(receiveTransition.visualRepresentation))
    }

    return receiveTransitionAsOwl
  }

  functionTransitionToOwl (functionTransition) {
    /* Prepare string builder for writing  related data */
    const functionTransitionAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    functionTransitionAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(functionTransition.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.functionTransition.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.functionTransition.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(functionTransition.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.functionTransition.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.functionTransition.name)
      .append(functionTransition.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.functionTransition.name)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.functionTransition.referenceToSourceState, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(functionTransition.sourceStateId)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.functionTransition.referenceToSourceState)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.functionTransition.referenceToTargetState, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(functionTransition.targetStateId)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.functionTransition.referenceToTargetState)

    if (serviceState.includeVisualRepresentation) {
      functionTransitionAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.functionTransition.referenceToVisualRepresentation, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(functionTransition.visualRepresentation)))
        .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.functionTransition.referenceToVisualRepresentation)
    }

    // End
    functionTransitionAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    if (serviceState.includeVisualRepresentation) {
      functionTransitionAsOwl.append(this.linkRepresentationToOwl(functionTransition.visualRepresentation))
    }

    return functionTransitionAsOwl
  }

  actionToOwl (action) {
    /* Prepare string builder for writing  related data */
    const actionAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    actionAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(action.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, 'Action')))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, 'hasModelComponentID', rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(action.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, 'hasModelComponentID')
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, 'hasModelComponentLabel')
      .append(action.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, 'hasModelComponentLabel')

    // Content
    action.elements.forEach(el => {
      actionAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, 'contains', rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(el)))
        .appendLine(rdflibConstants.END_TAG, constants.SPO, 'contains')
    })

    // End
    actionAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    return actionAsOwl
  }

  nodeRepresentationToOwl (nodeRepresentationId) {
    const nodeRepresentation = serviceState.owlVisualRepresentation.nodeRepresentation.find(el => el.id === nodeRepresentationId)

    const coordinatesAsOwl = this.coordinatesAsOwl(nodeRepresentation.coordinates)
    const measurementsAsOwl = this.measurementsAsOwl(nodeRepresentation.measurements)

    /* Prepare string builder for writing  related data */
    const nodeRepresentationAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    nodeRepresentationAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(nodeRepresentation.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.nodeRepresentation.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.nodeRepresentation.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(nodeRepresentation.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.nodeRepresentation.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.nodeRepresentation.name)
      .append(nodeRepresentation.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.nodeRepresentation.name)

    // Content
    nodeRepresentationAsOwl
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.nodeRepresentation.referenceToCoordinates, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(nodeRepresentation.coordinates)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.nodeRepresentation.referenceToCoordinates)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.nodeRepresentation.referenceToMeasurements, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(nodeRepresentation.measurements)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.nodeRepresentation.referenceToMeasurements)

    // End
    nodeRepresentationAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    // Corresponding elements
    nodeRepresentationAsOwl.append(coordinatesAsOwl)
    nodeRepresentationAsOwl.append(measurementsAsOwl)

    return nodeRepresentationAsOwl
  }

  linkRepresentationToOwl (linkRepresentationId) {
    const linkRepresentation = serviceState.owlVisualRepresentation.linkRepresentation.find(el => el.id === linkRepresentationId)

    const verticesAsOwl = linkRepresentation.vertices.map(vertex => this.vertexAsOwl(vertex))

    /* Prepare string builder for writing  related data */
    const linkRepresentationAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    linkRepresentationAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(linkRepresentation.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.linkRepresentation.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.linkRepresentation.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(linkRepresentation.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.linkRepresentation.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.linkRepresentation.name)
      .append(linkRepresentation.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.linkRepresentation.name)

    // Content
    linkRepresentationAsOwl
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.linkRepresentation.referenceToSourceNode, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(linkRepresentation.source)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.linkRepresentation.referenceToSourceNode)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.linkRepresentation.referenceToTargetNode, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(linkRepresentation.target)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.linkRepresentation.referenceToTargetNode)

    linkRepresentation.vertices.forEach(vertex => {
      linkRepresentationAsOwl
        .append(rdflibConstants.DOUBLE_TAB)
        .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.linkRepresentation.referenceContainsVertex, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(vertex)))
        .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.linkRepresentation.referenceContainsVertex)
    })

    // End
    linkRepresentationAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    // Corresponding elements
    verticesAsOwl.forEach(vertexAsOwl => linkRepresentationAsOwl.append(vertexAsOwl))

    return linkRepresentationAsOwl
  }

  vertexAsOwl (vertexId) {
    const vertex = serviceState.owlVisualRepresentation.vertices.find(el => el.id === vertexId)

    const coordinatesAsOwl = this.coordinatesAsOwl(vertex.coordinates)

    /* Prepare string builder for writing  related data */
    const vertexAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    vertexAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(vertex.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.vertex.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.vertex.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(vertex.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.vertex.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.vertex.name)
      .append(vertex.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.vertex.name)

    // Content
    vertexAsOwl
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.vertex.referenceToCoordinates, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, this.createURI(vertex.coordinates)))
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.vertex.referenceToCoordinates)

    // End
    vertexAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    // Corresponding elements
    vertexAsOwl.append(coordinatesAsOwl)

    return vertexAsOwl
  }

  coordinatesAsOwl (coordinatesId) {
    const coordinates = serviceState.owlVisualRepresentation.coordinates.find(el => el.id === coordinatesId)

    /* Prepare string builder for writing  related data */
    const coordinatesAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    coordinatesAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(coordinates.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.coordinates.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.coordinates.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(coordinates.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.coordinates.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.coordinates.name)
      .append(coordinates.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.coordinates.name)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.coordinates.xCoordinate)
      .append(coordinates.xCoordinate)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.coordinates.xCoordinate)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.coordinates.yCoordinate)
      .append(coordinates.yCoordinate)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.coordinates.yCoordinate)

    // End
    coordinatesAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    return coordinatesAsOwl
  }

  measurementsAsOwl (measurementsId) {
    const measurements = serviceState.owlVisualRepresentation.measurements.find(el => el.id === measurementsId)

    /* Prepare string builder for writing  related data */
    const measurementsAsOwl = new StringBuilder({newline: '\r\n'})

    // Start
    measurementsAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.ABOUT, this.createURI(measurements.id)))
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.RESOURCE, '{0}{1}'.format(constants.SPO_URI, descriptors.measurements.type)))
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.RDF, rdflibConstants.RDF_ATTR.TYPE)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG_WITH_ATTR, constants.SPO, descriptors.coordinates.id, rdflibConstants.ATTR.format(rdflibConstants.RDF, rdflibConstants.RDF_ATTR.DATATYPE, '{0}{1}'.format(rdflibConstants.XSD_URI, 'string')))
      .append(measurements.id)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.measurements.id)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.measurements.name)
      .append(measurements.name)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.measurements.name)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.measurements.height)
      .append(measurements.height)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.measurements.height)
      .append(rdflibConstants.DOUBLE_TAB)
      .append(rdflibConstants.START_TAG, constants.SPO, descriptors.measurements.width)
      .append(measurements.width)
      .appendLine(rdflibConstants.END_TAG, constants.SPO, descriptors.measurements.width)

    // End
    measurementsAsOwl
      .append(rdflibConstants.SINGLE_TAB)
      .appendLine(rdflibConstants.END_TAG, rdflibConstants.OWL, rdflibConstants.OWL_ATTR.NAMED_INDIVIDUAL)

    return measurementsAsOwl
  }

  createURI (value) {
    return '{0}{1}'.format(constants.FILE_URI, value)
  }

  removeWhitespaces (value) {
    return value.replace(/\s/g, '_')
  }
}

/** Make the standardExportService a singleton */
const standardExportService = new StandardExportService()
Object.freeze(standardExportService)

export default standardExportService
