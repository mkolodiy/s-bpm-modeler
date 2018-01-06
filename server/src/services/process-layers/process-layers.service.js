// Initializes the `processLayers` service on path `/process-layers`
const createService = require('feathers-mongoose');
const createModel = require('../../models/process-layers.model');
const hooks = require('./process-layers.hooks');
const filters = require('./process-layers.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'process-layers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/process-layers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('process-layers');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
