import joint from 'jointjs'
import $ from 'jquery'
import _ from 'lodash'
import jointOptions from '@/joint-services/joint-options'
import jointService from '@/joint-services/joint-service'

/** Object that will contain all custom shapes */
joint.shapes.custom = {}

const shorten = function (text, maxLength) {
  var ret = text
  if (ret.length > maxLength) {
    ret = ret.substr(0, maxLength - 3) + '...'
  }
  return ret
}

/***************************************************
 **************** SubjectElement *******************
 ***************************************************/

/** SubjectElement - jointjs definition */
joint.shapes.custom.SubjectElement = joint.shapes.basic.Rect.extend({
  defaults: joint.util.deepSupplement({
    type: jointOptions.types.elements.SUBJECT_ELEMENT
  }, joint.shapes.basic.Rect.prototype.defaults)
})

/** Custom view for SubjectElement that displays an HTML div above it */
joint.shapes.custom.SubjectElementView = joint.dia.ElementView.extend({

  template: [
    '<div class="SubjectElement">',
    '<div class="SubjectElement__name"></div>',
    '<button class="SubjectElement__remove-btn"><i class="fa fa-trash-o" aria-hidden="true"></i></button>',
    '<button class="SubjectElement__connector-btn"><i class="fa fa-long-arrow-right" aria-hidden="true"></i></button>',
    '</div>'
  ].join(''),

  initialize: function () {
    _.bindAll(this, 'updateBox')
    _.bindAll(this, 'highlightElement')
    _.bindAll(this, 'unhighlightElement')
    joint.dia.ElementView.prototype.initialize.apply(this, arguments)

    this.$box = $(_.template(this.template)())

    // This is an example of reacting on the input change and storing the input data in the cell model.
    this.$box.find('.SubjectElement__remove-btn').on('click', _.bind(this.model.remove, this.model))

    // Update the box position whenever the underlying model changes.
    this.model.on('change', this.updateBox, this)
    // Remove the box when the model gets removed from the graph.
    this.model.on('remove', this.removeBox, this)

    this.updateBox()
  },
  render: function () {
    joint.dia.ElementView.prototype.render.apply(this, arguments)
    this.paper.$el.prepend(this.$box)
    this.updateBox()
    return this
  },
  updateBox: function () {
    let sx = 0
    let sy = 0

    /** Get the translate value of the paper. The tx and ty values will be used when the canvas is dragged around. */
    if (typeof this.paper !== 'undefined') {
      sx = this.paper.scale().sx
      sy = this.paper.scale().sy
    }

    const customAttrs = this.model.get('customAttrs')
    const bbox = this.getBBox()
    const modelBbox = this.model.getBBox()
    const zIndex = this.model.get('z')
    const seName = this.$box.find('.SubjectElement__name')
    const seRemoveBtn = this.$box.find('.SubjectElement__remove-btn')
    const seConnectorBtn = this.$box.find('.SubjectElement__connector-btn')

    const bboxWidth = modelBbox.width * sx
    const bboxHeight = modelBbox.height * sy
    let left = bbox.x
    let top = bbox.y + 48

    seName.text(shorten(customAttrs.name, 90))

    if (customAttrs.isHighlighted) {
      left = left + (5 * sx)
      top = top + (5 * sy)
    }

    this.$box.css({
      position: 'fixed',
      width: bboxWidth,
      height: bboxHeight,
      left: left,
      top: top,
      'z-index': zIndex
    })

    seName.css({
      position: 'fixed',
      left: left + (bboxWidth / 2) - ((seName.width()) / 2),
      top: top + (bboxHeight / 2) - ((seName.height() * sy) / (2 * sy))
    })

    seRemoveBtn.css({
      left: bboxWidth + (10 * sx)
    })

    seConnectorBtn.css({
      left: bboxWidth + (10 * sx)
    })
  },
  highlightElement: function () {
    this.model.get('customAttrs').isHighlighted = true
    this.model.toFront()
    this.highlight(null, jointOptions.highlighterDefaults)
    this.updateBox()
    this.$box.find('.SubjectElement__remove-btn').css({visibility: 'visible'})
    this.$box.find('.SubjectElement__connector-btn').css({visibility: 'visible'})
  },
  unhighlightElement: function () {
    this.model.get('customAttrs').isHighlighted = false
    this.unhighlight(null, jointOptions.highlighterDefaults)
    this.$box.find('.SubjectElement__remove-btn').css({visibility: 'hidden'})
    this.$box.find('.SubjectElement__connector-btn').css({visibility: 'hidden'})
    this.$box.css('z-index', 0)
  },
  removeBox: function (evt) {
    this.$box.remove()
  }
})

/** Create a new SubjectElement */
const subjectElement = (options) => {
  options = options || jointOptions.subjectElementDefaults
  return new joint.shapes.custom.SubjectElement(options)
}

/***************************************************
 ************ InterfaceSubjectElement **************
 ***************************************************/

/** InterfaceSubjectElement - jointjs definition */
joint.shapes.custom.InterfaceSubjectElement = joint.shapes.basic.Rect.extend({
  defaults: joint.util.deepSupplement({
    type: jointOptions.types.elements.INTERFACE_SUBJECT_ELEMENT
  }, joint.shapes.basic.Rect.prototype.defaults)
})

