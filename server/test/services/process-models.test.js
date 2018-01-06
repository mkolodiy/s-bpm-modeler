const assert = require('assert');
const app = require('../../src/app');

describe('\'processModels\' service', () => {
  it('registered the service', () => {
    const service = app.service('process-models');

    assert.ok(service, 'Registered the service');
  });
});
