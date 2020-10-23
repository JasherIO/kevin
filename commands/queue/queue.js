// !q [title] [time] [partySize]
// !rocketleague [time]
// !amongus [time]

const { Command } = require('discord.js-commando');
const { createQueueEmbed } = require("../../common/createQueueEmbed");

module.exports = class QueueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'queue',
			aliases: ['q'],
			group: 'queue',
			memberName: 'queue',
			description: 'Create a queue.',
			details: 'Create a queue.',
      examples: ['`!q`', '`!queue`', '`!queue "DnD" "today 5PM EDT" 5`'],
      guildOnly: true,
      args: [
        {
          key: 'title',
          prompt: 'What?',
          default: 'Queue',
					type: 'string'
        },
        {
          key: 'time',
          prompt: 'When?',
          default: '',
					type: 'datetime'
        },
        {
          key: 'partySize',
          prompt: 'Party size?',
          default: 0,
					type: 'integer'
        }
      ]
		});
	}

	async run(message, args) {
    const title = args.title || 'Queue';
    const time = args.time || new Date(Date.now());
    const partySize = args.partySize || 0;

    return createQueueEmbed({ message, title, date: time, partySize });
	}
};
