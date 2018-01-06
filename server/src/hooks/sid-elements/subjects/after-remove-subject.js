// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    const statesService = hook.app.service('states');
    const sendTransitionsService = hook.app.service('send-transitions');
    const receiveTransitionsService = hook.app.service('receive-transitions');
    const functionTransitionsService = hook.app.service('function-transitions');

    if (Array.isArray(hook.result)) {
      const removedSubjects = hook.result;
      const promises = [];

      removedSubjects.forEach(el => {
        const params = {
          query: {
            parent: el._id.toString()
          }
        };
        promises.push(statesService.remove(null, params));
        promises.push(sendTransitionsService.remove(null, params));
        promises.push(receiveTransitionsService.remove(null, params));
        promises.push(functionTransitionsService.remove(null, params));
      });

      return Promise.all(promises).then(() => Promise.resolve(hook));
    }
    else {
      const promises = [];
      const params = {
        query: {
          parent: hook.result._id.toString()
        }
      };
      promises.push(statesService.remove(null, params));
      promises.push(sendTransitionsService.remove(null, params));
      promises.push(receiveTransitionsService.remove(null, params));
      promises.push(functionTransitionsService.remove(null, params));

      return Promise.all(promises).then(() => Promise.resolve(hook));
    }
  };
};
