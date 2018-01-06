// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    const processModelsService = hook.app.service('process-models');

    if (Array.isArray(hook.result)) {
      const removedProcessGroups = hook.result;
      const promises = [];

      removedProcessGroups.forEach(el => {
        const params = {
          query: {
            parent: el._id.toString()
          }
        };
        promises.push(processModelsService.remove(null, params));
      });

      return Promise.all(promises).then(() => Promise.resolve(hook));
    }
    else {
      const params = {
        query: {
          parent: hook.result._id.toString()
        }
      };
      return processModelsService.remove(null, params).then(() => Promise.resolve(hook));
    }
  };
};
