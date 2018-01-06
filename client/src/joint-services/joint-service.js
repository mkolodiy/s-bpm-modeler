import joint from 'jointjs'
import $ from 'jquery'
import jointShapes from '@/joint-services/joint-shapes'
import jointOptions from '@/joint-services/joint-options'
import store from '@/store/'

/** Object containing all variables used in jointjs service. */
const state = {
  graph: null,
  paper: null,
  dragStartPosition: null,
  currentSelectedLink: null,
  drawConnection: false,
  loadElements: false
}

/** Class representing a jointjs service. */
class JointService {
  /***************************************************
   ***************** INITIALIZATION ******************
   ***************************************************/

  /**
   * Create a new jointjs canvas.
   * @param {object} container - <div> element for storing the jointjs canvas.
   */
  initialize (container) {
    state.graph = new joint.dia.Graph()
    state.paper = new joint.dia.Paper({
      el: container,
      width: '100%',
      height: '100%',
      gridSize: 1,
      model: state.graph
    })

    this.addDragging(container)
    this.addZooming()
    this.addOrigin()

    this.configureEventLisneters()
  }

  /**
   * Add dragging functionality to the canvas.
   * @param {object} container - <div> element for storing the jointjs canvas.
   */
  addDragging (container) {
    state.paper.on('blank:pointerdown', (event, x, y) => {
      state.dragStartPosition = {x: x, y: y}
    })

    state.paper.on('cell:pointerup blank:pointerup', (cellView, x, y) => {
      state.dragStartPosition = null
    })

    container.addEventListener('mousemove', (evt) => {
      if (state.dragStartPosition !== null) {
        const scale = state.paper.scale()
        state.paper.translate(
          evt.offsetX - state.dragStartPosition.x * scale.sx,
          evt.offsetY - state.dragStartPosition.y * scale.sy)

        /** Update all elements */
        jointService.getElementViews().forEach(el => el.updateBox())

        /** Update all links */
        jointService.getLinkViews().forEach(link => link.updateBox())
      }
    }, true)
  }

  /**
   * Add zooming functionality to the canvas.
   */
  addZooming () {
    state.paper.on('blank:mousewheel', (event, x, y, delta) => {
      const minScaleFactor = 0.7
      const scale = state.paper.scale()
      if (roundInt(scale.sx) > minScaleFactor && roundInt(scale.sy) > minScaleFactor) {
        state.paper.scale(scale.sx + (delta * 0.1), scale.sy + (delta * 0.1))
      }

      if (roundInt(scale.sx) === minScaleFactor && roundInt(scale.sy) === minScaleFactor && delta !== -1) {
        state.paper.scale(scale.sx + (delta * 0.1), scale.sy + (delta * 0.1))
      }

      /** Update all elements */
      jointService.getElementViews().forEach(el => el.updateBox())

      /** Update all links */
      jointService.getLinkViews().forEach(link => link.updateBox())

      function roundInt (number) {
        return Math.round(number * 10) / 10
      }
    })
  }

  /**
   * Add origin point to the canvas.
   */
  addOrigin () {
    const verticalLine = new joint.shapes.basic.Rect({
      position: {x: -1.5, y: -20},
      size: {width: 3, height: 40},
      attrs: {rect: {fill: 'black', style: {'pointer-events': 'none', 'opacity': '0.25'}}}
    })

    const horizontalLine = new joint.shapes.basic.Rect({
      position: {x: -20, y: -1.5},
      size: {width: 40, height: 3},
      attrs: {rect: {fill: 'black', style: {'pointer-events': 'none', 'opacity': '0.25'}}}
    })

    const text = new joint.shapes.basic.Rect({
      position: {x: -30, y: -20},
      attrs: {rect: {fill: 'white', style: {'pointer-events': 'none', 'opacity': '0.25'}}, text: {text: '(0, 0)', fill: 'black', style: {'pointer-events': 'none', 'opacity': '0.25'}}}
    })

    const origin = [text, verticalLine, horizontalLine]

    state.graph.addCells(origin)
  }

  /***************************************************
   ********************* GETTERS *********************
   ***************************************************/

  /**
   * Get the graph value.
   * @return {object} Graph object.
   */
  getGraph () {
    return state.graph
  }

  /**
   * Get the graph value.
   * @return {object} Paper object.
   */
  getPaper () {
    return state.paper
  }

