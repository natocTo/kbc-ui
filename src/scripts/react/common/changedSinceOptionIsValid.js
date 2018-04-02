const validTimeDimensionsSingular = [
  'minute',
  'hour',
  'day'
];

const validTimeDimensionsPlural = [
  'minutes',
  'hours',
  'days'
];

module.exports = function(value) {
  // has to be a string
  if (typeof value !== 'string') {
    return false;
  }

  // split into parts
  const labelParts = value.split(' ');

  // option has to have 2 parts
  if (labelParts.length !== 2) {
    return false;
  }

  const numberPart = labelParts[0].trim();
  const dimensionPart = labelParts[1].trim();

  // first part is an integer
  if (parseInt(numberPart, 10).toString() !== labelParts[0]) {
    return false;
  }

  // first part is a positive integer
  if (parseInt(numberPart, 10) <= 0) {
    return false;
  }

  // invalid time range value singular
  if (parseInt(numberPart, 10) === 1 && !validTimeDimensionsSingular.includes(dimensionPart)) {
    return false;
  }

  // invalid time range value plural
  if (parseInt(numberPart, 10) >  1 && !validTimeDimensionsPlural.includes(dimensionPart)) {
    return false;
  }

  return true;
};

