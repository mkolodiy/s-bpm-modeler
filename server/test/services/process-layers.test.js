const assert = require('assert');
const app = require('../../src/app');

describe('\'processLayers\' service', () => {
  it('registered the service', () => {
    const service = app.service('process-layers');

    assert.ok(service, 'Registered the service');
  });
});
