const { Command } = require('discord.js-commando');

const responses = [
  'It is certain',
  'Without a doubt',
  'You may rely on it',
  'Yes, definitely',
  'It is decidedly so',
  'As I see it, yes',
  'Most likely',
  'Yes',
  'Outlook good',
  'Signs point to yes',
  'Reply hazy try again',
  'Better not tell you now',
  'Ask again later',
  'Cannot predict now',
  'Concentrate and ask again',
  "Don't count on it",
  'Outlook not so good',
  'My sources say no',
  'Very doubtful',
  'My reply is no'
]

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = class BingCommand extends Command {
	constructor(client) {
		super(client, {
			name: '8ball',
			group: 'fun',
			memberName: '8ball',
			description: '8ball',
			details: '8ball'
		});
	}

	async run(message) {
    const index = getRandomInt(responses.length);
    return message.channel.send("`" + responses[index] + "`");
	}
};