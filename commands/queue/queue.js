const { Command } = require('discord.js-commando');
const {
  dates: { toCentralEuropeanDate, toEasternDate },
  colors: { QUEUE_START_COLOR, QUEUE_END_COLOR },
  emojis: { C, S }
} = require('../../common');

module.exports = class QueueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'queue',
			aliases: ['q'],
			group: 'queue',
			memberName: 'queue',
			description: 'Create a queue.',
			details: 'Create a queue.',
      examples: ['!q', '!queue', '!queue "DnD" "today 5PM EDT" 5'],
      guildOnly: true,
      args: [
        {
          key: 'title',
          prompt: 'What?',
          default: 'Queue',
					type: 'string'
        },
        {
          key: 'date',
          prompt: 'When?',
          default: new Date(),
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
    const { 
      author, 
      createdTimestamp: timestamp,
      guild,
      client: { provider }
    } = message;
    const { title, date, partySize } = args;

    const color = partySize > 0 ? QUEUE_START_COLOR : QUEUE_END_COLOR;
    const description = `${toEasternDate(date)}\n${toCentralEuropeanDate(date)}`;

    const embed = {
      color,
      title,
      description,    
      footer: { 
        text: `${author.username}`, 
        iconURL: author.avatarURL() 
      },
      timestamp,
      fields: [
        {
          name: 'Confirmed (0)',
          value: 'None',
          inline: false
        },
        {
          name: 'Standby (0)',
          value: 'None',
          inline: false
        }
      ]
    }

    const m = await message.embed(embed);
    await m.react(C);
    await m.react(S);

    const action = {
      type: 'QUEUE',
      payload: {
        embed,
        message: {
          id: m.id
        },
        partySize
      }
    }

    const reactions = provider.get(guild, 'reactions', {});
    reactions[m.id] = action;
    provider.set(guild, 'reactions', reactions)

    return m;
	}
};