  /**
   * Get all elements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getElements () {
    return state.graph.getElements().filter(el => el.attributes.type.includes('custom'))
  }

  /**
   * Get views of all elements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getElementViews () {
    return this.getElements().map(el => state.paper.findViewByModel(el))
  }

  /**
   * Get all links that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getLinks () {
    return state.graph.getLinks().filter(link => link.attributes.type.includes('custom'))
  }

  /**
   * Get views of all links that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getLinkViews () {
    return this.getLinks().map(el => state.paper.findViewByModel(el))
  }

  /**
   * Get all SubjectElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getSubjectElements () {
    return this.getElements().filter(el => el.attributes.type === jointOptions.types.elements.SUBJECT_ELEMENT)
  }

  /**
   * Get views of all SubjectElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getSubjectElementViews () {
    return this.getSubjectElements().map(el => state.paper.findViewByModel(el))
  }

  /**
   * Get all InterfaceSubjectElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getInterfaceSubjectElements () {
    return this.getElements().filter(el => el.attributes.type === jointOptions.types.elements.INTERFACE_SUBJECT_ELEMENT)
  }

  /**
   * Get views of all SubjectElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getInterfaceSubjectElementViews () {
    return this.getSubjectElements().map(el => state.paper.findViewByModel(el))
  }

  /**
   * Get all MessageExchangeElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getMessageExchangeElements () {
    return this.getLinks().filter(link => link.attributes.type === jointOptions.types.links.MESSAGE_EXCHANGE_ELEMENT)
  }

  /**
   * Get views of all MessageExchangeElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getMessageExchangeElementViews () {
    return this.getMessageExchangeElements().map(el => state.paper.findViewByModel(el))
  }

  /**
   * Get all SendStateElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getSendStateElements () {
    return this.getElements().filter(el => el.attributes.type === jointOptions.types.elements.SEND_STATE_ELEMENT)
  }

  /**
   * Get views of all SendStateElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getSendStateElementViews () {
    return this.getSendStateElements().map(el => state.paper.findViewByModel(el))
  }

  /**
   * Get all ReceiveStateElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getReceiveStateElements () {
    return this.getElements().filter(el => el.attributes.type === jointOptions.types.elements.RECEIVE_STATE_ELEMENT)
  }

  /**
   * Get views of all ReceiveStateElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getReceiveStateElementViews () {
    return this.getReceiveStateElements().map(el => state.paper.findViewByModel(el))
  }

  /**
   * Get all FunctionStateElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getFunctionStateElements () {
    return this.getElements().filter(el => el.attributes.type === jointOptions.types.elements.FUNCTION_STATE_ELEMENT)
  }

  /**
   * Get views of all FunctionStateElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getFunctionStateElementViews () {
    return this.getFunctionStateElements().map(el => state.paper.findViewByModel(el))
  }

  /**
   * Get all SendTransitionElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getSendTransitionElements () {
    return this.getLinks().filter(link => link.attributes.type === jointOptions.types.links.SEND_TRANSITION_ELEMENT)
  }

  /**
   * Get views of all SendTransitionElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getSendTransitionElementViews () {
    return this.getSendTransitionElements().map(el => state.paper.findViewByModel(el))
  }

  /**
   * Get all ReceiveTransitionElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getReceiveTransitionElements () {
    return this.getLinks().filter(link => link.attributes.type === jointOptions.types.links.RECEIVE_TRANSITION_ELEMENT)
  }

  /**
   * Get views of all SendTransitionElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getReceiveTransitionElementViews () {
    return this.getReceiveTransitionElements().map(el => state.paper.findViewByModel(el))
  }

  /**
   * Get all FunctionTransitionElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getFunctionTransitionElements () {
    return this.getLinks().filter(link => link.attributes.type === jointOptions.types.links.FUNCTION_TRANSITION_ELEMENT)
  }

  /**
   * Get views of all FunctionTransitionElements that are present on the canvas.
   * @return {Array} Array with objects.
   */
  getFunctionTransitionElementViews () {
    return this.getFunctionTransitionElements().map(el => state.paper.findViewByModel(el))
  }

  /***************************************************
   ************** CREATING NEW ELEMENTS **************
   ***************************************************/

  /**
   * Add a new SubjectElement to the canvas.
   * @param {object} options - Options defining how a new SubjectElement should look like.
   */
  addSubjectElement (options) {
    return this.addObjectToGraph(jointShapes.subjectElement(options))
  }

