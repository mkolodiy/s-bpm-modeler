const { authenticate } = require('feathers-authentication').hooks;

const beforeCreateProcessGroup = require('../../hooks/structural-elements/process-groups/before-create-process-group');

const afterRemoveProcessGroup = require('../../hooks/structural-elements/process-groups/after-remove-process-group');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [beforeCreateProcessGroup()],
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
    remove: [afterRemoveProcessGroup()]
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
