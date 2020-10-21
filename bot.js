const { Client, SQLiteProvider } = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');
const DatetimeArgumentType = require('./types/datetime')

require('dotenv').config()

const autoReplies = {
  bing: { pattern: /(^|\s+)bing($|\s+)/im, response: "`Bong!`" }
}

const client = new Client({
	owner: process.env.OWNER_ID
});

client.on('message', message => {
  if (message.author.bot)
    return;

  Object.keys(autoReplies).forEach((key) => {
    const regex = new RegExp(autoReplies[key].pattern);
    if (!regex.test(message.content))
      return;

    message.channel.send(autoReplies[key].response);
  })
})

client.registry
  .registerGroups([ ['queue', 'Queue'], ['fun', 'Fun'] ])
  .registerDefaults()
  .registerType(DatetimeArgumentType)
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new SQLiteProvider(db))
).catch(console.error);

client.login(process.env.TOKEN);
