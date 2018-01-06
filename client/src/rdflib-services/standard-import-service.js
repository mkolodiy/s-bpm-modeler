/* eslint-disable */
import $rdf from 'rdflib'
import * as StringBuilder from 'stringbuilder'
import store from '@/store/'
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
  SPO_URI: 'http://www.i2pm.net/standard-pass-ont#',
  SPO_URL: 'http://www.s-bpm-ont.at/standard-pass-ont/',
  MIME_TYPE: 'application/rdf+xml'
}

const serviceState = {
  store: null,
  processGroupJSONObject: null,
  temporaryOwlFileIdToDBIdMatcher: {
    subjects: [],
    interfaceSubjects: [],
    messageSpecifications: [],
    messageExchanges: [],
    states: []
  }
}

class StandardImportService {
  import (fileName, fileAsString) {
    StringBuilder.extend('string')

    this.importFileToStore(fileName, fileAsString)

    this.convertProcessGroupToJSONObject(fileName)

    return this.createProcessGroup()
  }

  importFileToStore (fileName, fileAsString) {
    const uri = '{0}{1}'.format(constants.SPO_URL, fileName)
    const body = fileAsString
    const mimeType = constants.MIME_TYPE
    serviceState.store = $rdf.graph()
    $rdf.parse(body, serviceState.store, uri, mimeType)
  }

  /***************************************************
   ****************** PREPARE DATA *******************
   ***************************************************/

  getStatementsByType (statementType) {
    const statementsById = []
    const SPO = $rdf.Namespace(constants.SPO_URI)

    const statementsByType = serviceState.store.statementsMatching(undefined, undefined, SPO(statementType))

    statementsByType.forEach(statement => {
      statementsById.push(this.getStatementsById(statement.subject.value))
    })

    return statementsById
  }

  getStatementsById (value) {
    const getNamespaceName = v => {
      return '{0}#'.format(v.split('#')[0])
    }
    const getStatementId = v => {
      return v.split('#')[1]
    }

    const SPO = $rdf.Namespace(getNamespaceName(value))
    return serviceState.store.statementsMatching(SPO(getStatementId(value)), undefined, undefined)
  }