/** Custom view for InterfaceSubjectElement that displays an HTML div above it */
joint.shapes.custom.InterfaceSubjectElementView = joint.dia.ElementView.extend({

  template: [
    '<div class="InterfaceSubjectElement">',
    '<div class="InterfaceSubjectElement__name"></div>',
    '<button class="InterfaceSubjectElement__remove-btn"><i class="fa fa-trash-o" aria-hidden="true"></i></button>',
    '<button class="InterfaceSubjectElement__connector-btn"><i class="fa fa-long-arrow-right" aria-hidden="true"></i></button>',
    '</div>'
  ].join(''),

  initialize: function () {
    _.bindAll(this, 'updateBox')
    _.bindAll(this, 'highlightElement')
    _.bindAll(this, 'unhighlightElement')
    joint.dia.ElementView.prototype.initialize.apply(this, arguments)

    this.$box = $(_.template(this.template)())

    // This is an example of reacting on the input change and storing the input data in the cell model.
    this.$box.find('.InterfaceSubjectElement__remove-btn').on('click', _.bind(this.model.remove, this.model))

    // Update the box position whenever the underlying model changes.
    this.model.on('change', this.updateBox, this)
    // Remove the box when the model gets removed from the graph.
    this.model.on('remove', this.removeBox, this)

    this.updateBox()
  },
  render: function () {
    joint.dia.ElementView.prototype.render.apply(this, arguments)
    this.paper.$el.prepend(this.$box)
    this.updateBox()
    return this
  },
  updateBox: function () {
    let sx = 0
    let sy = 0

    /** Get the translate value of the paper. The tx and ty values will be used when the canvas is dragged around. */
    if (typeof this.paper !== 'undefined') {
      sx = this.paper.scale().sx
      sy = this.paper.scale().sy
    }

    const customAttrs = this.model.get('customAttrs')
    const bbox = this.getBBox()
    const modelBbox = this.model.getBBox()
    const zIndex = this.model.get('z')
    const seName = this.$box.find('.InterfaceSubjectElement__name')
    const seRemoveBtn = this.$box.find('.InterfaceSubjectElement__remove-btn')
    const seConnectorBtn = this.$box.find('.InterfaceSubjectElement__connector-btn')

    const bboxWidth = modelBbox.width * sx
    const bboxHeight = modelBbox.height * sy
    let left = bbox.x
    let top = bbox.y + 48

    seName.text(shorten(customAttrs.name, 90))

    if (customAttrs.isHighlighted) {
      left = left + (5 * sx)
      top = top + (5 * sy)
    }

    this.$box.css({
      position: 'fixed',
      width: bboxWidth,
      height: bboxHeight,
      left: left,
      top: top,
      'z-index': zIndex
    })

    seName.css({
      position: 'fixed',
      left: left + (bboxWidth / 2) - ((seName.width()) / 2),
      top: top + (bboxHeight / 2) - ((seName.height() * sy) / (2 * sy))
    })

    seRemoveBtn.css({
      left: bboxWidth + (10 * sx)
    })

    seConnectorBtn.css({
      left: bboxWidth + (10 * sx)
    })
  },
  highlightElement: function () {
    this.model.get('customAttrs').isHighlighted = true
    this.model.toFront()
    this.highlight(null, jointOptions.highlighterDefaults)
    this.updateBox()
    this.$box.find('.InterfaceSubjectElement__remove-btn').css({visibility: 'visible'})
    this.$box.find('.InterfaceSubjectElement__connector-btn').css({visibility: 'visible'})
  },
  unhighlightElement: function () {
    this.model.get('customAttrs').isHighlighted = false
    this.unhighlight(null, jointOptions.highlighterDefaults)
    this.$box.find('.InterfaceSubjectElement__remove-btn').css({visibility: 'hidden'})
    this.$box.find('.InterfaceSubjectElement__connector-btn').css({visibility: 'hidden'})
    this.$box.css('z-index', 0)
  },
  removeBox: function (evt) {
    this.$box.remove()
  }
})

/** Create a new InterfaceSubjectElement */
const interfaceSubjectElement = (options) => {
  options = options || jointOptions.interfaceSubjectElementDefaults
  return new joint.shapes.custom.InterfaceSubjectElement(options)
}

/***************************************************
 ************* MessageExchangeElement *************
 ***************************************************/

/** MessageExchangeElement - jointjs definition */
joint.shapes.custom.MessageExchangeElement = joint.dia.Link.extend({
  defaults: joint.util.deepSupplement({
    type: jointOptions.types.links.MESSAGE_EXCHANGE_ELEMENT
  }, joint.dia.Link.prototype.defaults)
})

