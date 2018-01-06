const assert = require('assert');
const app = require('../../src/app');

describe('\'messageSpecifications\' service', () => {
  it('registered the service', () => {
    const service = app.service('message-specifications');

    assert.ok(service, 'Registered the service');
  });
});
