const assert = require('assert');
const beforeCreateProcessGroup = require('../../../src/hooks/structural-elements/process-groups/before-create-process-group');

describe('\'beforeCreateProcessGroup\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {};
    // Initialize our hook with no options
    const hook = beforeCreateProcessGroup();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