// Custom view for MessageExchangeElement that displays an HTML div above it
joint.shapes.custom.MessageExchangeElementView = joint.dia.LinkView.extend({
  template: [
    '<div class="MessageExchangeElement">',
    '<div class="MessageExchangeElement__selector"></div>',
    '<div class="MessageExchangeElement__unidirectional"><i class="fa fa-long-arrow-right" aria-hidden="true"></i></div>',
    '<div class="MessageExchangeElement__bidirectional"><i class="fa fa-exchange" aria-hidden="true"></i></div>',
    '<button class="MessageExchangeElement__remove-btn" aria-label="Test"><i class="fa fa-trash-o" aria-hidden="true"></i></button>',
    '</div>'
  ].join(''),
  initialize: function () {
    _.bindAll(this, 'updateBox')
    _.bindAll(this, 'highlightElement')
    _.bindAll(this, 'unhighlightElement')
    joint.dia.LinkView.prototype.initialize.apply(this, arguments)
    this.$box = $(_.template(this.template)())
    this.model.on('change', this.updateBox, this)
    this.model.on('remove', this.removeBox, this)
    this.updateBox()
  },
  render: function () {
    joint.dia.LinkView.prototype.render.apply(this, arguments)
    this.paper.$el.prepend(this.$box)
    this.$box.find('.MessageExchangeElement__remove-btn').on('click', _.bind(this.model.remove, this.model))
    this.updateBox()
    return this
  },
  updateBox: function () {
    let sx = 0
    let sy = 0
    let tx = 0
    let ty = 0

    /** Get the translate value of the paper. The tx and ty values will be used when the canvas is dragged around. */
    if (typeof this.paper !== 'undefined') {
      sx = this.paper.scale().sx
      sy = this.paper.scale().sy
      tx = this.paper.translate().tx
      ty = this.paper.translate().ty
    }

    const zIndex = this.model.get('z')
    const customAttrs = this.model.get('customAttrs')
    const selector = this.$box.find('.MessageExchangeElement__selector')
    const removeBtn = this.$box.find('.MessageExchangeElement__remove-btn')
    const unidirectional = this.$box.find('.MessageExchangeElement__unidirectional')
    const bidirectional = this.$box.find('.MessageExchangeElement__bidirectional')

    if (customAttrs.isBidirectional) {
      unidirectional.css({
        visibility: 'hidden'
      })
      bidirectional.css({
        visibility: 'visible'
      })
    } else {
      unidirectional.css({
        visibility: 'visible'
      })
      bidirectional.css({
        visibility: 'hidden'
      })
    }

    let position = {x: 0, y: 0}
    if (typeof this._V !== 'undefined' && position.x === 0 && position.y === 0) {
      var connectionEl = this.$('.connection')[0]
      var connectionLength = connectionEl.getTotalLength()
      position = connectionEl.getPointAtLength(connectionLength / 2)

      if (customAttrs.isBidirectional) {
        this.model.attr({'.marker-source': {fill: '#000000', d: 'M 10 0 L 0 5 L 10 10 z'}})
      } else {
        this.model.removeAttr('.marker-source')
      }
    }

    const boxWidth = 70 * sx
    const boxHeight = 70 * sy
    const left = ((position.x * sx) - (boxWidth / 2)) + tx
    const top = ((position.y * sy) - (boxHeight / 2)) + ty

    this.$box.css({
      width: boxWidth,
      height: boxHeight,
      left: left,
      top: top,
      'z-index': zIndex
    })

    selector.css({
      width: boxWidth + 15,
      height: boxHeight + 15,
      'z-index': zIndex
    })

    unidirectional.css({
      position: 'fixed',
      left: left + (boxWidth / 2) - (unidirectional.width() / 2),
      top: top + (5 * sy) + (boxHeight / (2 * sy)) + ((unidirectional.height() * sy) / 2)
    })

    bidirectional.css({
      position: 'fixed',
      left: left + (boxWidth / 2) - (bidirectional.width() / 2),
      top: top + (5 * sy) + (boxHeight / (2 * sy)) + ((bidirectional.height() * sy) / 2)
    })

    removeBtn.css({
      left: boxWidth + (10 * sx)
    })
  },
  removeBox: function (evt) {
    this.$box.remove()
  },
  highlightElement: function () {
    this.model.toFront()
    this.updateBox()
    this.$box.find('.MessageExchangeElement__selector').css({visibility: 'visible'})
    this.$box.find('.MessageExchangeElement__remove-btn').css({visibility: 'visible'})
  },
  unhighlightElement: function () {
    this.$box.find('.MessageExchangeElement__selector').css({visibility: 'hidden'})
    this.$box.find('.MessageExchangeElement__remove-btn').css({visibility: 'hidden'})
  }
})

/** Create a new MessageExchangeElement */
const messageExchangeElement = (options) => {
  options = options || jointOptions.messageExchangeElementDefaults
  return new joint.shapes.custom.MessageExchangeElement(options)
}

/***************************************************
 ***************** SendStateElement ****************
 ***************************************************/

/** SendStateElement - jointjs definition */
joint.shapes.custom.SendStateElement = joint.shapes.basic.Rect.extend({
  defaults: joint.util.deepSupplement({
    type: jointOptions.types.elements.SEND_STATE_ELEMENT
  }, joint.shapes.basic.Rect.prototype.defaults)
})

