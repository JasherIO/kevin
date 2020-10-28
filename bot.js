const { Client } = require('discord.js-commando');
const path = require('path');
const { provider } = require('./provider/index');
const { DatetimeArgumentType } = require('./types');
const { onMessageReactionAdd, onMessageReactionRemove } = require('./reactions');

require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });

const client = new Client({
  owner: process.env.OWNER_ID,
  partials: [ 'CHANNEL', 'MESSAGE', 'REACTION' ]
});

client.registry
  .registerGroups([ ['queue', 'Queue'], ['suggestion', 'Suggestion'], ['fun', 'Fun'] ])
  .registerDefaults()
  .registerType(DatetimeArgumentType)
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('messageReactionAdd', onMessageReactionAdd);
client.on('messageReactionRemove', onMessageReactionRemove);

client
  .setProvider(provider)
  .catch(console.error);

client
  .login(process.env.TOKEN)
  .catch(console.error);
