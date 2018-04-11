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

  // remove all spaces
  const trimmedLabel = value.replace(' ', '');

  // try to find a number at the beginning
  const numberPart = parseInt(value, 10);

  if (isNaN(numberPart) || numberPart === 0) {
    return false;
  }

  // trim the number from the beginning
  const dimensionPart = trimmedLabel.substr(numberPart.toString().length);

  // empty dimension, it's just a number
  if (dimensionPart.length === 0) {
    return false;
  }

  // plural or singular?
  let dimensions;
  if (Math.abs(numberPart) === 1) {
    dimensions = validTimeDimensionsSingular;
  } else {
    dimensions = validTimeDimensionsPlural;
  }

  // try to match dimension
  let dimensionPartFull;
  for (let i = 0; i < dimensions.length; i++) {
    if (dimensions[i].substr(0, dimensionPart.length) === dimensionPart) {
      dimensionPartFull = dimensions[i];
      break;
    }
  }

  if (typeof dimensionPartFull === 'undefined') {
    return false;
  }

  // return absolute number + dimension
  return Math.abs(numberPart).toString() + ' ' + dimensionPartFull;
};

