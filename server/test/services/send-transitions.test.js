const assert = require('assert');
const app = require('../../src/app');

describe('\'sendTransitions\' service', () => {
  it('registered the service', () => {
    const service = app.service('send-transitions');

    assert.ok(service, 'Registered the service');
  });
});
