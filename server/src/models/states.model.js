// states-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const Schema = mongooseClient.Schema;
  const states = new Schema({
    name: {
      type: String,
      required: true
    },
    startState: {
      type: Boolean,
      required: true
    },
    endState: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    position: {
      type: Schema.Types.Mixed,
      required: true
    },
    size: {
      type: Schema.Types.Mixed,
      required: true
    },
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

  return mongooseClient.model('states', states);
};
