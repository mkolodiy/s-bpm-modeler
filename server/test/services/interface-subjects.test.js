const assert = require('assert');
const app = require('../../src/app');

describe('\'interfaceSubjects\' service', () => {
  it('registered the service', () => {
    const service = app.service('interface-subjects');

    assert.ok(service, 'Registered the service');
  });
});