  /**
   * Add a new InterfaceSubjectElement to the canvas.
   * @param {object} options - Options defining how a new InterfaceSubjectElement should look like.
   */
  addInterfaceSubjectElement (options) {
    return this.addObjectToGraph(jointShapes.interfaceSubjectElement(options))
  }

  /**
   * Add a new MessageExchangeElement to the canvas.
   * @param {object} options - Options defining how a new MessageExchangeElement should look like.
   */
  addMessageExchangeElement (options) {
    return this.addObjectToGraph(jointShapes.messageExchangeElement(options))
  }

  /**
   * Add a new SendStateElement to the canvas.
   * @param {object} options - Options defining how a new SendStateElement should look like.
   */
  addSendStateElement (options) {
    return this.addObjectToGraph(jointShapes.sendStateElement(options))
  }

  /**
   * Add a new ReceiveStateElement to the canvas.
   * @param {object} options - Options defining how a new ReceiveStateElement should look like.
   */
  addReceiveStateElement (options) {
    return this.addObjectToGraph(jointShapes.receiveStateElement(options))
  }

  /**
   * Add a new FunctionStateElement to the canvas.
   * @param {object} options - Options defining how a new FunctionStateElement should look like.
   */
  addFunctionStateElement (options) {
    return this.addObjectToGraph(jointShapes.functionStateElement(options))
  }

  /**
   * Add a new SendTransitionElement to the canvas.
   * @param {object} options - Options defining how a new SendTransitionElement should look like.
   */
  addSendTransitionElement (options) {
    return this.addObjectToGraph(jointShapes.sendTransitionElement(options))
  }

  /**
   * Add a new ReceiveTransitionElement to the canvas.
   * @param {object} options - Options defining how a new ReceiveTransitionElement should look like.
   */
  addReceiveTransitionElement (options) {
    return this.addObjectToGraph(jointShapes.receiveTransitionElement(options))
  }

  /**
   * Add a new ReceiveTransitionElement to the canvas.
   * @param {object} options - Options defining how a new ReceiveTransitionElement should look like.
   */
  addFunctionTransitionElement (options) {
    return this.addObjectToGraph(jointShapes.functionTransitionElement(options))
  }

  /**
   * Add a new object to the graph.
   * @param {object} object - Object to be added to the canvas.
   */
  addObjectToGraph (object) {
    state.graph.addCell(object)
    object.toFront()

    this.configConnectors(object)

    return object
  }

  configConnectors (object) {
    if (object.get('type') === jointOptions.types.elements.SUBJECT_ELEMENT) {
      state.paper.findViewByModel(object).$box.find('.SubjectElement__connector-btn').mousedown(evt => {
        this.addMessageExchangeElement(jointService.createConnectorOptions(jointOptions.messageExchangeElementDefaults, evt))
      })
    } else if (object.get('type') === jointOptions.types.elements.INTERFACE_SUBJECT_ELEMENT) {
      state.paper.findViewByModel(object).$box.find('.InterfaceSubjectElement__connector-btn').mousedown(evt => {
        this.addMessageExchangeElement(jointService.createConnectorOptions(jointOptions.messageExchangeElementDefaults, evt))
      })
    } else if (object.get('type') === jointOptions.types.elements.SEND_STATE_ELEMENT) {
      state.paper.findViewByModel(object).$box.find('.SendStateElement__connector-btn').mousedown(evt => {
        this.addSendTransitionElement(jointService.createConnectorOptions(jointOptions.sendTransitionElementDefaults, evt))
      })
    } else if (object.get('type') === jointOptions.types.elements.RECEIVE_STATE_ELEMENT) {
      state.paper.findViewByModel(object).$box.find('.ReceiveStateElement__connector-btn').mousedown(evt => {
        this.addReceiveTransitionElement(jointService.createConnectorOptions(jointOptions.receiveTransitionElementDefaults, evt))
      })
    } else if (object.get('type') === jointOptions.types.elements.FUNCTION_STATE_ELEMENT) {
      state.paper.findViewByModel(object).$box.find('.FunctionStateElement__connector-btn').mousedown(evt => {
        this.addFunctionTransitionElement(jointService.createConnectorOptions(jointOptions.functionTransitionElementDefaults, evt))
      })
    } else {
      jointService.configDrawConnection(object)
    }
  }

  createConnectorOptions (defaults, evt) {
    const options = this.cloneObject(defaults)
    options.source = {id: this.getCurrentSelectedElement().id}
    options.target = {x: evt.originalEvent.x, y: evt.originalEvent.y}
    return options
  }

