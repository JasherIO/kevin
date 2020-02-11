const { Client, SQLiteProvider } = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');

require('dotenv').config()

const client = new Client({
	owner: process.env.ownerId
});

client.on('message', message => {
  if (message.content.includes('peen') && !message.author.bot)
    message.channel.send("`Please think of Stump before waving your peen around`");
    
  if (message.content.includes('bing') && !message.author.bot)
    message.channel.send("`Bong!`");
})

client.registry
  .registerGroups([ [ 'queue', 'Queue' ], [ 'fun', 'Fun' ] ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new SQLiteProvider(db))
).catch(console.error);

client.login(process.env.token);
