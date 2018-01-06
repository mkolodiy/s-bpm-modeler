const assert = require('assert');
const app = require('../../src/app');

describe('\'processGroups\' service', () => {
  it('registered the service', () => {
    const service = app.service('process-groups');

    assert.ok(service, 'Registered the service');
  });
});
