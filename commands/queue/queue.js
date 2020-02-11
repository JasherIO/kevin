const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');

const status = {
  started: 0xF56565,
  progress: 0xECC94B,
  done: 0x48BB78
}

const DAY = 24*60*60;
const WEEK = DAY*7;

const Q = '🇶';
const S = '🇸';
const emojis = [Q, S];

const gameSize = {
  CSGO: 10,
  default: 6,
  RL: 6,
  R6: 10,
  TTS: 4
}

const getColor = (game, queueSize, standbySize) => {
  const size = game in gameSize ? gameSize[game] : gameSize.default;

  if (queueSize >= size)
    return status.done;
  
  if (queueSize + standbySize >= size)
    return status.progress;

  return status.started;
}

const toMentions = (users) => {
  return users.map(user => `<@${user.id}>`);
}

const updateEmbed = (template, reactions, game) => {
  const e = new MessageEmbed(template);

  const queueReaction = reactions.find(r => r.emoji.name === Q);
  const queueUsers = queueReaction ? queueReaction.users.filter(u => !u.bot) : {};
  const queueSize = queueUsers.size;

  const standbyReaction = reactions.find(r => r.emoji.name === S);
  const standbyUsers = standbyReaction ? standbyReaction.users.filter(u => !u.bot) : {};
  const standbySize = standbyUsers.size;

  const color = getColor(game, queueSize, standbySize);
  e.setColor(color);

  if (queueSize > 0)
    e.addField('Confirmed', toMentions(queueUsers));

  if (standbySize > 0)
    e.addField('Standby', toMentions(standbyUsers));

  return e;
}

module.exports = class QueueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'queue',
			aliases: ['q'],
			group: 'queue',
			memberName: 'queue',
			description: 'Toggles user queue status.',
			details: 'Toggles user queue status.',
      examples: ['q', 'queue'],
      guildOnly: true,
      args: [
				{
          key: 'game',
          prompt: 'What game?',
          default: '',
					type: 'role'
        },
        {
          key: 'time',
          prompt: 'What time?',
          default: '',
					type: 'string'
        }
			]
		});
	}

	async run(message, args) {
    const game = args.game.name || '';
    const time = args.time || '';
    const title = !game && !time ? 'Queue' :`${game} ${time}`;
    
    const template = new MessageEmbed()
      .setTitle(title)
      .setColor(status.started);

    try {
      const embedMessage = await message.embed(template);

      const filter = (reaction) => emojis.includes(reaction.emoji.name);
      const collector = embedMessage.createReactionCollector(filter, { time: WEEK, dispose: true });
      
      collector.on('collect', async (reaction) => {
        reaction.message.edit('', { embed: updateEmbed(template, embedMessage.reactions, game) });
      });

      collector.on('remove', (reaction) => {
        reaction.message.edit('', { embed: updateEmbed(template, embedMessage.reactions, game) });
      });

      await embedMessage.react(Q);
      await embedMessage.react(S);

      return embedMessage;
    } catch (err) {
      console.error(err);
    }

    return message;
	}
};