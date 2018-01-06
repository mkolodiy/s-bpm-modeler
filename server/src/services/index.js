const users = require('./users/users.service.js');
const processGroups = require('./process-groups/process-groups.service.js');
const processModels = require('./process-models/process-models.service.js');
const processLayers = require('./process-layers/process-layers.service.js');
const subjects = require('./subjects/subjects.service.js');
const messageExchanges = require('./message-exchanges/message-exchanges.service.js');
const messageSpecifications = require('./message-specifications/message-specifications.service.js');
const states = require('./states/states.service.js');
const sendTransitions = require('./send-transitions/send-transitions.service.js');
const receiveTransitions = require('./receive-transitions/receive-transitions.service.js');
const functionTransitions = require('./function-transitions/function-transitions.service.js');
const interfaceSubjects = require('./interface-subjects/interface-subjects.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(processGroups);
  app.configure(processModels);
  app.configure(processLayers);
  app.configure(subjects);
  app.configure(messageExchanges);
  app.configure(messageSpecifications);
  app.configure(states);
  app.configure(sendTransitions);
  app.configure(receiveTransitions);
  app.configure(functionTransitions);
  app.configure(interfaceSubjects);
};
