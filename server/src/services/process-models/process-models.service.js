// Initializes the `processModels` service on path `/process-models`
const createService = require('feathers-mongoose');
const createModel = require('../../models/process-models.model');
const hooks = require('./process-models.hooks');
const filters = require('./process-models.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'process-models',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/process-models', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('process-models');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
