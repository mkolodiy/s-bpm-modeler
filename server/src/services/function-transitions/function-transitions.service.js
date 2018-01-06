// Initializes the `functionTransitions` service on path `/function-transitions`
const createService = require('feathers-mongoose');
const createModel = require('../../models/function-transitions.model');
const hooks = require('./function-transitions.hooks');
const filters = require('./function-transitions.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'function-transitions',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/function-transitions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('function-transitions');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
