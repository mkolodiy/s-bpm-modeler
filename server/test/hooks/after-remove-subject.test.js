const assert = require('assert');
const afterRemoveSubject = require('../../src/hooks/sid-elements/subjects/after-remove-subject');

describe('\'afterRemoveSubject\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {};
    // Initialize our hook with no options
    const hook = afterRemoveSubject();

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object');
    });
  });
});
