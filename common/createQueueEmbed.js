const { MessageEmbed } = require('discord.js');
const { toCentralEuropeanDate, toEasternDate } = require("./dates");
const { QUEUE_START_COLOR, QUEUE_END_COLOR } = require("./queueColors");
const  { C, S } = require("./emojis");

const TWO_WEEKS_MS = 1209600000;
const EMOJIS = [C, S];

const toMentions = (users) => {
  return users.map(user => `<@${user.id}>`);
}

const toColor = ({ confirmedSize, partySize }) => {
  return confirmedSize < partySize ? QUEUE_START_COLOR : QUEUE_END_COLOR;
}

const updateEmbed = ({ template, reactions, partySize }) => {
  const embed = new MessageEmbed(template);

  const confirmedReaction = reactions.find(r => r.emoji.name === C);
  const confirmedUsers = confirmedReaction ? confirmedReaction.users.cache.filter(u => !u.bot) : {};
  const confirmedSize = confirmedUsers.size || 0;

  const standbyReaction = reactions.find(r => r.emoji.name === S);
  const standbyUsers = standbyReaction ? standbyReaction.users.cache.filter(u => !u.bot) : {};
  const standbySize = standbyUsers.size || 0;

  embed.setColor(toColor({ confirmedSize, partySize }));

  const confirmedFieldIndex = embed.fields.findIndex(f => f.name.startsWith('Confirmed '));
  embed.fields[confirmedFieldIndex] = {
    ...embed.fields[confirmedFieldIndex],
    name: `Confirmed (${confirmedSize})`,
    value: confirmedSize > 0 ? toMentions(confirmedUsers) : 'None'
  }

  const standbyFieldIndex = embed.fields.findIndex(f => f.name.startsWith('Standby '));
  embed.fields[standbyFieldIndex] = {
    ...embed.fields[standbyFieldIndex],
    name: `Standby (${standbySize})`,
    value: standbySize > 0 ? toMentions(standbyUsers) : 'None'
  }

  return embed;
}

const createQueueEmbed = async ({ message, title = 'Queue', date = new Date(Date.now()), partySize = 0 }) => {  
  const description = `${toEasternDate(date)}\n${toCentralEuropeanDate(date)}`;
  const startColor = partySize > 0 ? QUEUE_START_COLOR : QUEUE_END_COLOR;

  const template = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor(startColor)
    .addField('Confirmed (0)', 'None')
    .addField('Standby (0)', 'None');

  const embedMessage = await message.embed(template);

  const filter = (reaction) => EMOJIS.includes(reaction.emoji.name);
  const collector = embedMessage.createReactionCollector(filter, { dispose: true, time: TWO_WEEKS_MS });
  
  collector.on('collect', (reaction, user) => {
    if (user.bot)
      return;

    reaction.message.edit('', { embed: updateEmbed({ template, reactions: embedMessage.reactions.cache, partySize }) });
  });

  collector.on('remove', (reaction, user) => {
    if (user.bot)
      return;

    reaction.message.edit('', { embed: updateEmbed({ template, reactions: embedMessage.reactions.cache, partySize }) });
  });

  await embedMessage.react(C);
  await embedMessage.react(S);

  return embedMessage;
}

module.exports = {
  createQueueEmbed: createQueueEmbed
}