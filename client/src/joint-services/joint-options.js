const views = {
  SID_VIEW: 'SID_VIEW',
  SBD_VIEW: 'SBD_VIEW'
}
const elements = {
  SUBJECT_ELEMENT: 'SUBJECT_ELEMENT',
  INTERFACE_SUBJECT_ELEMENT: 'INTERFACE_SUBJECT_ELEMENT',
  SEND_STATE_ELEMENT: 'SEND_STATE_ELEMENT',
  RECEIVE_STATE_ELEMENT: 'RECEIVE_STATE_ELEMENT',
  FUNCTION_STATE_ELEMENT: 'FUNCTION_STATE_ELEMENT'
}
const links = {
  MESSAGE_EXCHANGE_ELEMENT: 'MESSAGE_EXCHANGE_ELEMENT',
  SEND_TRANSITION_ELEMENT: 'SEND_TRANSITION_ELEMENT',
  RECEIVE_TRANSITION_ELEMENT: 'RECEIVE_TRANSITION_ELEMENT',
  FUNCTION_TRANSITION_ELEMENT: 'FUNCTION_TRANSITION_ELEMENT'
}
const types = {
  elements: {
    SUBJECT_ELEMENT: 'custom.SubjectElement',
    INTERFACE_SUBJECT_ELEMENT: 'custom.InterfaceSubjectElement',
    SEND_STATE_ELEMENT: 'custom.SendStateElement',
    RECEIVE_STATE_ELEMENT: 'custom.ReceiveStateElement',
    FUNCTION_STATE_ELEMENT: 'custom.FunctionStateElement'
  },
  links: {
    MESSAGE_EXCHANGE_ELEMENT: 'custom.MessageExchangeElement',
    SEND_TRANSITION_ELEMENT: 'custom.SendTransitionElement',
    RECEIVE_TRANSITION_ELEMENT: 'custom.ReceiveTransitionElement',
    FUNCTION_TRANSITION_ELEMENT: 'custom.FunctionTransitionElement'
  }
}

const highlighterDefaults = {
  highlighter: {
    name: 'stroke',
    options: {
      padding: 10,
      attrs: {
        'stroke-width': 1,
        stroke: '#000000',
        'stroke-dasharray': '5, 5',
        'fill-opacity': 1
      }
    }
  }
}

/** Default options used to create a new SubjectElement */
const subjectElementDefaults = {
  position: {x: 0, y: 0},
  size: {width: 161.803, height: 100},
  attrs: {rect: {cursor: 'pointer', stroke: 'none', 'fill-opacity': 0, fill: 'blue'}},
  customAttrs: {
    name: 'Subject',
    startSubject: false,
    isHighlighted: false
  }
}

/** Default options used to create a new InterfaceSubjectElement */
const interfaceSubjectElementDefaults = {
  position: {x: 0, y: 0},
  size: {width: 161.803, height: 100},
  attrs: {rect: {cursor: 'pointer', stroke: 'none', 'fill-opacity': 0, fill: 'blue'}},
  customAttrs: {
    name: 'Interface Subject',
    reference: null,
    isHighlighted: false
  }
}

/** Default options used to create a new MessageExchangeElement */
const messageExchangeElementDefaults = {
  source: {},
  target: {},
  attrs: {
    '.connection': {stroke: '#222138', 'stroke-width': 3},
    '.marker-target': {fill: '#000000', d: 'M 10 0 L 0 5 L 10 10 z'}
  },
  router: { name: 'orthogonal' },
  labels: [{
    position: 0.5,
    attrs: {
      text: { text: 'PH', fill: '#f6f6f6', 'font-family': 'sans-serif' },
      rect: { stroke: '#7c68fc', 'stroke-width': 50, fill: '#7c68fc', rx: 0, ry: 0 }
    }}],
  customAttrs: {
    isBidirectional: false,
    sourceToTargetMessageSpecifications: [],
    targetToSourceMessageSpecifications: []
  }
}

/** Default options used to create a new SendStateElement */
const sendStateElementDefaults = {
  position: {x: 0, y: 0},
  size: {width: 161.803, height: 100},
  attrs: {rect: {cursor: 'pointer', stroke: 'none', 'fill-opacity': 0, fill: 'blue'}},
  customAttrs: {
    name: 'Send State',
    startState: false,
    endState: false,
    isHighlighted: false
  }
}

