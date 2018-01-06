const assert = require('assert');
const app = require('../../src/app');

describe('\'functionTransitions\' service', () => {
  it('registered the service', () => {
    const service = app.service('function-transitions');

    assert.ok(service, 'Registered the service');
  });
});
