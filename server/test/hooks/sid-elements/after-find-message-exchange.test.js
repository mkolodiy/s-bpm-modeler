const assert = require('assert');
const afterFindMessageExchange = require('../../../src/hooks/sid-elements/message-exchanges/after-find-message-exchange');

describe('\'afterFindMessageExchange\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {};
    // Initialize our hook with no options
    const hook = afterFindMessageExchange();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
