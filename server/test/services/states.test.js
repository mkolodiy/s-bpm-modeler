const assert = require('assert');
const app = require('../../src/app');

describe('\'states\' service', () => {
  it('registered the service', () => {
    const service = app.service('states');

    assert.ok(service, 'Registered the service');
  });
});
