const { Command } = require('discord.js-commando');
const { createQueueEmbed } = require("../../common/createQueueEmbed");

const TITLE = 'Among Us';
const PARTY_SIZE = 8;

module.exports = class AmongUsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'amongus',
			aliases: ['sus'],
			group: 'queue',
			memberName: 'amongus',
			description: 'Create a queue for Among Us.',
			details: 'Create a queue for Among Us.',
      examples: ['`!sus`', '`!amongus`', '`!amongus "today 5PM EDT"`', '`!amongus "sat 12PM PST"`'],
      guildOnly: true,
      args: [
        {
          key: 'time',
          prompt: 'When?',
          default: '',
					type: 'datetime'
        }
			]
		});
	}

	async run(message, args) {
    const time = args.time || new Date(Date.now());
    return createQueueEmbed({ message, title: TITLE, date: time, partySize: PARTY_SIZE });
	}
};
