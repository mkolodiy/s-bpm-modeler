const { authenticate } = require('feathers-authentication').hooks;

const beforeCreateProcessLayer = require('../../hooks/structural-elements/process-layers/before-create-process-layer');

const afterRemoveProcessLayer = require('../../hooks/structural-elements/process-layers/after-remove-process-layer');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [beforeCreateProcessLayer()],
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
    remove: [afterRemoveProcessLayer()]
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
