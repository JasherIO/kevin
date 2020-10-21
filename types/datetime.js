const { ArgumentType } = require('discord.js-commando');
const chrono = require('chrono-node');

class DatetimeArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'datetime');
	}

	validate(val) {
    const datetime = chrono.parseDate(val);
    return !datetime ? false : true;
	}

	parse(val) {
    return chrono.parseDate(val);
	}
}

module.exports = DatetimeArgumentType;