/** Custom view for SendStateElement that displays an HTML div above it */
joint.shapes.custom.SendStateElementView = joint.dia.ElementView.extend({

  template: [
    '<div class="SendStateElement">',
    '<div>',
    '<div class="SendStateElement__icon"><i class="fa fa-paper-plane" aria-hidden="true"></i></div>',
    '<div class="SendStateElement__indicator"><i class="fa" aria-hidden="true"></i></div>',
    '</div>',
    '<div class="SendStateElement__name"></div>',
    '<button class="SendStateElement__remove-btn"><i class="fa fa-trash-o" aria-hidden="true"></i></button>',
    '<button class="SendStateElement__connector-btn"><i class="fa fa-long-arrow-right" aria-hidden="true"></i></button>',
    '</div>'
  ].join(''),

  initialize: function () {
    _.bindAll(this, 'updateBox')
    _.bindAll(this, 'highlightElement')
    _.bindAll(this, 'unhighlightElement')
    joint.dia.ElementView.prototype.initialize.apply(this, arguments)

    this.$box = $(_.template(this.template)())

    // This is an example of reacting on the input change and storing the input data in the cell model.
    this.$box.find('.SendStateElement__remove-btn').on('click', _.bind(this.model.remove, this.model))

    // Update the box position whenever the underlying model changes.
    this.model.on('change', this.updateBox, this)
    // Remove the box when the model gets removed from the graph.
    this.model.on('remove', this.removeBox, this)

    this.updateBox()
  },
  render: function () {
    joint.dia.ElementView.prototype.render.apply(this, arguments)
    this.paper.$el.prepend(this.$box)
    this.updateBox()
    return this
  },
  updateBox: function () {
    let sx = 0
    let sy = 0

    /** Get the translate value of the paper. The tx and ty values will be used when the canvas is dragged around. */
    if (typeof this.paper !== 'undefined') {
      sx = this.paper.scale().sx
      sy = this.paper.scale().sy
    }

    const customAttrs = this.model.get('customAttrs')
    const bbox = this.getBBox()
    const modelBbox = this.model.getBBox()
    const zIndex = this.model.get('z')
    const sseName = this.$box.find('.SendStateElement__name')
    const sseRemoveBtn = this.$box.find('.SendStateElement__remove-btn')
    const sseConnectorBtn = this.$box.find('.SendStateElement__connector-btn')
    const sseIndicator = this.$box.find('.SendStateElement__indicator')

    const bboxWidth = modelBbox.width * sx
    const bboxHeight = modelBbox.height * sy
    let left = bbox.x
    let top = bbox.y + 48

    sseName.text(shorten(customAttrs.name, 90))

    if (customAttrs.isHighlighted) {
      left = left + (5 * sx)
      top = top + (5 * sy)
    }

    if (customAttrs.startState) {
      sseIndicator.css({visibility: 'visible'})
      sseIndicator.find('i').addClass('fa-play')
      sseIndicator.find('i').removeClass('fa-stop')
    } else if (customAttrs.endState) {
      sseIndicator.css({visibility: 'visible'})
      sseIndicator.find('i').removeClass('fa-play')
      sseIndicator.find('i').addClass('fa-stop')
    } else {
      sseIndicator.css({visibility: 'hidden'})
    }

    this.$box.css({
      position: 'fixed',
      width: bboxWidth,
      height: bboxHeight,
      left: left,
      top: top,
      'z-index': zIndex
    })

    sseName.css({
      position: 'fixed',
      left: left + (bboxWidth / 2) - ((sseName.width()) / 2),
      top: top + (bboxHeight / 2) - ((sseName.height() * sy) / (2 * sy))
    })

    sseRemoveBtn.css({
      left: bboxWidth + (10 * sx)
    })

    sseConnectorBtn.css({
      left: bboxWidth + (10 * sx)
    })
  },
  highlightElement: function () {
    this.model.get('customAttrs').isHighlighted = true
    this.model.toFront()
    this.highlight(null, jointOptions.highlighterDefaults)
    this.updateBox()
    this.$box.find('.SendStateElement__remove-btn').css({visibility: 'visible'})
    this.$box.find('.SendStateElement__connector-btn').css({visibility: 'visible'})
  },
  unhighlightElement: function () {
    this.model.get('customAttrs').isHighlighted = false
    this.unhighlight(null, jointOptions.highlighterDefaults)
    this.$box.find('.SendStateElement__remove-btn').css({visibility: 'hidden'})
    this.$box.find('.SendStateElement__connector-btn').css({visibility: 'hidden'})
    this.$box.css('z-index', 0)
  },
  removeBox: function (evt) {
    this.$box.remove()
  }
})

/** Create a new SendStateElement */
const sendStateElement = (options) => {
  options = options || jointOptions.sendStateElementDefaults
  return new joint.shapes.custom.SendStateElement(options)
}

/***************************************************
 *************** ReceiveStateElement ***************
 ***************************************************/

/** ReceiveStateElement - jointjs definition */
joint.shapes.custom.ReceiveStateElement = joint.shapes.basic.Rect.extend({
  defaults: joint.util.deepSupplement({
    type: jointOptions.types.elements.RECEIVE_STATE_ELEMENT
  }, joint.shapes.basic.Rect.prototype.defaults)
})

