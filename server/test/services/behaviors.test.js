const assert = require('assert');
const app = require('../../src/app');

describe('\'behaviors\' service', () => {
  it('registered the service', () => {
    const service = app.service('behaviors');

    assert.ok(service, 'Registered the service');
  });
});
