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

const getColor = (queueSize, standbySize) => {
  if (queueSize >= 6)
    return status.done;
  
  if (queueSize + standbySize >= 6)
    return status.progress;

  return status.started;
}

const toMentions = (users) => {
  return users.map(user => `<@${user.id}>`);
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
      guildOnly: true
		});
	}

	async run(message) {

    const embed = new MessageEmbed()
      .setTitle('Queue')
      .setColor(status.started);

    try {
      const embedMessage = await message.embed(embed);

      const filter = (reaction) => emojis.includes(reaction.emoji.name);
      const collector = embedMessage.createReactionCollector(filter, { time: WEEK, dispose: true });
      
      collector.on('collect', async (reaction) => {
        const queueReaction = embedMessage.reactions.find(r => r.emoji.name === Q);
        const queueUsers = queueReaction ? queueReaction.users.filter(u => !u.bot) : {};

        const standbyReaction = embedMessage.reactions.find(r => r.emoji.name === S);
        const standbyUsers = standbyReaction ? standbyReaction.users.filter(u => !u.bot) : {};

        const queueSize = queueUsers.size;
        const standbySize = standbyUsers.size;

        const e = new MessageEmbed(embed)
          .setColor(getColor(queueSize, standbySize));

        if (queueUsers.size > 0)
          e.addField('Confirmed', toMentions(queueUsers));

        if (standbyUsers.size > 0)
          e.addField('Standby', toMentions(standbyUsers));

        reaction.message.edit('', { embed: e });
      });

      collector.on('remove', (reaction) => {
        const queueReaction = embedMessage.reactions.find(r => r.emoji.name === Q);
        const queueUsers = queueReaction ? queueReaction.users.filter(u => !u.bot) : {};

        const standbyReaction = embedMessage.reactions.find(r => r.emoji.name === S);
        const standbyUsers = standbyReaction ? standbyReaction.users.filter(u => !u.bot) : {};

        const queueSize = queueUsers.size;
        const standbySize = standbyUsers.size;

        const e = new MessageEmbed(embed)
          .setColor(getColor(queueSize, standbySize));

        if (queueUsers.size > 0)
          e.addField('Confirmed', toMentions(queueUsers));

        if (standbyUsers.size > 0)
          e.addField('Standby', toMentions(standbyUsers));

        reaction.message.edit('', { embed: e });
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