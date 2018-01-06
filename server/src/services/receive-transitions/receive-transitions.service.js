// Initializes the `receiveTransitions` service on path `/receive-transitions`
const createService = require('feathers-mongoose');
const createModel = require('../../models/receive-transitions.model');
const hooks = require('./receive-transitions.hooks');
const filters = require('./receive-transitions.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'receive-transitions',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/receive-transitions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('receive-transitions');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
