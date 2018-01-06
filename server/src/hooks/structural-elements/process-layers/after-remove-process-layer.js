// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    const subjectsService = hook.app.service('subjects');
    const interfaceSubjectsService = hook.app.service('interface-subjects');
    const messageSpecificationsService = hook.app.service('message-specifications');
    const messageExchangesService = hook.app.service('message-exchanges');

    if (Array.isArray(hook.result)) {
      const removedProcessLayers = hook.result;
      const promises = [];

      removedProcessLayers.forEach(el => {
        const params = {
          query: {
            parent: el._id.toString()
          }
        };
        promises.push(subjectsService.remove(null, params));
        promises.push(interfaceSubjectsService.remove(null, params));
        promises.push(messageSpecificationsService.remove(null, params));
        promises.push(messageExchangesService.remove(null, params));
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
      promises.push(subjectsService.remove(null, params));
      promises.push(interfaceSubjectsService.remove(null, params));
      promises.push(messageSpecificationsService.remove(null, params));
      promises.push(messageExchangesService.remove(null, params));

      return Promise.all(promises).then(() => Promise.resolve(hook));
    }
  };
};
