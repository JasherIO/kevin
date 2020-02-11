const { Command } = require('discord.js-commando');

module.exports = class BingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bing',
			group: 'fun',
			memberName: 'bing',
			description: 'Bong!',
			details: 'Bong!'
		});
	}

	async run(message) {
		return message.reply('Bong!');
	}
};