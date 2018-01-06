const { authenticate } = require('feathers-authentication').hooks;

const beforeCreateMessageExchange = require('../../hooks/sid-elements/message-exchanges/before-create-message-exchange');

const afterFindMessageExchange = require('../../hooks/sid-elements/message-exchanges/after-find-message-exchange');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [beforeCreateMessageExchange()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [afterFindMessageExchange()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
