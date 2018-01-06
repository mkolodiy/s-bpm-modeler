const assert = require('assert');
const beforeCreateState = require('../../../src/hooks/sbd-elements/states/before-create-state');

describe('\'beforeCreateState\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {};
    // Initialize our hook with no options
    const hook = beforeCreateState();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
