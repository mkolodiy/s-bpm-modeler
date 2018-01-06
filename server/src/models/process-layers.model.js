// processLayers-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const Schema = mongooseClient.Schema;
  const processLayers = new Schema({
    name: {
      type: String,
      required: true
    },
    layerType: {
      type: String,
      required: true
    },
    processGroup: {
      type: Schema.Types.ObjectId,
      ref: 'ProcessGroup',
      required: true
    },
    parent: {
      type: Schema.Types.ObjectId,
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

  return mongooseClient.model('processLayers', processLayers);
};
