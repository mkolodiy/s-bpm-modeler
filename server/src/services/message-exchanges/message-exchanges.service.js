// Initializes the `messageExchanges` service on path `/message-exchanges`
const createService = require('feathers-mongoose');
const createModel = require('../../models/message-exchanges.model');
const hooks = require('./message-exchanges.hooks');
const filters = require('./message-exchanges.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'message-exchanges',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/message-exchanges', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('message-exchanges');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
