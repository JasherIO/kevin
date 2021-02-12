const options = { 
  weekday: 'short', 
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short'
};

const westernOptions = { ...options, timeZone: 'America/Los_Angeles' };
const toWesternDate = (date) => {
  return date.toLocaleString('en-US', westernOptions);
}

const easternOptions = { ...options, timeZone: 'America/New_York' };
const toEasternDate = (date) => {
  return date.toLocaleString('en-US', easternOptions);
}

const centralEuropeanOptions = { ...options, timeZone: 'Europe/Berlin' };
const toCentralEuropeanDate = (date) => {
  return date.toLocaleString('en-DE', centralEuropeanOptions);
}

module.exports = {
  toWesternDate,
  toEasternDate,
  toCentralEuropeanDate
}
