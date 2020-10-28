const { Command } = require('discord.js-commando');
const { emojis: { THUMBS_UP, THUMBS_DOWN } } = require('../../common');

module.exports = class SuggestionCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'suggestion',
			aliases: ['suggest'],
			group: 'suggestion',
			memberName: 'suggestion',
			description: 'Create a suggestion.',
			details: 'Create a suggestion.',
      examples: ['!suggest "My cool suggestion"', '!suggestion "My cool suggestion"'],
      guildOnly: true,
      args: [
        {
          key: 'topic',
          prompt: 'What?',
					type: 'string'
        }
      ]
		});
	}

	async run(message, args) {
    const { topic } = args;

    const embed = {
      title: topic,
      footer: { 
        text: `${message.author.username}`, 
        iconURL: message.author.avatarURL() 
      },
      timestamp: message.createdTimestamp
    }

    const m = await message.embed(embed);
    await m.react(THUMBS_UP);
    await m.react(THUMBS_DOWN);

    return m;
	}
};
