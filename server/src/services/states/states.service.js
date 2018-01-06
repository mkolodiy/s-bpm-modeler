// Initializes the `states` service on path `/states`
const createService = require('feathers-mongoose');
const createModel = require('../../models/states.model');
const hooks = require('./states.hooks');
const filters = require('./states.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'states',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/states', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('states');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
