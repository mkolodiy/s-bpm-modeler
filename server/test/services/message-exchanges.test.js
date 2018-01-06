const assert = require('assert');
const app = require('../../src/app');

describe('\'messageExchanges\' service', () => {
  it('registered the service', () => {
    const service = app.service('message-exchanges');

    assert.ok(service, 'Registered the service');
  });
});
