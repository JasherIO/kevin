const { RichEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');

const status = {
  started: 0xF56565,
  progress: 0xECC94B,
  done: 0x48BB78
}

// TODO
// queue + standby < 6 -> RED 
// queue + standby >= 6 -> YELLOW
// queue >= 6 -> GREEN 
const getColor = (count) => {
  if (count < 3)
    return status.started;
  
  if (count < 6)
    return status.progress;
  
  return status.done;
}

const Q = '🇶';
const S = '🇸';
const emojis = [Q, S];

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

    const embed = new RichEmbed()
      .setTitle('Queue')
      .setColor(status.started)
      .addField('Confirmed', `<@${message.author.id}>`);

    try {
      const embedMessage = await message.embed(embed);

      const filter = (reaction) => emojis.includes(reaction.emoji.name);
      const collector = embedMessage.createReactionCollector(filter);
      collector.on('collect', async (reaction, collector) => {
        const count = reaction.count-1;
        const prevEmbed = reaction.message.embeds[0];

        const e = new RichEmbed()
          .setTitle(prevEmbed.title)
          .setColor(getColor(count));

        const users = reaction.users.filter(user => !user.bot);
        const mentions = users.map(user => `<@${user.id}>`);

        if (reaction.emoji.name === Q) {
          if (mentions.length > 0)
            e.addField('Confirmed', mentions)
          
          reaction.message.edit('', { embed: e });
        }
      });
      collector.on('end', collected => console.log(`Collected ${collected.size} items`));

      await embedMessage.react(Q);
      await embedMessage.react(S);

      return embedMessage;
    } catch (err) {
      console.error(err);
    }

    return message;
	}
};