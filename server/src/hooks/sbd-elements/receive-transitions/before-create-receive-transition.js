// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    if (hook.params.user) {
      hook.data.creator = hook.params.user;
    }

    return Promise.resolve(hook);
  };
};
