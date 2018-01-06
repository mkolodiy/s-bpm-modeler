const assert = require('assert');
const afterRemoveProcessLayer = require('../../../src/hooks/structural-elements/process-layers/after-remove-process-layer');

describe('\'afterRemoveProcessLayer\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {};
    // Initialize our hook with no options
    const hook = afterRemoveProcessLayer();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
