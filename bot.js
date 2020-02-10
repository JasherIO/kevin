const { Client, SQLiteProvider } = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');
const { ownerId, token } = require('./auth');

const client = new Client({
	owner: ownerId
});

client.registry
  .registerGroups([ [ 'queue', 'Queue' ] ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new SQLiteProvider(db))
).catch(console.error);

client.login(token);