  configDrawConnection (object) {
    /** Unhighlight element and call toFront() in order the link to start directly from element and not selection box. */
    const sourceObjectView = this.getElementViews().find(el => el.model.get('id') === object.get('source').id)
    if (typeof sourceObjectView !== 'undefined' && sourceObjectView !== null) {
      sourceObjectView.unhighlightElement()
      sourceObjectView.highlightElement()
    }

    if (!state.loadElements) {
      state.drawConnection = true
      state.currentSelectedLink = object
    }
  }

  /**
   * Add a new object to the canvas.
   * @param {string} elementType - Defines the type of object to be added to the canvas.
   * @param {object} coordinates - Object containing x and y values.
   */
  createElement (elementType, coordinates) {
    if (elementType === jointOptions.elements.SUBJECT_ELEMENT) {
      this.addSubjectElement(this.addCoordinatesToElementOptions(jointOptions.subjectElementDefaults, coordinates))
    } else if (elementType === jointOptions.elements.INTERFACE_SUBJECT_ELEMENT) {
      this.addInterfaceSubjectElement(this.addCoordinatesToElementOptions(jointOptions.interfaceSubjectElementDefaults, coordinates))
    } else if (elementType === jointOptions.elements.SEND_STATE_ELEMENT) {
      this.addSendStateElement(this.addCoordinatesToElementOptions(jointOptions.sendStateElementDefaults, coordinates))
    } else if (elementType === jointOptions.elements.RECEIVE_STATE_ELEMENT) {
      this.addReceiveStateElement(this.addCoordinatesToElementOptions(jointOptions.receiveStateElementDefaults, coordinates))
    } else if (elementType === jointOptions.elements.FUNCTION_STATE_ELEMENT) {
      this.addFunctionStateElement(this.addCoordinatesToElementOptions(jointOptions.functionStateElementDefaults, coordinates))
    }
  }

  /**
   * Calculates coordinates where a new element should be added.
   * @param {object} defaults - Default options used to create a new element.
   * @param {object} coordinates - Object containing x and y values.
   * @return {object} Default options with calculated coordinates.
   */
  addCoordinatesToElementOptions (defaults, coordinates) {
    // TODO figure out a better way to calculate x and y values
    const scale = state.paper.scale()
    const translate = state.paper.translate()
    const options = this.cloneObject(defaults)

    if (coordinates) {
      options.position = {
        x: ((coordinates.x / scale.sx) - (options.size.width / 2)) + ((translate.tx * -1) / scale.sx),
        y: ((coordinates.y / scale.sy) - (options.size.height / 2)) + ((translate.ty * -1) / scale.sy)
      }
    }
    return options
  }

  /***************************************************
   ************* LOAD EXISTING ELEMENTS **************
   ***************************************************/

  /**
   * Load SubjectElements to the canvas.
   * @param {Array} Array containing all subjects that should be loaded into the canvas.
   */
  loadSubjectElements (subjects) {
    subjects.forEach(subject => {
      const options = this.cloneObject(jointOptions.subjectElementDefaults)
      options.id = subject.canvasId
      options.customAttrs.name = subject.name
      options.position = subject.position
      options.size = subject.size

      this.addSubjectElement(options)
    })
  }

  /**
   * Load InterfaceSubjectElements to the canvas.
   * @param {Array} Array containing all subjects that should be loaded into the canvas.
   */
  loadInterfaceSubjectElements (interfaceSubjects) {
    interfaceSubjects.forEach(interfaceSubject => {
      const options = this.cloneObject(jointOptions.interfaceSubjectElementDefaults)
      options.id = interfaceSubject.canvasId
      options.customAttrs.name = interfaceSubject.name
      options.customAttrs.reference = interfaceSubject.reference
      options.position = interfaceSubject.position
      options.size = interfaceSubject.size

      this.addInterfaceSubjectElement(options)
    })
  }

  /**
   * Load MessageExchanges to the canvas.
   * @param {Array} Array containing all messageConnectors that should be loaded into the canvas.
   */
  loadMessageExchanges (messageExchanges) {
    messageExchanges.forEach(messageExchange => {
      const options = this.cloneObject(jointOptions.messageExchangeElementDefaults)
      options.id = messageExchange.canvasId
      options.customAttrs.isBidirectional = messageExchange.isBidirectional
      options.customAttrs.sourceToTargetMessageSpecifications = messageExchange.sourceToTargetMessageSpecifications
      options.customAttrs.targetToSourceMessageSpecifications = messageExchange.targetToSourceMessageSpecifications
      options.source = messageExchange.source
      options.target = messageExchange.target
      options.vertices = messageExchange.vertices

      this.addMessageExchangeElement(options)
    })
  }

