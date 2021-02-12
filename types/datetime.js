const { ArgumentType } = require('discord.js-commando');
const chrono = require('chrono-node');

class DatetimeArgumentType extends ArgumentType {
	constructor(client) {
		super(client, 'datetime');
	}

	validate(val) {
		const current = new Date();
		const datetime = chrono.parseDate(val, current, { forwardDate: true });
    return !datetime ? false : true;
	}

	parse(val) {
		const current = new Date();
		return chrono.parseDate(val, current, { forwardDate: true });
	}
}

module.exports = {
	DatetimeArgumentType
};
