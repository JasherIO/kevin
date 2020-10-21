const options = { 
  weekday: 'short', 
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short'
};
const easternOptions = { ...options, timeZone: 'America/New_York' };
const toEasternDate = (date) => {
  return date.toLocaleString('en-US', easternOptions);
}

const centralEuropeanOptions = { ...options, timeZone: 'Europe/Berlin' };
const toCentralEuropeanDate = (date) => {
  return date.toLocaleString('en-DE', centralEuropeanOptions);
}

module.exports = {
  toEasternDate: toEasternDate,
  toCentralEuropeanDate: toCentralEuropeanDate
}
