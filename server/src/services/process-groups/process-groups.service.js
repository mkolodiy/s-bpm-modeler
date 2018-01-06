// Initializes the `processGroups` service on path `/process-groups`
const createService = require('feathers-mongoose');
const createModel = require('../../models/process-groups.model');
const hooks = require('./process-groups.hooks');
const filters = require('./process-groups.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'process-groups',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/process-groups', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('process-groups');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
