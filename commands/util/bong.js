const { Command } = require('discord.js-commando');

module.exports = class BingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bing',
			group: 'util',
			memberName: 'bing',
			description: 'Bong!',
			details: 'Bong!'
		});
	}

	async run(message, args) {
		return message.reply('Bong!');
	}
};