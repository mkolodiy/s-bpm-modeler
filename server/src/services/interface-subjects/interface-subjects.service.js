// Initializes the `interfaceSubjects` service on path `/interface-subjects`
const createService = require('feathers-mongoose');
const createModel = require('../../models/interface-subjects.model');
const hooks = require('./interface-subjects.hooks');
const filters = require('./interface-subjects.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'interface-subjects',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/interface-subjects', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('interface-subjects');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
