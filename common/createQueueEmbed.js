const { MessageEmbed } = require('discord.js');
const { toCentralEuropeanDate, toEasternDate } = require("./dates");
const { QUEUE_START_COLOR, QUEUE_END_COLOR } = require("./queueColors");
const  { Q, S, EMOJIS } = require("./emojis");
const TWO_WEEKS_MS = 1209600000;

const toMentions = (users) => {
  return users.map(user => `<@${user.id}>`);
}

const toColor = ({ queueSize, partySize }) => {
  return queueSize < partySize ? QUEUE_START_COLOR : QUEUE_END_COLOR;
}

const updateEmbed = ({ template, reactions, partySize }) => {
  const embed = new MessageEmbed(template);

  const queueReaction = reactions.find(r => r.emoji.name === Q);
  const queueUsers = queueReaction ? queueReaction.users.cache.filter(u => !u.bot) : {};
  const queueSize = queueUsers.size || 0;

  const standbyReaction = reactions.find(r => r.emoji.name === S);
  const standbyUsers = standbyReaction ? standbyReaction.users.cache.filter(u => !u.bot) : {};
  const standbySize = standbyUsers.size || 0;

  embed.setColor(toColor({ queueSize, partySize }));

  embed.addField(`Confirmed (${queueSize})`, queueSize > 0 ? toMentions(queueUsers) : 'None');
  embed.addField(`Standby (${standbySize})`, standbySize > 0 ? toMentions(standbyUsers) : 'None');

  return embed;
}

const createQueueEmbed = async ({ message, title = 'Queue', date = new Date(Date.now()), partySize = 0 }) => {  
  const description = `${toEasternDate(date)}\n${toCentralEuropeanDate(date)}`;
  const startColor = partySize > 0 ? QUEUE_START_COLOR : QUEUE_END_COLOR;

  const template = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor(startColor);

  try {
    const embedMessage = await message.embed(template);

    const filter = (reaction) => EMOJIS.includes(reaction.emoji.name);
    const collector = embedMessage.createReactionCollector(filter, { dispose: true, time: TWO_WEEKS_MS });
    
    collector.on('collect', (reaction) => {
      reaction.message.edit('', { embed: updateEmbed({ template, reactions: embedMessage.reactions.cache, partySize }) });
    });

    collector.on('remove', (reaction) => {
      reaction.message.edit('', { embed: updateEmbed({ template, reactions: embedMessage.reactions.cache, partySize }) });
    });

    await embedMessage.react(Q);
    await embedMessage.react(S);

    return embedMessage;
  } catch (err) {
    console.error(err);
  }

  return message;
}

module.exports = {
  createQueueEmbed: createQueueEmbed
}