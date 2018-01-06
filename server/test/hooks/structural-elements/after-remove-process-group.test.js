const assert = require('assert');
const afterRemoveProcessGroup = require('../../../src/hooks/structural-elements/process-groups/after-remove-process-group');

describe('\'afterRemoveProcessGroup\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {};
    // Initialize our hook with no options
    const hook = afterRemoveProcessGroup();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
