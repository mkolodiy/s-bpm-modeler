// Initializes the `messageSpecifications` service on path `/message-specifications`
const createService = require('feathers-mongoose');
const createModel = require('../../models/message-specifications.model');
const hooks = require('./message-specifications.hooks');
const filters = require('./message-specifications.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'message-specifications',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/message-specifications', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('message-specifications');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
