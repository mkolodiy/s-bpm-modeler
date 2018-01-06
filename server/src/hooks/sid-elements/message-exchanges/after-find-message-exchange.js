// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {

    const messageSpecificationsService = hook.app.service('message-specifications');

    const populateMessageSpecification = (messageSpecificationId) => {
      return messageSpecificationsService.get(messageSpecificationId).then(message => {
        return message;
      });
    };

    const populateMessageExchange = (messageExchange) => {
      const promises = []
      promises.push(messageExchange.sourceToTargetMessageSpecifications.map(populateMessageSpecification));
      promises.push(messageExchange.targetToSourceMessageSpecifications.map(populateMessageSpecification));
      const resolvePromises = Promise.all(promises.map(p => Promise.all(p)));
      return resolvePromises.then(result => {
        messageExchange.sourceToTargetMessageSpecifications = result[0];
        messageExchange.targetToSourceMessageSpecifications = result[1];
        return messageExchange;
      });
    };

    if (Array.isArray(hook.result.data)) {
      const messageExchanges = hook.result.data;
      const populatedMessageExchanges = messageExchanges.map(populateMessageExchange);
      return Promise.all(populatedMessageExchanges).then(result => {
        hook.result.data = result;
        return Promise.resolve(hook);
      });
    }
    else {
      return populateMessageExchange(hook.result).then(messageExchange => {
        hook.result.data = messageExchange;
        return Promise.resolve(hook);
      });
    }
  };
};
