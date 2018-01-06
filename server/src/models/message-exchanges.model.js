// messageExchanges-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const Schema = mongooseClient.Schema;
  const messageExchanges = new Schema({
    isBidirectional: {
      type: Boolean,
      required: true
    },
    sourceToTargetMessageSpecifications: [{
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }],
    targetToSourceMessageSpecifications: [{
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }],
    source: {
      type: Schema.Types.Mixed,
      required: true
    },
    target: {
      type: Schema.Types.Mixed,
      required: true
    },
    vertices: [{
      type: Schema.Types.Mixed
    }],
    canvasId: {
      type: String,
      required: true
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'ProcessLayer',
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('messageExchanges', messageExchanges);
};
