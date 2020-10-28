const queue = require('./queue');

const onMessageReaction = async (_reaction, _user) => {
  if (_user.bot)
    return;
  
  let reaction, message;
  try {
    reaction = _reaction.partial ? await _reaction.fetch(true) : _reaction;
    message = reaction.message.partial ? await reaction.message.fetch(true) : reaction.message;
  } catch (error) {
    console.error(error);
    return;
  }

  const { client: { provider }, guild } = message;
  const reactions = provider.get(guild, 'reactions', {});
  
  if (!(message.id in reactions))
    return;

  const action = reactions[message.id];

  switch (action.type) {
    case 'QUEUE':
      const { content, options } = await queue.update({ action, reaction });
      await message.edit(content, options);
    default:
  }
}

module.exports = {
  onMessageReaction
}