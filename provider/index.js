const { SQLiteProvider } = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');

module.exports = {
  provider: sqlite.open(path.join(process.cwd(), 'settings.sqlite3')).then(db => new SQLiteProvider(db))
}
