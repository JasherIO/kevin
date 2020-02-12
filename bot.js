const { Client, SQLiteProvider } = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');

require('dotenv').config()

const autoReplies = {
  peen: "`Please think of Stump before waving your peen around`",
  bing: "`Bong!`"
}

const client = new Client({
	owner: process.env.ownerId
});

client.on('message', message => {
  if (message.author.bot)
    return;

  Object.keys(autoReplies).forEach((key) => {
    if (!message.content.includes(key))
      return;

    message.channel.send(autoReplies[key]);
  })
})

client.registry
  .registerGroups([ ['queue', 'Queue'], ['fun', 'Fun'] ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new SQLiteProvider(db))
).catch(console.error);

client.login(process.env.token);