/** Custom view for ReceiveStateElement that displays an HTML div above it */
joint.shapes.custom.ReceiveStateElementView = joint.dia.ElementView.extend({

  template: [
    '<div class="ReceiveStateElement">',
    '<div>',
    '<div class="ReceiveStateElement__icon"><i class="fa fa-envelope" aria-hidden="true"></i></div>',
    '<div class="ReceiveStateElement__indicator"><i class="fa" aria-hidden="true"></i></div>',
    '</div>',
    '<div class="ReceiveStateElement__name"></div>',
    '<button class="ReceiveStateElement__remove-btn"><i class="fa fa-trash-o" aria-hidden="true"></i></button>',
    '<button class="ReceiveStateElement__connector-btn"><i class="fa fa-long-arrow-right" aria-hidden="true"></i></button>',
    '</div>'
  ].join(''),

  initialize: function () {
    _.bindAll(this, 'updateBox')
    _.bindAll(this, 'highlightElement')
    _.bindAll(this, 'unhighlightElement')
    joint.dia.ElementView.prototype.initialize.apply(this, arguments)

    this.$box = $(_.template(this.template)())

    // This is an example of reacting on the input change and storing the input data in the cell model.
    this.$box.find('.ReceiveStateElement__remove-btn').on('click', _.bind(this.model.remove, this.model))

    // Update the box position whenever the underlying model changes.
    this.model.on('change', this.updateBox, this)
    // Remove the box when the model gets removed from the graph.
    this.model.on('remove', this.removeBox, this)

    this.updateBox()
  },
  render: function () {
    joint.dia.ElementView.prototype.render.apply(this, arguments)
    this.paper.$el.prepend(this.$box)
    this.updateBox()
    return this
  },
  updateBox: function () {
    let sx = 0
    let sy = 0

    /** Get the translate value of the paper. The tx and ty values will be used when the canvas is dragged around. */
    if (typeof this.paper !== 'undefined') {
      sx = this.paper.scale().sx
      sy = this.paper.scale().sy
    }

    const customAttrs = this.model.get('customAttrs')
    const bbox = this.getBBox()
    const modelBbox = this.model.getBBox()
    const zIndex = this.model.get('z')
    const rseName = this.$box.find('.ReceiveStateElement__name')
    const rseRemoveBtn = this.$box.find('.ReceiveStateElement__remove-btn')
    const rseConnectorBtn = this.$box.find('.ReceiveStateElement__connector-btn')
    const rseIndicator = this.$box.find('.ReceiveStateElement__indicator')

    const bboxWidth = modelBbox.width * sx
    const bboxHeight = modelBbox.height * sy
    let left = bbox.x
    let top = bbox.y + 48

    rseName.text(shorten(customAttrs.name, 90))

    if (customAttrs.isHighlighted) {
      left = left + (5 * sx)
      top = top + (5 * sy)
    }

    if (customAttrs.startState) {
      rseIndicator.css({visibility: 'visible'})
      rseIndicator.find('i').addClass('fa-play')
      rseIndicator.find('i').removeClass('fa-stop')
    } else if (customAttrs.endState) {
      rseIndicator.css({visibility: 'visible'})
      rseIndicator.find('i').removeClass('fa-play')
      rseIndicator.find('i').addClass('fa-stop')
    } else {
      rseIndicator.css({visibility: 'hidden'})
    }

    this.$box.css({
      position: 'fixed',
      width: bboxWidth,
      height: bboxHeight,
      left: left,
      top: top,
      'z-index': zIndex
    })

    rseName.css({
      position: 'fixed',
      left: left + (bboxWidth / 2) - ((rseName.width()) / 2),
      top: top + (bboxHeight / 2) - ((rseName.height() * sy) / (2 * sy))
    })

    rseRemoveBtn.css({
      left: bboxWidth + (10 * sx)
    })

    rseConnectorBtn.css({
      left: bboxWidth + (10 * sx)
    })
  },
  highlightElement: function () {
    this.model.get('customAttrs').isHighlighted = true
    this.model.toFront()
    this.highlight(null, jointOptions.highlighterDefaults)
    this.updateBox()
    this.$box.find('.ReceiveStateElement__remove-btn').css({visibility: 'visible'})
    this.$box.find('.ReceiveStateElement__connector-btn').css({visibility: 'visible'})
  },
  unhighlightElement: function () {
    this.model.get('customAttrs').isHighlighted = false
    this.unhighlight(null, jointOptions.highlighterDefaults)
    this.$box.find('.ReceiveStateElement__remove-btn').css({visibility: 'hidden'})
    this.$box.find('.ReceiveStateElement__connector-btn').css({visibility: 'hidden'})
    this.$box.css('z-index', 0)
  },
  removeBox: function (evt) {
    this.$box.remove()
  }
})

/** Create a new ReceiveStateElement */
const receiveStateElement = (options) => {
  options = options || jointOptions.receiveStateElementDefaults
  return new joint.shapes.custom.ReceiveStateElement(options)
}

/***************************************************
 ************** FunctionStateElement ***************
 ***************************************************/

/** FunctionStateElement - jointjs definition */
joint.shapes.custom.FunctionStateElement = joint.shapes.basic.Rect.extend({
  defaults: joint.util.deepSupplement({
    type: jointOptions.types.elements.FUNCTION_STATE_ELEMENT
  }, joint.shapes.basic.Rect.prototype.defaults)
})

