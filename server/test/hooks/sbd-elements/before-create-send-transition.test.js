const assert = require('assert');
const beforeCreateSendTransition = require('../../../src/hooks/sbd-elements/send-transitions/before-create-send-transition');

describe('\'beforeCreateSendTransition\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {};
    // Initialize our hook with no options
    const hook = beforeCreateSendTransition();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
