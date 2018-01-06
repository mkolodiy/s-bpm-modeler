const assert = require('assert');
const beforeCreateProcessModel = require('../../../src/hooks/structural-elements/process-models/before-create-process-model');

describe('\'beforeCreateProcessModel\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {};
    // Initialize our hook with no options
    const hook = beforeCreateProcessModel();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
