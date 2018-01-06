const assert = require('assert');
const beforeCreateFunctionTransition = require('../../../src/hooks/sbd-elements/function-transitions/before-create-function-transition');

describe('\'beforeCreateFunctionTransition\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {};
    // Initialize our hook with no options
    const hook = beforeCreateFunctionTransition();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
