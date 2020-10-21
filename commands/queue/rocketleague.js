const { Command } = require('discord.js-commando');
const { createQueueEmbed } = require("../../common/createQueueEmbed");

const TITLE = 'Rocket League';
const PARTY_SIZE = 3;

module.exports = class RocketLeagueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rocketleague',
			aliases: ['rl'],
			group: 'queue',
			memberName: 'rocketleague',
			description: 'Create a queue for Rocket League.',
			details: 'Create a queue for Rocket League.',
      examples: ['`!rl`', '`!rocketleague`', '`!rocketleague "today 5PM EDT"`', '`!rocketleague "sat 12PM PST"`'],
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