/** Custom view for FunctionStateElement that displays an HTML div above it */
joint.shapes.custom.FunctionStateElementView = joint.dia.ElementView.extend({

  template: [
    '<div class="FunctionStateElement">',
    '<div>',
    '<div class="FunctionStateElement__icon"><i class="fa fa-cog" aria-hidden="true"></i></div>',
    '<div class="FunctionStateElement__indicator"><i class="fa" aria-hidden="true"></i></div>',
    '</div>',
    '<div class="FunctionStateElement__name"></div>',
    '<button class="FunctionStateElement__remove-btn"><i class="fa fa-trash-o" aria-hidden="true"></i></button>',
    '<button class="FunctionStateElement__connector-btn"><i class="fa fa-long-arrow-right" aria-hidden="true"></i></button>',
    '</div>'
  ].join(''),

  initialize: function () {
    _.bindAll(this, 'updateBox')
    _.bindAll(this, 'highlightElement')
    _.bindAll(this, 'unhighlightElement')
    joint.dia.ElementView.prototype.initialize.apply(this, arguments)

    this.$box = $(_.template(this.template)())

    // This is an example of reacting on the input change and storing the input data in the cell model.
    this.$box.find('.FunctionStateElement__remove-btn').on('click', _.bind(this.model.remove, this.model))

    // Update the box position whenever the underlying model changes.
    this.model.on('change', this.updateBox, this)
    // Remove the box when the model gets removed from the graph.
    this.model.on('remove', this.removeBox, this)

    this.updateBox()
  },
  render: function () {
    joint.dia.ElementView.prototype.render.apply(this, arguments)
    this.paper.$el.prepend(this.$box)
    this.updateBox()
    return this
  },
  updateBox: function () {
    let sx = 0
    let sy = 0

    /** Get the translate value of the paper. The tx and ty values will be used when the canvas is dragged around. */
    if (typeof this.paper !== 'undefined') {
      sx = this.paper.scale().sx
      sy = this.paper.scale().sy
    }

    const customAttrs = this.model.get('customAttrs')
    const bbox = this.getBBox()
    const modelBbox = this.model.getBBox()
    const zIndex = this.model.get('z')
    const fseName = this.$box.find('.FunctionStateElement__name')
    const fseRemoveBtn = this.$box.find('.FunctionStateElement__remove-btn')
    const fseConnectorBtn = this.$box.find('.FunctionStateElement__connector-btn')
    const fseIndicator = this.$box.find('.FunctionStateElement__indicator')

    const bboxWidth = modelBbox.width * sx
    const bboxHeight = modelBbox.height * sy
    let left = bbox.x
    let top = bbox.y + 48

    fseName.text(shorten(customAttrs.name, 90))

    if (customAttrs.isHighlighted) {
      left = left + (5 * sx)
      top = top + (5 * sy)
    }

    if (customAttrs.startState) {
      fseIndicator.css({visibility: 'visible'})
      fseIndicator.find('i').addClass('fa-play')
      fseIndicator.find('i').removeClass('fa-stop')
    } else if (customAttrs.endState) {
      fseIndicator.css({visibility: 'visible'})
      fseIndicator.find('i').removeClass('fa-play')
      fseIndicator.find('i').addClass('fa-stop')
    } else {
      fseIndicator.css({visibility: 'hidden'})
    }

    this.$box.css({
      position: 'fixed',
      width: bboxWidth,
      height: bboxHeight,
      left: left,
      top: top,
      'z-index': zIndex
    })

    fseName.css({
      position: 'fixed',
      left: left + (bboxWidth / 2) - ((fseName.width()) / 2),
      top: top + (bboxHeight / 2) - ((fseName.height() * sy) / (2 * sy))
    })

    fseRemoveBtn.css({
      left: bboxWidth + (10 * sx)
    })

    fseConnectorBtn.css({
      left: bboxWidth + (10 * sx)
    })
  },
  highlightElement: function () {
    this.model.get('customAttrs').isHighlighted = true
    this.model.toFront()
    this.highlight(null, jointOptions.highlighterDefaults)
    this.updateBox()
    this.$box.find('.FunctionStateElement__remove-btn').css({visibility: 'visible'})
    this.$box.find('.FunctionStateElement__connector-btn').css({visibility: 'visible'})
  },
  unhighlightElement: function () {
    this.model.get('customAttrs').isHighlighted = false
    this.unhighlight(null, jointOptions.highlighterDefaults)
    this.$box.find('.FunctionStateElement__remove-btn').css({visibility: 'hidden'})
    this.$box.find('.FunctionStateElement__connector-btn').css({visibility: 'hidden'})
    this.$box.css('z-index', 0)
  },
  removeBox: function (evt) {
    this.$box.remove()
  }
})

/** Create a new FunctionStateElement */
const functionStateElement = (options) => {
  options = options || jointOptions.functionStateElementDefaults
  return new joint.shapes.custom.FunctionStateElement(options)
}

/***************************************************
 ************ SendTransitionElement ************
 ***************************************************/

/** SendTransitionElement - jointjs definition */
joint.shapes.custom.SendTransitionElement = joint.dia.Link.extend({
  defaults: joint.util.deepSupplement({
    type: jointOptions.types.links.SEND_TRANSITION_ELEMENT
  }, joint.dia.Link.prototype.defaults)
})

// Custom view for SendTransitionElement that displays an HTML div above it
joint.shapes.custom.SendTransitionElementView = joint.dia.LinkView.extend({
  template: [
    '<div class="SendTransitionElement">',
    '<div class="SendTransitionElement__selector"></div>',
    '<div class="SendTransitionElement__subject"></div>',
    '<div class="SendTransitionElement__message"></div>',
    '<button class="SendTransitionElement__remove-btn"><i class="fa fa-trash-o" aria-hidden="true"></i></button>',
    '</div>'
  ].join(''),
  initialize: function () {
    _.bindAll(this, 'updateBox')
    _.bindAll(this, 'highlightElement')
    _.bindAll(this, 'unhighlightElement')
    joint.dia.LinkView.prototype.initialize.apply(this, arguments)
    this.$box = $(_.template(this.template)())
    this.model.on('change', this.updateBox, this)
    this.model.on('remove', this.removeBox, this)
    this.updateBox()
  },
  render: function () {
    joint.dia.LinkView.prototype.render.apply(this, arguments)
    this.paper.$el.prepend(this.$box)
    this.$box.find('.SendTransitionElement__remove-btn').on('click', _.bind(this.model.remove, this.model))
    this.updateBox()
    return this
  },
  updateBox: function () {
    let sx = 0
    let sy = 0
    let tx = 0
    let ty = 0

    /** Get the translate value of the paper. The tx and ty values will be used when the canvas is dragged around. */
    if (typeof this.paper !== 'undefined') {
      sx = this.paper.scale().sx
      sy = this.paper.scale().sy
      tx = this.paper.translate().tx
      ty = this.paper.translate().ty
    }

    const zIndex = this.model.get('z')
    const customAttrs = this.model.get('customAttrs')
    const selector = this.$box.find('.SendTransitionElement__selector')
    const removeBtn = this.$box.find('.SendTransitionElement__remove-btn')
    const subject = this.$box.find('.SendTransitionElement__subject')
    const message = this.$box.find('.SendTransitionElement__message')

    let position = {x: 0, y: 0}
    if (typeof this._V !== 'undefined' && position.x === 0 && position.y === 0) {
      var connectionEl = this.$('.connection')[0]
      var connectionLength = connectionEl.getTotalLength()
      position = connectionEl.getPointAtLength(connectionLength / 2)
    }

    if (customAttrs.subject !== null) {
      subject.text('S: ' + jointService.getSubjectNameById(customAttrs.subject))
    }
    if (customAttrs.messageSpecification !== null) {
      message.text('M: ' + jointService.getMessageSpecificationNameById(customAttrs.messageSpecification))
    }

    const boxWidth = 180 * sx
    const boxHeight = 80 * sy
    const left = ((position.x * sx) - (boxWidth / 2)) + tx
    const top = ((position.y * sy) - (boxHeight / 2)) + ty

    this.$box.css({
      width: boxWidth,
      height: boxHeight,
      left: left,
      top: top,
      'z-index': zIndex
    })

    selector.css({
      width: boxWidth + 15,
      height: boxHeight + 15,
      'z-index': zIndex
    })

    removeBtn.css({
      left: boxWidth + (10 * sx)
    })
  },
  removeBox: function (evt) {
    this.$box.remove()
  },
  highlightElement: function () {
    this.model.toFront()
    this.updateBox()
    this.$box.find('.SendTransitionElement__selector').css({visibility: 'visible'})
    this.$box.find('.SendTransitionElement__remove-btn').css({visibility: 'visible'})
  },
  unhighlightElement: function () {
    this.$box.find('.SendTransitionElement__selector').css({visibility: 'hidden'})
    this.$box.find('.SendTransitionElement__remove-btn').css({visibility: 'hidden'})
  }
})

