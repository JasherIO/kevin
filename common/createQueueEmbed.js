const { MessageEmbed } = require('discord.js');
const { toCentralEuropeanDate, toEasternDate } = require("./dates");
const { QUEUE_START_COLOR, QUEUE_END_COLOR } = require("./queueColors");
const  { C, S } = require("./emojis");

const TWO_WEEKS_MS = 1209600000;
const EMOJIS = [C, S];

const getReaction = ({ reactions, emoji }) => {
  return reactions.find(reaction => reaction.emoji.name === emoji.name);
}

const getReactionUsers = ({ reactions, emoji }) => {
  const reaction = getReaction({ reactions, emoji });
  return !reaction ? new Map() : reaction.users.cache.filter(user => !user.bot);
}

const getReactionSize = ({ reactions, emoji }) => {
  const users = getReactionUsers({ reactions, emoji });
  return !users ? 0 : users.size;
}

const toMentions = ({ users }) => {
  return users.map(user => `<@${user.id}>`);
}

const getFieldUpdate = ({ reactions, emoji, fieldName }) => {
  const users = getReactionUsers({ reactions, emoji });
  const mentions = toMentions({ users });
  const size = getReactionSize({ reactions, emoji });

  return {
    name: `${fieldName} (${size})`,
    value: size > 0 ? mentions : 'None',
    inline: false
  }
}

const updateEmbed = ({ embed, reactions, partySize }) => {
  const confirmedField = getFieldUpdate({ reactions, emoji: { name: C }, fieldName: 'Confirmed' });
  const standbyField = getFieldUpdate({ reactions, emoji: { name: S }, fieldName: 'Standby' });
  
  const confirmedSize = getReactionSize({ reactions, emoji: { name: C } });
  const color = confirmedSize < partySize ? QUEUE_START_COLOR : QUEUE_END_COLOR;

  return {
    ...embed,
    color,
    fields: [confirmedField, standbyField]
  }
}

const createQueueEmbed = async ({ message, title = 'Queue', date = new Date(Date.now()), partySize = 0 }) => {  
  const description = `${toEasternDate(date)}\n${toCentralEuropeanDate(date)}`;
  const color = partySize > 0 ? QUEUE_START_COLOR : QUEUE_END_COLOR;

  const embed = {
    title,
    description,
    color,
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
  const embedMessage = await message.embed(embed);

  const filter = (reaction) => EMOJIS.includes(reaction.emoji.name);
  const collector = embedMessage.createReactionCollector(filter, { dispose: true, time: TWO_WEEKS_MS });
  
  collector.on('collect', (reaction, user) => {
    if (user.bot)
      return;

    reaction.message.edit('', { embed: updateEmbed({ embed, reactions: embedMessage.reactions.cache, partySize }) });
  });

  collector.on('remove', (reaction, user) => {
    if (user.bot)
      return;

    reaction.message.edit('', { embed: updateEmbed({ embed, reactions: embedMessage.reactions.cache, partySize }) });
  });

  await embedMessage.react(C);
  await embedMessage.react(S);

  return embedMessage;
}

module.exports = {
  createQueueEmbed: createQueueEmbed
}