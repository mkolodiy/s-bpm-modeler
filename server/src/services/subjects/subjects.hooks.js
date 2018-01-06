const { authenticate } = require('feathers-authentication').hooks;

const beforeCreateSubject = require('../../hooks/sid-elements/subjects/before-create-subject');

const afterRemoveSubject = require('../../hooks/sid-elements/subjects/after-remove-subject');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [beforeCreateSubject()],
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
    remove: [afterRemoveSubject()]
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