  /**
   * Load States to the canvas.
   * @param {Array} Array containing all states that should be loaded into the canvas for selected subject.
   */
  loadStates (states) {
    states.forEach(state => {
      if (state.type === jointOptions.types.elements.SEND_STATE_ELEMENT) {
        this.addSendStateElement(this.createStateOptions(jointOptions.sendStateElementDefaults, state))
      } else if (state.type === jointOptions.types.elements.RECEIVE_STATE_ELEMENT) {
        this.addReceiveStateElement(this.createStateOptions(jointOptions.receiveStateElementDefaults, state))
      } else if (state.type === jointOptions.types.elements.FUNCTION_STATE_ELEMENT) {
        this.addFunctionStateElement(this.createStateOptions(jointOptions.functionStateElementDefaults, state))
      }
    })
  }

  createStateOptions (defaults, state) {
    const options = this.cloneObject(defaults)
    options.id = state.canvasId
    options.customAttrs.name = state.name
    options.customAttrs.startState = state.startState
    options.customAttrs.endState = state.endState
    options.position = state.position
    options.size = state.size
    return options
  }

  /**
   * Load SendTransitions to the canvas.
   * @param {Array} Array containing all sendTransitions that should be loaded into the canvas for selected subject.
   */
  loadSendTransitions (sendTransitions) {
    sendTransitions.forEach(sendTransition => {
      const options = this.cloneObject(jointOptions.sendTransitionElementDefaults)
      options.id = sendTransition.canvasId
      options.customAttrs.subject = sendTransition.subject
      options.customAttrs.messageSpecification = sendTransition.messageSpecification
      options.source = sendTransition.source
      options.target = sendTransition.target
      options.vertices = sendTransition.vertices

      this.addSendTransitionElement(options)
    })
  }

  /**
   * Load ReceiveStateConnectors to the canvas.
   * @param {Array} Array containing all receiveStateConnectors that should be loaded into the canvas for selected subject.
   */
  loadReceiveTransitions (receiveTransitions) {
    receiveTransitions.forEach(receiveTransition => {
      const options = this.cloneObject(jointOptions.receiveTransitionElementDefaults)
      options.id = receiveTransition.canvasId
      options.customAttrs.subject = receiveTransition.subject
      options.customAttrs.messageSpecification = receiveTransition.messageSpecification
      options.source = receiveTransition.source
      options.target = receiveTransition.target
      options.vertices = receiveTransition.vertices

      this.addReceiveTransitionElement(options)
    })
  }

  /**
   * Load FunctionStateConnectors to the canvas.
   * @param {Array} Array containing all functionStateConnectors that should be loaded into the canvas for selected subject.
   */
  loadFunctionTransitions (functionTransitions) {
    functionTransitions.forEach(functionTransition => {
      const options = this.cloneObject(jointOptions.functionTransitionElementDefaults)
      options.id = functionTransition.canvasId
      options.customAttrs.name = functionTransition.name
      options.source = functionTransition.source
      options.target = functionTransition.target
      options.vertices = functionTransition.vertices

      this.addFunctionTransitionElement(options)
    })
  }

  /***************************************************
   ********************* COMMON **********************
   ***************************************************/

  /**
   * Removes all elements from the canvas.
   */
  clearGraph () {
    state.graph.clear({saveView: false})
    this.addOrigin()
  }

  /**
   * Removes selection box from all elements present on the canvas.
   */
  unhighlightAllElements () {
    this.getElementViews().forEach(el => el.unhighlightElement())
    this.getLinkViews().forEach(link => link.unhighlightElement())
  }

  /**
   * Create a copy of an object.
   */
  cloneObject (object) {
    return JSON.parse(JSON.stringify(object))
  }

  /**
   * Get currentSelectedElement in vuex store.
   */
  getCurrentSelectedElement () {
    return store.getters['modeler/currentSelectedElement']
  }

  /**
   * Set currentSelectedElement in vuex store.
   */
  setCurrentSelectedElement (element) {
    store.dispatch('modeler/setCurrentSelectedElement', element)
  }

  setSBDViewEnabled (value) {
    store.dispatch('modeler/setSbdViewEnabled', value)
  }

