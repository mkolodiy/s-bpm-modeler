// Initializes the `sendTransitions` service on path `/send-transitions`
const createService = require('feathers-mongoose');
const createModel = require('../../models/send-transitions.model');
const hooks = require('./send-transitions.hooks');
const filters = require('./send-transitions.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'send-transitions',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/send-transitions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('send-transitions');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