/** Default options used to create a new ReceiveStateElement */
const receiveStateElementDefaults = {
  position: {x: 0, y: 0},
  size: {width: 161.803, height: 100},
  attrs: {rect: {cursor: 'pointer', stroke: 'none', 'fill-opacity': 0, fill: 'blue'}},
  customAttrs: {
    name: 'Receive State',
    startState: false,
    endState: false,
    isHighlighted: false
  }
}

/** Default options used to create a new FunctionStateElement */
const functionStateElementDefaults = {
  position: {x: 0, y: 0},
  size: {width: 161.803, height: 100},
  attrs: {rect: {cursor: 'pointer', stroke: 'none', 'fill-opacity': 0, fill: 'blue'}},
  customAttrs: {
    name: 'Function State',
    startState: false,
    endState: false,
    type: null,
    isHighlighted: false
  }
}

/** Default options used to create a new SendTransitionElement */
const sendTransitionElementDefaults = {
  source: {},
  target: {},
  attrs: {
    '.connection': {stroke: '#222138', 'stroke-width': 3},
    '.marker-target': {fill: '#000000', d: 'M 10 0 L 0 5 L 10 10 z'}
  },
  router: { name: 'orthogonal' },
  labels: [{
    position: 0.5,
    attrs: {
      text: { text: 'PLACEHHOLDER', fill: '#f6f6f6', 'font-family': 'sans-serif' },
      rect: { stroke: '#7c68fc', 'stroke-width': 60, fill: '#7c68fc', rx: 0, ry: 0 }
    }}],
  customAttrs: {
    subject: null,
    messageSpecification: null
  }
}

/** Default options used to create a new ReceiveTransitionElement */
const receiveTransitionElementDefaults = {
  source: {},
  target: {},
  attrs: {
    '.connection': {stroke: '#222138', 'stroke-width': 3},
    '.marker-target': {fill: '#000000', d: 'M 10 0 L 0 5 L 10 10 z'}
  },
  router: { name: 'orthogonal' },
  labels: [{
    position: 0.5,
    attrs: {
      text: { text: 'PLACEHHOLDER', fill: '#f6f6f6', 'font-family': 'sans-serif' },
      rect: { stroke: '#7c68fc', 'stroke-width': 60, fill: '#7c68fc', rx: 0, ry: 0 }
    }}],
  customAttrs: {
    subject: null,
    messageSpecification: null
  }
}

/** Default options used to create a new FunctionTransitionElement */
const functionTransitionElementDefaults = {
  source: {},
  target: {},
  attrs: {
    '.connection': {stroke: '#222138', 'stroke-width': 3},
    '.marker-target': {fill: '#000000', d: 'M 10 0 L 0 5 L 10 10 z'}
  },
  router: { name: 'orthogonal' },
  labels: [{
    position: 0.5,
    attrs: {
      text: { text: 'PLACEHHOLDER', fill: '#f6f6f6', 'font-family': 'sans-serif' },
      rect: { stroke: '#7c68fc', 'stroke-width': 60, fill: '#7c68fc', rx: 0, ry: 0 }
    }}],
  customAttrs: {
    name: null
  }
}

/** Object containing all functions and values for creating custom elements */
const jointOptions = {
  views: views,
  elements: elements,
  links: links,
  types: types,
  highlighterDefaults: highlighterDefaults,
  subjectElementDefaults: subjectElementDefaults,
  interfaceSubjectElementDefaults: interfaceSubjectElementDefaults,
  messageExchangeElementDefaults: messageExchangeElementDefaults,
  sendStateElementDefaults: sendStateElementDefaults,
  receiveStateElementDefaults: receiveStateElementDefaults,
  functionStateElementDefaults: functionStateElementDefaults,
  sendTransitionElementDefaults: sendTransitionElementDefaults,
  receiveTransitionElementDefaults: receiveTransitionElementDefaults,
  functionTransitionElementDefaults: functionTransitionElementDefaults
}

export default jointOptions
