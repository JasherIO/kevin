const { onImmediate } = require('./onImmediate');
const { onMessageReactionAdd } = require('./onMessageReactionAdd');
const { onMessageReactionRemove } = require('./onMessageReactionRemove');

module.exports = {
  onImmediate,
  onMessageReactionAdd,
  onMessageReactionRemove
}