/** Create a new SendTransitionElement */
const sendTransitionElement = (options) => {
  options = options || jointOptions.sendTransitionElementDefaults
  return new joint.shapes.custom.SendTransitionElement(options)
}

/***************************************************
 ********** ReceiveTransitionElement ***********
 ***************************************************/

/** ReceiveTransitionElement - jointjs definition */
joint.shapes.custom.ReceiveTransitionElement = joint.dia.Link.extend({
  defaults: joint.util.deepSupplement({
    type: jointOptions.types.links.RECEIVE_TRANSITION_ELEMENT
  }, joint.dia.Link.prototype.defaults)
})

// Custom view for ReceiveTransitionElement that displays an HTML div above it
joint.shapes.custom.ReceiveTransitionElementView = joint.dia.LinkView.extend({
  template: [
    '<div class="ReceiveTransitionElement">',
    '<div class="ReceiveTransitionElement__selector"></div>',
    '<div class="ReceiveTransitionElement__subject"></div>',
    '<div class="ReceiveTransitionElement__message"></div>',
    '<button class="ReceiveTransitionElement__remove-btn"><i class="fa fa-trash-o" aria-hidden="true"></i></button>',
    '</div>'
  ].join(''),
  initialize: function () {
    _.bindAll(this, 'updateBox')
    _.bindAll(this, 'highlightElement')
    _.bindAll(this, 'unhighlightElement')
    joint.dia.LinkView.prototype.initialize.apply(this, arguments)
    this.$box = $(_.template(this.template)())
    this.model.on('change', this.updateBox, this)
    this.model.on('remove', this.removeBox, this)
    this.updateBox()
  },
  render: function () {
    joint.dia.LinkView.prototype.render.apply(this, arguments)
    this.paper.$el.prepend(this.$box)
    this.$box.find('.ReceiveTransitionElement__remove-btn').on('click', _.bind(this.model.remove, this.model))
    this.updateBox()
    return this
  },
  updateBox: function () {
    let sx = 0
    let sy = 0
    let tx = 0
    let ty = 0

    /** Get the translate value of the paper. The tx and ty values will be used when the canvas is dragged around. */
    if (typeof this.paper !== 'undefined') {
      sx = this.paper.scale().sx
      sy = this.paper.scale().sy
      tx = this.paper.translate().tx
      ty = this.paper.translate().ty
    }

    const zIndex = this.model.get('z')
    const customAttrs = this.model.get('customAttrs')
    const selector = this.$box.find('.ReceiveTransitionElement__selector')
    const removeBtn = this.$box.find('.ReceiveTransitionElement__remove-btn')
    const subject = this.$box.find('.ReceiveTransitionElement__subject')
    const message = this.$box.find('.ReceiveTransitionElement__message')

    let position = {x: 0, y: 0}
    if (typeof this._V !== 'undefined' && position.x === 0 && position.y === 0) {
      var connectionEl = this.$('.connection')[0]
      var connectionLength = connectionEl.getTotalLength()
      position = connectionEl.getPointAtLength(connectionLength / 2)
    }

    if (customAttrs.subject !== null) {
      subject.text('S: ' + jointService.getSubjectNameById(customAttrs.subject))
    }
    if (customAttrs.messageSpecification !== null) {
      message.text('M: ' + jointService.getMessageSpecificationNameById(customAttrs.messageSpecification))
    }

    const boxWidth = 180 * sx
    const boxHeight = 80 * sy
    const left = ((position.x * sx) - (boxWidth / 2)) + tx
    const top = ((position.y * sy) - (boxHeight / 2)) + ty

    this.$box.css({
      width: boxWidth,
      height: boxHeight,
      left: left,
      top: top,
      'z-index': zIndex
    })

    selector.css({
      width: boxWidth + 15,
      height: boxHeight + 15,
      'z-index': zIndex
    })

    removeBtn.css({
      left: boxWidth + (10 * sx)
    })
  },
  removeBox: function (evt) {
    this.$box.remove()
  },
  highlightElement: function () {
    this.model.toFront()
    this.updateBox()
    this.$box.find('.ReceiveTransitionElement__selector').css({visibility: 'visible'})
    this.$box.find('.ReceiveTransitionElement__remove-btn').css({visibility: 'visible'})
  },
  unhighlightElement: function () {
    this.$box.find('.ReceiveTransitionElement__selector').css({visibility: 'hidden'})
    this.$box.find('.ReceiveTransitionElement__remove-btn').css({visibility: 'hidden'})
  }
})

