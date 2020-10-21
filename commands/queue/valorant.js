const { Command } = require('discord.js-commando');
const { createQueueEmbed } = require("../../common/createQueueEmbed");

const TITLE = 'Valorant';
const PARTY_SIZE = 5;

module.exports = class ValorantCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'valorant',
			aliases: ['val'],
			group: 'queue',
			memberName: 'valorant',
			description: 'Create a queue for Valorant.',
			details: 'Create a queue for Valorant.',
      examples: ['`!val`', '`!valorant`', '`!valorant "today 5PM EDT"`', '`!valorant "sat 12PM PST"`'],
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
