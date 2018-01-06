// receiveTransitions-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const Schema = mongooseClient.Schema;
  const receiveTransitions = new Schema({
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    messageSpecification: {
      type: Schema.Types.ObjectId,
      ref: 'MessageSpecification',
      required: true
    },
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
      ref: 'Subject',
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

  return mongooseClient.model('receiveTransitions', receiveTransitions);
};
