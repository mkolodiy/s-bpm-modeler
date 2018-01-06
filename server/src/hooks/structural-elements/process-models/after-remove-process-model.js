// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    const processModelsService = hook.app.service('process-models');
    const processLayersService = hook.app.service('process-layers');

    if (Array.isArray(hook.result)) {
      const removedProcessModels = hook.result;
      const promises = [];

      removedProcessModels.forEach(el => {
        const params = {
          query: {
            parent: el._id.toString()
          }
        };
        promises.push(processModelsService.remove(null, params));
        promises.push(processLayersService.remove(null, params));
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
      promises.push(processModelsService.remove(null, params));
      promises.push(processLayersService.remove(null, params));

      return Promise.all(promises).then(() => Promise.resolve(hook));
    }
  };
};
