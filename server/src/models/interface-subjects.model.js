// interfaceSubjects-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const Schema = mongooseClient.Schema;
  const interfaceSubjects = new Schema({
    name: {
      type: String,
      required: true
    },
    reference: {
      type: Schema.Types.ObjectId,
      ref: 'Subject'
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

  return mongooseClient.model('interfaceSubjects', interfaceSubjects);
};
