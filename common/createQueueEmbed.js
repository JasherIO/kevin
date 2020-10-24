const { toCentralEuropeanDate, toEasternDate } = require("./dates");
const { QUEUE_START_COLOR, QUEUE_END_COLOR } = require("./queueColors");
const  { C, S } = require("./emojis");

const TWO_WEEKS_MS = 1209600000;
const EMOJIS = [C, S];

const defaultEmbed = ({ color, title, description, author, timestamp }) => {
  return {
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
}

const toMentions = ({ users }) => {
  return users.map(user => `<@${user.id}>`).join('\n');
}

const getReactionUsers = ({ reaction }) => {
  return !reaction ? new Map() : reaction.users.cache.filter(user => !user.bot);
}

const getReactionSize = ({ reaction }) => {
  const users = getReactionUsers({ reaction });
  return !users ? 0 : users.size;
}

const getFieldUpdate = ({ fieldName, mentions, size }) => {
  return {
    name: `${fieldName} (${size})`,
    value: size > 0 ? mentions : 'None',
    inline: false
  }
}

const getEmbedUpdate = ({ reaction, partySize }) => {
  const embed = reaction.message.embeds[0];
  const confirmedField = embed.fields.find(field => field.name.startsWith('Confirmed '));
  const standbyField = embed.fields.find(field => field.name.startsWith('Standby '));

  const users = getReactionUsers({ reaction });
  const mentions = toMentions({ users });
  const size = getReactionSize({ reaction });

  switch (reaction.emoji.name) {
    case C:
      const color = size < partySize ? QUEUE_START_COLOR : QUEUE_END_COLOR;
      return {
        ...embed,
        color,
        fields: [ getFieldUpdate({ fieldName: 'Confirmed', mentions, size }), standbyField ]
      }
    case S:
      return {
        ...embed,
        fields: [confirmedField, getFieldUpdate({ fieldName: 'Standby', mentions, size })]
      }
    default:
      return embed;
  }
}

const update = ({ partySize }) => (reaction, user) => {
  if (user.bot)
    return;

  const embed = getEmbedUpdate({ reaction, partySize });
  reaction.message.edit('', { embed });
}

const startReactionCollector = ({ message, partySize }) => {
  const filter = (reaction) => EMOJIS.includes(reaction.emoji.name);
  const collector = message.createReactionCollector(filter, { dispose: true, time: TWO_WEEKS_MS });
  
  collector.on('collect', update({ partySize }));
  collector.on('remove', update({ partySize }));

  return collector;
}

const createQueueEmbed = async ({ message, title = 'Queue', date = new Date(Date.now()), partySize = 0 }) => {  
  const color = partySize > 0 ? QUEUE_START_COLOR : QUEUE_END_COLOR;
  const description = `${toEasternDate(date)}\n${toCentralEuropeanDate(date)}`;
  const author = message.author;
  const timestamp = message.createdTimestamp;

  const embed = defaultEmbed({ color, title, description, author, timestamp });
  const embedMessage = await message.embed(embed);

  startReactionCollector({ message: embedMessage, partySize });

  await embedMessage.react(C);
  await embedMessage.react(S);

  return embedMessage;
}

module.exports = {
  createQueueEmbed,
  startReactionCollector
}