  getNodeRepresentation (owlFileId) {
    const getCoordinatesId = statement => {
      let coordinatesId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.nodeRepresentation.referenceToCoordinates)) {
          coordinatesId = el.object.value
        }
      })
      return coordinatesId
    }
    const getMeasurementsId = statement => {
      let measurementsId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.nodeRepresentation.referenceToMeasurements)) {
          measurementsId = el.object.value
        }
      })
      return measurementsId
    }

    const statement = this.getStatementsById(owlFileId)
    const nodeRepresentation = {
      coordinates: this.getCoordinates(getCoordinatesId(statement)),
      measurements: this.getMeasurements(getMeasurementsId(statement))
    }

    return nodeRepresentation
  }

  getLinkRepresentation (owlFileId) {
    const getVerticesIds = statement => {
      const verticesIds = []
      statement.map(el => {
        if (el.predicate.value.includes(descriptors.linkRepresentation.referenceContainsVertex)) {
          verticesIds.push(el.object.value)
        }
      })
      return verticesIds
    }

    const statement = this.getStatementsById(owlFileId)
    const linkRepresentation = {
      vertices: []
    }

    getVerticesIds(statement).forEach(vertexId => {
      linkRepresentation.vertices.push(this.getVertex(vertexId))
    })

    return linkRepresentation
  }

  getVertex (owlFileId) {
    const getCoordinatesId = statement => {
      let coordinatesId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.vertex.referenceToCoordinates)) {
          coordinatesId = el.object.value
        }
      })
      return coordinatesId
    }
    const statement = this.getStatementsById(owlFileId)
    const vertex = this.getCoordinates(getCoordinatesId(statement))
    return vertex
  }

  getCoordinates (owlFileId) {
    const getXCoordinate = statement => {
      let x = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.coordinates.xCoordinate)) {
          x = el.object.value
        }
      })
      return x
    }
    const getYCoordinate = statement => {
      let y = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.coordinates.yCoordinate)) {
          y = el.object.value
        }
      })
      return y
    }

    const statement = this.getStatementsById(owlFileId)
    const coordinates = {
      x: parseFloat(getXCoordinate(statement)),
      y: parseFloat(getYCoordinate(statement))
    }

    return coordinates
  }

  getMeasurements (owlFileId) {
    const getHeight = statement => {
      let height = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.measurements.height)) {
          height = el.object.value
        }
      })
      return height
    }
    const getWidth = statement => {
      let width = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.measurements.width)) {
          width = el.object.value
        }
      })
      return width
    }

    const statement = this.getStatementsById(owlFileId)
    const measurements = {
      height: parseFloat(getHeight(statement)),
      width: parseFloat(getWidth(statement))
    }

    return measurements
  }

  convertProcessGroupToJSONObject (fileName) {
    const formatName = (name) => {
      return name.split('.')[0].replace('_', ' ')
    }

    const processGroup = {
      name: formatName(fileName),
      processModels: this.convertProcessModelToJSONObject()
    }

    serviceState.processGroupJSONObject = processGroup
  }

  convertProcessModelToJSONObject () {
    const getOwlFileId = statement => {
      return statement[0].subject.value
    }
    const getName = statement => {
      let name = null

      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.processModel.name)) {
          name = el.object.value
        }
      })

      return name
    }
    const getChildrenIds = statement => {
      const childrenIds = []
      statement.map(el => {
        if (el.predicate.value.includes(descriptors.processModel.referenceToElement)) {
          childrenIds.push(el.object.value)
        }
      })

      const SPO = $rdf.Namespace(constants.SPO_URI)
      const statementsByType = serviceState.store.statementsMatching(undefined, undefined, SPO(descriptors.processLayer.type))
      const layerIds = statementsByType.map(statement => statement.subject.value)
      const filteredChildrenIds = childrenIds.filter(childId => layerIds.includes(childId))

      return filteredChildrenIds
    }

    const processModels = []
    const statements = this.getStatementsByType(descriptors.processModel.type)

    statements.forEach(statement => {
      const processModel = {
        owlFileId: getOwlFileId(statement),
        name: getName(statement),
        processLayers: []
      }

      getChildrenIds(statement).forEach(childId => {
        processModel.processLayers.push(this.convertProcessLayerToJSONObject(childId))
      })

      processModels.push(processModel)
    })

    return processModels
  }

  convertProcessLayerToJSONObject (owlFileId) {
    const getName = statement => {
      let name = null

      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.processLayer.name)) {
          name = el.object.value
        }
      })

      return name
    }
    const getChildrenIds = statement => {
      const childrenIds = []
      statement.map(el => {
        if (el.predicate.value.includes(descriptors.processModel.referenceToElement)) {
          childrenIds.push(el.object.value)
        }
      })
      return childrenIds
    }
    const checkChildId = (childId, childType) => {
      const statementById = this.getStatementsById(childId)
      return statementById[1].object.value.split('#')[1] === childType
    }

    const subjectIds = []
    const interfaceSubjectIds = []
    const messageSpecificationIds = []
    const messageExchangeIds = []

    const statement = this.getStatementsById(owlFileId)

    const processLayer = {
      owlFileId: owlFileId,
      name: getName(statement),
      subjects: [],
      interfaceSubjects: [],
      messageSpecifications: [],
      messageExchanges: []
    }

    getChildrenIds(statement).forEach(childId => {
      if (checkChildId(childId, descriptors.subject.type)) {
        subjectIds.push(childId)
      } else if (checkChildId(childId, descriptors.interfaceSubject.type)) {
        interfaceSubjectIds.push(childId)
      } else if (checkChildId(childId, descriptors.messageSpecification.type)) {
        messageSpecificationIds.push(childId)
      } else if (checkChildId(childId, descriptors.messageExchange.type)) {
        messageExchangeIds.push(childId)
      }
    })

    subjectIds.forEach(subjectId => {
      processLayer.subjects.push(this.convertSubjectToJSONObject(subjectId))
    })

    interfaceSubjectIds.forEach(interfaceSubjectId => {
      processLayer.interfaceSubjects.push(this.convertInterfaceSubjectToJSONObject(interfaceSubjectId))
    })

    messageSpecificationIds.forEach(messageSpecificationId => {
      processLayer.messageSpecifications.push(this.convertMessageSpecificationToJSONObject(messageSpecificationId))
    })

    messageExchangeIds.forEach(messageExchangeId => {
      const convertedMessageExchange = this.convertMessageExchangeToJSONObject(messageExchangeId)
      processLayer.messageExchanges.push(convertedMessageExchange)
      serviceState.temporaryOwlFileIdToDBIdMatcher.messageExchanges.push(convertedMessageExchange)
    })

    return processLayer
  }

  convertSubjectToJSONObject (owlFileId) {
    const getName = statement => {
      let name = null

      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.subject.name)) {
          name = el.object.value
        }
      })

      return name
    }
    const getNodeRepresentationId = statement => {
      let nodeRepresentationId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.subject.referenceToVisualRepresentation)) {
          nodeRepresentationId = el.object.value
        }
      })
      return nodeRepresentationId
    }
    const getBehaviorId = statement => {
      let behaviorId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.subject.referenceToBehavior)) {
          behaviorId = el.object.value
        }
      })
      return behaviorId
    }
    const getChildrenIds = statement => {
      const childrenIds = []
      statement.map(el => {
        if (el.predicate.value.includes(descriptors.processModel.referenceToElement)) {
          childrenIds.push(el.object.value)
        }
      })
      return childrenIds
    }
    const checkChildId = (childId, childType) => {
      const statementById = this.getStatementsById(childId)
      return statementById[1].object.value.includes(childType)
    }

    const sendStateIds = []
    const receiveStateIds = []
    const functionStateIds = []
    const sendTransitionIds = []
    const receiveTransitionIds = []
    const functionTransitionIds = []

    const statement = this.getStatementsById(owlFileId)
    const behaviorStatement = this.getStatementsById(getBehaviorId(statement))

    const nodeRepresentation = this.getNodeRepresentation(getNodeRepresentationId(statement))

    const subject = {
      owlFileId: owlFileId,
      name: getName(statement),
      position: nodeRepresentation.coordinates,
      size: nodeRepresentation.measurements,
      behavior: {
        states: [],
        sendTransitions: [],
        receiveTransitions: [],
        functionTransitions: []
      }
    }

    getChildrenIds(behaviorStatement).forEach(childId => {
      if (checkChildId(childId, descriptors.state.type.send)) {
        sendStateIds.push(childId)
      } else if (checkChildId(childId, descriptors.state.type.receive)) {
        receiveStateIds.push(childId)
      } else if (checkChildId(childId, descriptors.state.type.function)) {
        functionStateIds.push(childId)
      } else if (checkChildId(childId, descriptors.sendTransition.type)) {
        sendTransitionIds.push(childId)
      } else if (checkChildId(childId, descriptors.receiveTransition.type)) {
        receiveTransitionIds.push(childId)
      } else if (checkChildId(childId, descriptors.functionTransition.type)) {
        functionTransitionIds.push(childId)
      }
    })

    sendStateIds.forEach(stateId => {
      subject.behavior.states.push(this.convertSendStateToJSONObject(stateId))
    })

    receiveStateIds.forEach(stateId => {
      subject.behavior.states.push(this.convertReceiveStateToJSONObject(stateId))
    })

    functionStateIds.forEach(stateId => {
      subject.behavior.states.push(this.convertFunctionStateToJSONObject(stateId))
    })

    sendTransitionIds.forEach(sendTransitionId => {
      subject.behavior.sendTransitions.push(this.convertSendTransitionToJSONObject(sendTransitionId))
    })

    receiveTransitionIds.forEach(receiveTransitionId => {
      subject.behavior.receiveTransitions.push(this.convertReceiveTransitionToJSONObject(receiveTransitionId))
    })

    functionTransitionIds.forEach(functionTransitionId => {
      subject.behavior.functionTransitions.push(this.convertFunctionTransitionToJSONObject(functionTransitionId))
    })

    return subject
  }

  convertInterfaceSubjectToJSONObject (owlFileId) {
    const getName = statement => {
      let name = null

      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.interfaceSubject.name)) {
          name = el.object.value
        }
      })

      return name
    }
    const getNodeRepresentationId = statement => {
      let nodeRepresentationId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.interfaceSubject.referenceToVisualRepresentation)) {
          nodeRepresentationId = el.object.value
        }
      })
      return nodeRepresentationId
    }
    const getReference = statement => {
      let reference = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.interfaceSubject.referenceToElement)) {
          reference = el.object.value
        }
      })
      return reference
    }

    const statement = this.getStatementsById(owlFileId)

    const nodeRepresentation = this.getNodeRepresentation(getNodeRepresentationId(statement))

    const interfaceSubject = {
      owlFileId: owlFileId,
      name: getName(statement),
      position: nodeRepresentation.coordinates,
      size: nodeRepresentation.measurements,
      reference: getReference(statement)
    }

    return interfaceSubject
  }

  convertMessageSpecificationToJSONObject (owlFileId) {
    const getName = statement => {
      let name = null

      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.messageSpecification.name)) {
          name = el.object.value
        }
      })

      return name
    }

    const statement = this.getStatementsById(owlFileId)

    const messageSpecification = {
      owlFileId: owlFileId,
      name: getName(statement)
    }

    return messageSpecification
  }

  convertMessageExchangeToJSONObject (owlFileId) {
    const getName = statement => {
      let name = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.messageExchange.name)) {
          name = el.object.value
        }
      })
      return name
    }
    const getSenderId = statement => {
      let senderId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.messageExchange.referenceToSender)) {
          senderId = el.object.value
        }
      })
      return senderId
    }
    const getReceiverId = statement => {
      let receiverId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.messageExchange.referenceToReceiver)) {
          receiverId = el.object.value
        }
      })
      return receiverId
    }
    const getLinkRepresentationId = statement => {
      let linkRepresentationId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.messageExchange.referenceToVisualRepresentation)) {
          linkRepresentationId = el.object.value
        }
      })
      return linkRepresentationId
    }
    const getMessageSpecificationId = statement => {
      let messageSpecificationId = null
      statement.map(el => {
        if (el.predicate.value.includes(descriptors.messageExchange.referenceToMessage)) {
          messageSpecificationId = el.object.value
        }
      })
      return messageSpecificationId
    }

    const statement = this.getStatementsById(owlFileId)

    const messageExchange = {
      owlFileId: owlFileId,
      name: getName(statement),
      sender: getSenderId(statement),
      receiver: getReceiverId(statement),
      messageSpecification: getMessageSpecificationId(statement),
      vertices: this.getLinkRepresentation(getLinkRepresentationId(statement)).vertices
    }

    return messageExchange
  }

  convertSendStateToJSONObject (owlFileId) {
    const getName = statement => {
      let name = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.state.name)) {
          name = el.object.value
        }
      })
      return name
    }
    const getStartStateBoolean = statement => {
      let startState = false
      statement.forEach(el => {
        if (el.object.value.includes(descriptors.state.type.initial)) {
          startState = true
        }
      })
      return startState
    }
    const getEndStateBoolean = statement => {
      let endState = false
      statement.forEach(el => {
        if (el.object.value.includes(descriptors.state.type.end)) {
          endState = true
        }
      })
      return endState
    }
    const getNodeRepresentationId = statement => {
      let nodeRepresentationId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.state.referenceToVisualRepresentation)) {
          nodeRepresentationId = el.object.value
        }
      })
      return nodeRepresentationId
    }

    const statement = this.getStatementsById(owlFileId)

    const nodeRepresentation = this.getNodeRepresentation(getNodeRepresentationId(statement))

    const sendState = {
      name: getName(statement),
      startState: getStartStateBoolean(statement),
      endState: getEndStateBoolean(statement),
      type: jointOptions.types.elements.SEND_STATE_ELEMENT,
      position: nodeRepresentation.coordinates,
      size: nodeRepresentation.measurements,
      owlFileId: owlFileId
    }

    return sendState
  }

  convertReceiveStateToJSONObject (owlFileId) {
    const getName = statement => {
      let name = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.state.name)) {
          name = el.object.value
        }
      })
      return name
    }
    const getStartStateBoolean = statement => {
      let startState = false
      statement.forEach(el => {
        if (el.object.value.includes(descriptors.state.type.initial)) {
          startState = true
        }
      })
      return startState
    }
    const getEndStateBoolean = statement => {
      let endState = false
      statement.forEach(el => {
        if (el.object.value.includes(descriptors.state.type.end)) {
          endState = true
        }
      })
      return endState
    }
    const getNodeRepresentationId = statement => {
      let nodeRepresentationId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.state.referenceToVisualRepresentation)) {
          nodeRepresentationId = el.object.value
        }
      })
      return nodeRepresentationId
    }

    const statement = this.getStatementsById(owlFileId)

    const nodeRepresentation = this.getNodeRepresentation(getNodeRepresentationId(statement))

    const receiveState = {
      name: getName(statement),
      startState: getStartStateBoolean(statement),
      endState: getEndStateBoolean(statement),
      type: jointOptions.types.elements.RECEIVE_STATE_ELEMENT,
      position: nodeRepresentation.coordinates,
      size: nodeRepresentation.measurements,
      owlFileId: owlFileId
    }

    return receiveState
  }

  convertFunctionStateToJSONObject (owlFileId) {
    const getName = statement => {
      let name = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.state.name)) {
          name = el.object.value
        }
      })
      return name
    }
    const getStartStateBoolean = statement => {
      let startState = false
      statement.forEach(el => {
        if (el.object.value.includes(descriptors.state.type.initial)) {
          startState = true
        }
      })
      return startState
    }
    const getEndStateBoolean = statement => {
      let endState = false
      statement.forEach(el => {
        if (el.object.value.includes(descriptors.state.type.end)) {
          endState = true
        }
      })
      return endState
    }
    const getNodeRepresentationId = statement => {
      let nodeRepresentationId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.state.referenceToVisualRepresentation)) {
          nodeRepresentationId = el.object.value
        }
      })
      return nodeRepresentationId
    }

    const statement = this.getStatementsById(owlFileId)

    const nodeRepresentation = this.getNodeRepresentation(getNodeRepresentationId(statement))

    const functionState = {
      name: getName(statement),
      startState: getStartStateBoolean(statement),
      endState: getEndStateBoolean(statement),
      type: jointOptions.types.elements.FUNCTION_STATE_ELEMENT,
      position: nodeRepresentation.coordinates,
      size: nodeRepresentation.measurements,
      owlFileId: owlFileId
    }

    return functionState
  }

  convertSendTransitionToJSONObject (owlFileId) {
    const getName = statement => {
      let name = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.sendTransition.name)) {
          name = el.object.value
        }
      })
      return name
    }
    const getSourceId = statement => {
      let sourceId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.sendTransition.referenceToSourceState)) {
          sourceId = el.object.value
        }
      })
      return sourceId
    }
    const getTargetId = statement => {
      let targetId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.sendTransition.referenceToTargetState)) {
          targetId = el.object.value
        }
      })
      return targetId
    }
    const getLinkRepresentationId = statement => {
      let linkRepresentationId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.sendTransition.referenceToVisualRepresentation)) {
          linkRepresentationId = el.object.value
        }
      })
      return linkRepresentationId
    }
    const getMessageExchangeId = statement => {
      let messageExchangeId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.sendTransition.referenceToElement)) {
          messageExchangeId = el.object.value
        }
      })
      return messageExchangeId
    }

    const statement = this.getStatementsById(owlFileId)

    const sendTransition = {
      owlFileId: owlFileId,
      name: getName(statement),
      sourceState: getSourceId(statement),
      targetState: getTargetId(statement),
      messageExchange: getMessageExchangeId(statement),
      vertices: this.getLinkRepresentation(getLinkRepresentationId(statement)).vertices
    }

    return sendTransition
  }

  convertReceiveTransitionToJSONObject (owlFileId) {
    const getName = statement => {
      let name = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.receiveTransition.name)) {
          name = el.object.value
        }
      })
      return name
    }
    const getSourceId = statement => {
      let sourceId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.receiveTransition.referenceToSourceState)) {
          sourceId = el.object.value
        }
      })
      return sourceId
    }
    const getTargetId = statement => {
      let targetId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.receiveTransition.referenceToTargetState)) {
          targetId = el.object.value
        }
      })
      return targetId
    }
    const getLinkRepresentationId = statement => {
      let linkRepresentationId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.receiveTransition.referenceToVisualRepresentation)) {
          linkRepresentationId = el.object.value
        }
      })
      return linkRepresentationId
    }
    const getMessageExchangeId = statement => {
      let messageExchangeId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.sendTransition.referenceToElement)) {
          messageExchangeId = el.object.value
        }
      })
      return messageExchangeId
    }

    const statement = this.getStatementsById(owlFileId)

    const receiveTransition = {
      owlFileId: owlFileId,
      name: getName(statement),
      sourceState: getSourceId(statement),
      targetState: getTargetId(statement),
      messageExchange: getMessageExchangeId(statement),
      vertices: this.getLinkRepresentation(getLinkRepresentationId(statement)).vertices
    }

    return receiveTransition
  }

  convertFunctionTransitionToJSONObject (owlFileId) {
    const getName = statement => {
      let name = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.functionTransition.name)) {
          name = el.object.value
        }
      })
      return name
    }
    const getSourceId = statement => {
      let sourceId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.functionTransition.referenceToSourceState)) {
          sourceId = el.object.value
        }
      })
      return sourceId
    }
    const getTargetId = statement => {
      let targetId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.functionTransition.referenceToTargetState)) {
          targetId = el.object.value
        }
      })
      return targetId
    }
    const getLinkRepresentationId = statement => {
      let linkRepresentationId = null
      statement.forEach(el => {
        if (el.predicate.value.includes(descriptors.functionTransition.referenceToVisualRepresentation)) {
          linkRepresentationId = el.object.value
        }
      })
      return linkRepresentationId
    }

    const statement = this.getStatementsById(owlFileId)

    const functionTransition = {
      owlFileId: owlFileId,
      name: getName(statement),
      sourceState: getSourceId(statement),
      targetState: getTargetId(statement),
      vertices: this.getLinkRepresentation(getLinkRepresentationId(statement)).vertices
    }

    return functionTransition
  }

  /***************************************************
   ************ CREATE DATABASE ENTRIES **************
   ***************************************************/

  generateRandonAlphanumericString () {
    var text = ''
    var possible = 'abcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
  }

  createCanvasId (owlFileId) {
    const strArr = owlFileId.split('#')[1].split('')
    strArr.splice(8, 0, '-')
    strArr.splice(13, 0, '-')
    strArr.splice(18, 0, '-')
    strArr.splice(23, 0, '-')
    return '{0}{1}'.format(strArr.join(''), this.generateRandonAlphanumericString())
  }

  createProcessGroup () {
    const processGroup = {
      name: serviceState.processGroupJSONObject.name
    }
    return store.dispatch('processGroups/createProcessGroup', processGroup)
      .then(result => {
        serviceState.processGroupJSONObject.processModels.forEach(processModelJSONObject => {
          this.createProcessModel(processModelJSONObject, result._id)
        })
      })
  }

  createProcessModel (processModelJSONObject, processGroupId) {
    const processModel = {
      name: processModelJSONObject.name,
      processGroup: processGroupId,
      parent: processGroupId
    }

    return store.dispatch('processModels/createProcessModel', processModel)
      .then(result => {
        processModelJSONObject.processLayers.forEach(processLayer => {
          this.createProcessLayer(processLayer, processGroupId, result._id)
        })
      })
  }

  createProcessLayer (processLayerJSONObject, processGroupId, processModelId) {
    let processLayerId = null
    const groupedMessageExchanges = []

    const groupMessageExchanges = messageExchanges => {
      if (messageExchanges.length === 0) return

      const messageExchangePair = []

      // Get all message exchanges from sender to receiver
      const firstMessageExchangeArr = []
      const fromSenderMessageExchange = messageExchanges[0]
      const fromSenderMessageExchangeIndex = messageExchanges.indexOf(fromSenderMessageExchange)
      messageExchanges.splice(fromSenderMessageExchangeIndex, 1)
      messageExchanges.forEach(messageExchange => {
        if (messageExchange.sender === fromSenderMessageExchange.sender && messageExchange.receiver === fromSenderMessageExchange.receiver) {
          firstMessageExchangeArr.push(messageExchange)
        }
      })
      firstMessageExchangeArr.forEach(messageExchange => {
        const messageExchangeIndex = messageExchanges.indexOf(messageExchange)
        messageExchanges.splice(messageExchange, 1)
      })
      firstMessageExchangeArr.push(fromSenderMessageExchange)
      messageExchangePair.push(firstMessageExchangeArr)

      // Get all message exchanges from receiver to sender
      const secondMessageExchangeArr = []
      messageExchanges.forEach(messageExchange => {
        if (messageExchange.receiver === fromSenderMessageExchange.sender && messageExchange.sender === fromSenderMessageExchange.receiver) {
          secondMessageExchangeArr.push(messageExchange)
        }
      })
      secondMessageExchangeArr.forEach(messageExchange => {
        const messageExchangeIndex = messageExchanges.indexOf(messageExchange)
        messageExchanges.splice(messageExchange, 1)
      })
      messageExchangePair.push(secondMessageExchangeArr)

      groupedMessageExchanges.push(messageExchangePair)

      groupMessageExchanges(messageExchanges)
    }

    const processLayer = {
      name: processLayerJSONObject.name,
      layerType: 'base',
      processGroup: processGroupId,
      parent: processModelId
    }

    return store.dispatch('processLayers/createProcessLayer', processLayer)
      // subjects
      .then(result => {
        const promises = []

        processLayerId = result._id

        processLayerJSONObject.subjects.forEach(subjectJSONObject => {
          promises.push(this.createSubject(subjectJSONObject, processLayerId))
        })

        return Promise.all(promises)
      })
      // interfaceSubjects
      .then(() => {
        const promises = []

        processLayerJSONObject.interfaceSubjects.forEach(interfaceSubjectJSONObject => {
          promises.push(this.createInterfaceSubject(interfaceSubjectJSONObject, processLayerId))
        })

        return Promise.all(promises)
      })
      // messageSpecifications
      .then(() => {
        const promises = []

        processLayerJSONObject.messageSpecifications.forEach(messageSpecification => {
          promises.push(this.createMessageSpecification(messageSpecification, processLayerId))
        })

        return Promise.all(promises)
      })
      // messageExchange
      .then(() => {
        const promises = []

        groupMessageExchanges(processLayerJSONObject.messageExchanges)

        groupedMessageExchanges.forEach(messageExchangePair => {
          promises.push(this.createMessageExchange(messageExchangePair, processLayerId))
        })

        return Promise.all(promises)
      })
      // states
      .then(() => {
        const promises = []

        processLayerJSONObject.subjects.forEach(subjectJSONObject => {
          subjectJSONObject.behavior.states.forEach(stateJSONObject => {
            promises.push(this.createState(stateJSONObject, subjectJSONObject.owlFileId))
          })
        })

        return Promise.all(promises)
      })
      // sendTransitions
      .then(() => {
        const promises = []

        processLayerJSONObject.subjects.forEach(subjectJSONObject => {
          subjectJSONObject.behavior.sendTransitions.forEach(sendTransitionJSONObject => {
            promises.push(this.createSendTransition(sendTransitionJSONObject, subjectJSONObject.owlFileId))
          })
        })

        return Promise.all(promises)
      })
      // receiveTransitions
      .then(() => {
        const promises = []

        processLayerJSONObject.subjects.forEach(subjectJSONObject => {
          subjectJSONObject.behavior.receiveTransitions.forEach(receiveTransitionJSONObject => {
            promises.push(this.createReceiveTransition(receiveTransitionJSONObject, subjectJSONObject.owlFileId))
          })
        })

        return Promise.all(promises)
      })
      // functionTransitions
      .then(() => {
        const promises = []

        processLayerJSONObject.subjects.forEach(subjectJSONObject => {
          subjectJSONObject.behavior.functionTransitions.forEach(functionTransitionJSONObject => {
            promises.push(this.createFunctionTransition(functionTransitionJSONObject, subjectJSONObject.owlFileId))
          })
        })

        return Promise.all(promises)
      })
      // Generate tree data
      .then(() => {
        store.dispatch('common/generateTreeData')
      })
  }

  createSubject (subjectJSONObject, processLayerId) {
    const subject = {
      name: subjectJSONObject.name,
      position: subjectJSONObject.position,
      size: subjectJSONObject.size,
      canvasId: this.createCanvasId(subjectJSONObject.owlFileId),
      parent: processLayerId
    }

    return store.dispatch('subjects/createSubject', subject)
      .then(result => {
        serviceState.temporaryOwlFileIdToDBIdMatcher.subjects.push({
          owlFileId: subjectJSONObject.owlFileId,
          dbId: result._id,
          canvasId: result.canvasId
        })
      })
  }

  createInterfaceSubject (interfaceSubjectJSONObject, processLayerId) {
    const interfaceSubject = {
      name: interfaceSubjectJSONObject.name,
      position: interfaceSubjectJSONObject.position,
      size: interfaceSubjectJSONObject.size,
      canvasId: this.createCanvasId(interfaceSubjectJSONObject.owlFileId),
      reference: null,
      parent: processLayerId
    }

    if (interfaceSubjectJSONObject.reference !== null) {
      interfaceSubject.reference = interfaceSubjectJSONObject.reference
    }

    return store.dispatch('interfaceSubjects/createInterfaceSubject', interfaceSubject).then(result => {
      serviceState.temporaryOwlFileIdToDBIdMatcher.interfaceSubjects.push({
        owlFileId: interfaceSubjectJSONObject.owlFileId,
        dbId: result._id,
        canvasId: result.canvasId
      })
    })
  }

  createMessageSpecification (messageSpecificationJSONObject, processLayerId) {
    const messageSpecification = {
      name: messageSpecificationJSONObject.name,
      parent: processLayerId
    }

    return store.dispatch('messageSpecifications/createMessageSpecification', messageSpecification)
      .then(result => {
        serviceState.temporaryOwlFileIdToDBIdMatcher.messageSpecifications.push({
          owlFileId: messageSpecificationJSONObject.owlFileId,
          dbId: result._id
        })
      })
  }

  createMessageExchange (messageExchangePair, processLayerId) {
    const getSourceId = (obj) => {
      let sourceEl = serviceState.temporaryOwlFileIdToDBIdMatcher.subjects.find(el => el.owlFileId === obj.sender)
      if (typeof sourceEl === 'undefined') {
        sourceEl = serviceState.temporaryOwlFileIdToDBIdMatcher.interfaceSubjects.find(el => el.owlFileId === obj.sender)
      }
      return sourceEl.canvasId
    }
    const getTargetId = (obj) => {
      let targetEl = serviceState.temporaryOwlFileIdToDBIdMatcher.subjects.find(el => el.owlFileId === obj.receiver)
      if (typeof targetEl === 'undefined') {
        targetEl = serviceState.temporaryOwlFileIdToDBIdMatcher.interfaceSubjects.find(el => el.owlFileId === obj.receiver)
      }
      return targetEl.canvasId
    }

    const messageExchangeObj = messageExchangePair[0][0]

    const messageExchange = {
      isBidirectional: false,
      sourceToTargetMessageSpecifications: [],
      targetToSourceMessageSpecifications: [],
      source: null,
      target: null,
      vertices: [],
      canvasId: null,
      parent: processLayerId
    }

    // Set sourceToTargetMessageSpecifications
    messageExchangePair[0].forEach(me => {
      const obj = serviceState.temporaryOwlFileIdToDBIdMatcher.messageSpecifications.find(el => el.owlFileId === me.messageSpecification)
      messageExchange.sourceToTargetMessageSpecifications.push(obj.dbId)
    })

    // Set canvasId
    messageExchange.canvasId = this.createCanvasId(messageExchangeObj.owlFileId)

    // Set source
    messageExchange.source = {
      id: getSourceId(messageExchangeObj)
    }

    // Set target
    messageExchange.target = {
      id: getTargetId(messageExchangeObj)
    }

    // Set vertices
    messageExchange.vertices = messageExchangeObj.vertices

    if (messageExchangePair.length > 1) {
      // Set isBidirectional
      messageExchange.isBidirectional = true

      // Set targetToSourceMessageSpecifications
      messageExchangePair[0].forEach(me => {
        const obj = serviceState.temporaryOwlFileIdToDBIdMatcher.messageSpecifications.find(el => el.owlFileId === me.messageSpecification)
        messageExchange.targetToSourceMessageSpecifications.push(obj.dbId)
      })
    }

    return store.dispatch('messageExchanges/createMessageExchange', messageExchange)
  }

  createState (stateJSONObject, parentOwlFileId) {
    const getParentId = (parentOwlFileId) => {
      return serviceState.temporaryOwlFileIdToDBIdMatcher.subjects.find(el => el.owlFileId === parentOwlFileId).dbId
    }

    const state = {
      name: stateJSONObject.name,
      startState: stateJSONObject.startState,
      endState: stateJSONObject.endState,
      type: stateJSONObject.type,
      position: stateJSONObject.position,
      size: stateJSONObject.size,
      canvasId: this.createCanvasId(stateJSONObject.owlFileId),
      parent: getParentId(parentOwlFileId)
    }

    return store.dispatch('states/createState', state)
      .then(result => {
        serviceState.temporaryOwlFileIdToDBIdMatcher.states.push({
          owlFileId: stateJSONObject.owlFileId,
          dbId: result._id,
          canvasId: result.canvasId
        })
      })
  }

  createSendTransition (sendTransitionJSONObject, parentOwlFileId) {
    const getParentId = (parentOwlFileId) => {
      return serviceState.temporaryOwlFileIdToDBIdMatcher.subjects.find(el => el.owlFileId === parentOwlFileId).dbId
    }
    const getSubjectId = (owlFileId) => {
      let subject = null
      const messageExchange = serviceState.temporaryOwlFileIdToDBIdMatcher.messageExchanges.find(el => el.owlFileId === owlFileId)
      subject = serviceState.temporaryOwlFileIdToDBIdMatcher.subjects.find(el => el.owlFileId === messageExchange.sender)
      if (typeof subject === 'undefined' || subject === null) {
        subject = serviceState.temporaryOwlFileIdToDBIdMatcher.interfaceSubjects.find(el => el.owlFileId === messageExchange.sender)
      }
      return subject.dbId
    }
    const getMessageSpecificationId = (owlFileId) => {
      const messageExchange = serviceState.temporaryOwlFileIdToDBIdMatcher.messageExchanges.find(el => el.owlFileId === owlFileId)
      return serviceState.temporaryOwlFileIdToDBIdMatcher.messageSpecifications.find(el => el.owlFileId === messageExchange.messageSpecification).dbId
    }
    const getSourceId = (owlFileId) => {
      return serviceState.temporaryOwlFileIdToDBIdMatcher.states.find(el => el.owlFileId === owlFileId).canvasId
    }
    const getTargetId = (owlFileId) => {
      return serviceState.temporaryOwlFileIdToDBIdMatcher.states.find(el => el.owlFileId === owlFileId).canvasId
    }

    const sendTransition = {
      subject: getSubjectId(sendTransitionJSONObject.messageExchange),
      messageSpecification: getMessageSpecificationId(sendTransitionJSONObject.messageExchange),
      source: {
        id: getSourceId(sendTransitionJSONObject.sourceState)
      },
      target: {
        id: getTargetId(sendTransitionJSONObject.targetState)
      },
      vertices: sendTransitionJSONObject.vertices,
      canvasId: this.createCanvasId(sendTransitionJSONObject.owlFileId),
      parent: getParentId(parentOwlFileId)
    }

    return store.dispatch('sendTransitions/createSendTransition', sendTransition)
  }

  createReceiveTransition (receiveTransitionJSONObject, parentOwlFileId) {
    const getParentId = (parentOwlFileId) => {
      return serviceState.temporaryOwlFileIdToDBIdMatcher.subjects.find(el => el.owlFileId === parentOwlFileId).dbId
    }
    const getSubjectId = (owlFileId) => {
      let subject = null
      const messageExchange = serviceState.temporaryOwlFileIdToDBIdMatcher.messageExchanges.find(el => el.owlFileId === owlFileId)
      subject = serviceState.temporaryOwlFileIdToDBIdMatcher.subjects.find(el => el.owlFileId === messageExchange.receiver)
      if (typeof subject === 'undefined' || subject === null) {
        subject = serviceState.temporaryOwlFileIdToDBIdMatcher.interfaceSubjects.find(el => el.owlFileId === messageExchange.receiver)
      }
      return subject.dbId
    }
    const getMessageSpecificationId = (owlFileId) => {
      const messageExchange = serviceState.temporaryOwlFileIdToDBIdMatcher.messageExchanges.find(el => el.owlFileId === owlFileId)
      return serviceState.temporaryOwlFileIdToDBIdMatcher.messageSpecifications.find(el => el.owlFileId === messageExchange.messageSpecification).dbId
    }
    const getSourceId = (owlFileId) => {
      return serviceState.temporaryOwlFileIdToDBIdMatcher.states.find(el => el.owlFileId === owlFileId).canvasId
    }
    const getTargetId = (owlFileId) => {
      return serviceState.temporaryOwlFileIdToDBIdMatcher.states.find(el => el.owlFileId === owlFileId).canvasId
    }

    const receiveTransition = {
      subject: getSubjectId(receiveTransitionJSONObject.messageExchange),
      messageSpecification: getMessageSpecificationId(receiveTransitionJSONObject.messageExchange),
      source: {
        id: getSourceId(receiveTransitionJSONObject.sourceState)
      },
      target: {
        id: getTargetId(receiveTransitionJSONObject.targetState)
      },
      vertices: receiveTransitionJSONObject.vertices,
      canvasId: this.createCanvasId(receiveTransitionJSONObject.owlFileId),
      parent: getParentId(parentOwlFileId)
    }

    return store.dispatch('receiveTransitions/createReceiveTransition', receiveTransition)
  }

  createFunctionTransition (functionTransitionJSONObject, parentOwlFileId) {
    const getParentId = (parentOwlFileId) => {
      return serviceState.temporaryOwlFileIdToDBIdMatcher.subjects.find(el => el.owlFileId === parentOwlFileId).dbId
    }
    const getSourceId = (owlFileId) => {
      return serviceState.temporaryOwlFileIdToDBIdMatcher.states.find(el => el.owlFileId === owlFileId).canvasId
    }
    const getTargetId = (owlFileId) => {
      return serviceState.temporaryOwlFileIdToDBIdMatcher.states.find(el => el.owlFileId === owlFileId).canvasId
    }

    const functionTransition = {
      name: functionTransitionJSONObject.name,
      source: {
        id: getSourceId(functionTransitionJSONObject.sourceState)
      },
      target: {
        id: getTargetId(functionTransitionJSONObject.targetState)
      },
      vertices: functionTransitionJSONObject.vertices,
      canvasId: this.createCanvasId(functionTransitionJSONObject.owlFileId),
      parent: getParentId(parentOwlFileId)
    }

    return store.dispatch('functionTransitions/createFunctionTransition', functionTransition)
  }
}

/** Make the StandardImportService a singleton */
const standardImportService = new StandardImportService()
Object.freeze(standardImportService)

export default standardImportService