/** Create a new ReceiveTransitionElement */
const receiveTransitionElement = (options) => {
  options = options || jointOptions.receiveTransitionElementDefaults
  return new joint.shapes.custom.ReceiveTransitionElement(options)
}

/***************************************************
 ********** FunctionTransitionElement ***********
 ***************************************************/

/** FunctionTransitionElement - jointjs definition */
joint.shapes.custom.FunctionTransitionElement = joint.dia.Link.extend({
  defaults: joint.util.deepSupplement({
    type: jointOptions.types.links.FUNCTION_TRANSITION_ELEMENT
  }, joint.dia.Link.prototype.defaults)
})

// Custom view for FunctionTransitionElement that displays an HTML div above it
joint.shapes.custom.FunctionTransitionElementView = joint.dia.LinkView.extend({
  template: [
    '<div class="FunctionTransitionElement">',
    '<div class="FunctionTransitionElement__selector"></div>',
    '<div class="FunctionTransitionElement__name"></div>',
    '<button class="FunctionTransitionElement__remove-btn"><i class="fa fa-trash-o" aria-hidden="true"></i></button>',
    '</div>'
  ].join(''),
  initialize: function () {
    _.bindAll(this, 'updateBox')
    _.bindAll(this, 'highlightElement')
    _.bindAll(this, 'unhighlightElement')
    joint.dia.LinkView.prototype.initialize.apply(this, arguments)
    this.$box = $(_.template(this.template)())
    this.model.on('change', this.updateBox, this)
    this.model.on('remove', this.removeBox, this)
    this.updateBox()
  },
  render: function () {
    joint.dia.LinkView.prototype.render.apply(this, arguments)
    this.paper.$el.prepend(this.$box)
    this.$box.find('.FunctionTransitionElement__remove-btn').on('click', _.bind(this.model.remove, this.model))
    this.updateBox()
    return this
  },
  updateBox: function () {
    let sx = 0
    let sy = 0
    let tx = 0
    let ty = 0

    /** Get the translate value of the paper. The tx and ty values will be used when the canvas is dragged around. */
    if (typeof this.paper !== 'undefined') {
      sx = this.paper.scale().sx
      sy = this.paper.scale().sy
      tx = this.paper.translate().tx
      ty = this.paper.translate().ty
    }

    const zIndex = this.model.get('z')
    const customAttrs = this.model.get('customAttrs')
    const selector = this.$box.find('.FunctionTransitionElement__selector')
    const removeBtn = this.$box.find('.FunctionTransitionElement__remove-btn')
    const name = this.$box.find('.FunctionTransitionElement__name')

    let position = {x: 0, y: 0}
    if (typeof this._V !== 'undefined' && position.x === 0 && position.y === 0) {
      var connectionEl = this.$('.connection')[0]
      var connectionLength = connectionEl.getTotalLength()
      position = connectionEl.getPointAtLength(connectionLength / 2)
    }

    if (this.model.getSourceElement() !== null && customAttrs.name === null) {
      customAttrs.name = this.model.getSourceElement().get('customAttrs').name + ' done'
    }

    if (customAttrs.name !== null) {
      name.text(customAttrs.name)
    }

    const boxWidth = 180 * sx
    const boxHeight = 80 * sy
    const left = ((position.x * sx) - (boxWidth / 2)) + tx
    const top = ((position.y * sy) - (boxHeight / 2)) + ty

    this.$box.css({
      width: boxWidth,
      height: boxHeight,
      left: left,
      top: top,
      'z-index': zIndex
    })

    selector.css({
      width: boxWidth + 15,
      height: boxHeight + 15,
      'z-index': zIndex
    })

    removeBtn.css({
      left: boxWidth + (10 * sx)
    })
  },
  removeBox: function (evt) {
    this.$box.remove()
  },
  highlightElement: function () {
    this.model.toFront()
    this.updateBox()
    this.$box.find('.FunctionTransitionElement__selector').css({visibility: 'visible'})
    this.$box.find('.FunctionTransitionElement__remove-btn').css({visibility: 'visible'})
  },
  unhighlightElement: function () {
    this.$box.find('.FunctionTransitionElement__selector').css({visibility: 'hidden'})
    this.$box.find('.FunctionTransitionElement__remove-btn').css({visibility: 'hidden'})
  }
})

/** Create a new FunctionTransitionElement */
const functionTransitionElement = (options) => {
  options = options || jointOptions.functionTransitionElementDefaults
  return new joint.shapes.custom.FunctionTransitionElement(options)
}

/** Object containing all functions for creating custom elements */
const jointShapes = {
  subjectElement: subjectElement,
  interfaceSubjectElement: interfaceSubjectElement,
  messageExchangeElement: messageExchangeElement,
  sendStateElement: sendStateElement,
  receiveStateElement: receiveStateElement,
  functionStateElement: functionStateElement,
  sendTransitionElement: sendTransitionElement,
  receiveTransitionElement: receiveTransitionElement,
  functionTransitionElement: functionTransitionElement
}

export default jointShapes
