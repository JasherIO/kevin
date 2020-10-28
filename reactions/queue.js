const { 
  emojis: { C, S },
  colors: { QUEUE_START_COLOR, QUEUE_END_COLOR }
} = require('../common');

const field = ({ name, mentions, size }) => {
  return {
    name: `${name} (${size})`,
    value: size > 0 ? mentions : 'None',
    inline: false
  }
}

const embed = async ({ reaction, partySize }) => {
  const _embed = reaction.message.embeds[0];
  
  const fetchedUsers = await reaction.users.fetch();
  const users = fetchedUsers.filter(user => !user.bot);
  const mentions = users.map(user => user.toString()).join('\n');
  const size = users.size;

  switch (reaction.emoji.name) {
    case C:
      const color = size < partySize ? QUEUE_START_COLOR : QUEUE_END_COLOR;
      const standbyField = _embed.fields.find(field => field.name.startsWith('Standby '));
      return {
        ..._embed,
        color,
        fields: [ field({ name: 'Confirmed', mentions, size }), standbyField ]
      }
    case S:
      const confirmedField = _embed.fields.find(field => field.name.startsWith('Confirmed '));
      return {
        ..._embed,
        fields: [confirmedField, field({ name: 'Standby', mentions, size })]
      }
    default:
      return _embed;
  }
}

const update = async ({ action, reaction }) => {
  const { payload: { partySize } } = action;

  const _embed = await embed({ reaction, partySize });

  return {
    content: '',
    options: {
      embed: _embed
    }
  }
}

module.exports = {
  update
}