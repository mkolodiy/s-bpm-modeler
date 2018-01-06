const assert = require('assert');
const app = require('../../src/app');

describe('\'receiveTransitions\' service', () => {
  it('registered the service', () => {
    const service = app.service('receive-transitions');

    assert.ok(service, 'Registered the service');
  });
});
