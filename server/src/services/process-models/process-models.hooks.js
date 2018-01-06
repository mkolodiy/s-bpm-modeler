const { authenticate } = require('feathers-authentication').hooks;

const beforeCreateProcessModel = require('../../hooks/structural-elements/process-models/before-create-process-model');

const afterRemoveProcessModel = require('../../hooks/structural-elements/process-models/after-remove-process-model');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [beforeCreateProcessModel()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [afterRemoveProcessModel()]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