  getSubjectNameById (subjectId) {
    let subjectName = store.getters['subjects/getSubjectNameById'](subjectId)
    if (typeof subjectName === 'undefined') {
      subjectName = store.getters['interfaceSubjects/getInterfaceSubjectNameById'](subjectId)
    }
    return subjectName
  }

  getMessageSpecificationNameById (messageSpecificationId) {
    return store.getters['messageSpecifications/getMessageSpecificationNameById'](messageSpecificationId)
  }

  /**
   * Updates the currently selected element dynamically.
   * This is the connection between properties and the canvas.
   * @param {Object} Object containing new values that are needed to update element on the canvas.
   */
  updateElement (updatedElement) {
    const elementToModify = state.graph.getCell(store.getters['modeler/currentSelectedElement'].id)
    Object.keys(updatedElement).forEach(key => {
      elementToModify.get('customAttrs')[key] = updatedElement[key]
    })
    elementToModify.findView(state.paper).updateBox()
  }

  setLoadElements (value) {
    state.loadElements = value
  }

  setCanvasToOrigin () {
    state.paper.translate(0, 0)
    /** Update all elements */
    jointService.getElementViews().forEach(el => el.updateBox())

    /** Update all links */
    jointService.getLinkViews().forEach(link => link.updateBox())
  }

  /***************************************************
   ********************* EVENTS **********************
   ***************************************************/

  /**
   * Registers listeners on paper, graph and container element.
   */
  configureEventLisneters () {
    state.paper.on({
      'cell:pointerdown': this.cellPointerDownListener,
      'cell:pointerup': this.cellPointerUpListener,
      'blank:pointerdown': this.blankPointerDownListener
    })

    state.graph.on({
      'change': this.changeListener,
      'add': this.addListener,
      'remove': this.removeListener
    })

    $('#MCanvas').on({
      'mousemove': this.mousemoveListener,
      'mouseup': this.mouseupListener
    })
  }

  /**
   * Callback function used for 'cell:pointerdown' paper event.
   * Calls the highlightElement() function of the selected element that adds the selection box to it.
   */
  cellPointerDownListener (cellView, evt, x, y) {
    jointService.setCurrentSelectedElement(cellView.model.attributes)
    jointService.unhighlightAllElements()
    cellView.highlightElement()
  }

  /**
   * Callback function used for 'cell:pointerup' paper event.
   * Removes a new link if it is not connected to a target element.
   */
  cellPointerUpListener (cellView, evt, x, y) {
    Object.keys(jointOptions.types.links).forEach(key => {
      if (cellView.model.get('type') === jointOptions.types.links[key]) {
        if (cellView.model.getTargetElement() === null) {
          cellView.removeBox()
          cellView.model.remove()
        }
      }
    })
  }

  /**
   * Callback function used for 'blank:pointerdown' paper event.
   * Calls the unhighlightAllElements() of the jointjs service that removes the selection box from all elements present
   * on the canvas.
   */
  blankPointerDownListener (evt, x, y) {
    jointService.setCurrentSelectedElement(null)
    jointService.unhighlightAllElements()
  }

  changeListener (cell) {
    jointService.getLinkViews().forEach(link => link.updateBox())
  }

  addListener (cell) {
    if (cell !== null && cell.attributes.type !== jointOptions.types.elements.INTERFACE_SUBJECT_ELEMENT) {
      jointService.setSBDViewEnabled(true)
    }
  }

  removeListener (cell) {
    if (jointService.getSubjectElements().length === 0) {
      jointService.setSBDViewEnabled(false, null)
    }
    jointService.setCurrentSelectedElement(null)
  }

  /**
   * Callback function used for 'mousemove' container event.
   * Makes a new link draggable until it is connected with a target element.
   */
  mousemoveListener (evt) {
    if (state.drawConnection) {
      const linkView = state.paper.findViewByModel(state.currentSelectedLink)
      linkView.startArrowheadMove('target')

      const p = state.paper.snapToGrid({
        x: evt.originalEvent.x,
        y: evt.originalEvent.y
      })

      linkView.pointermove(evt, p.x, p.y)
    }
  }

  /**
   * Callback function used for 'mouseup' container event.
   * Resets all variables needed for dragging of a link.
   */
  mouseupListener (evt) {
    if (state.drawConnection) {
      state.drawConnection = false
      const linkView = state.paper.findViewByModel(state.currentSelectedLink)
      linkView.pointerup(evt)
      state.currentSelectedLink = null
    }
  }
}

/** Make the jointService a singleton */
const jointService = new JointService()
Object.freeze(jointService)

export default jointService
