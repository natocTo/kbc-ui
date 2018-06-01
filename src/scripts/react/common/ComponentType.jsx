const getComponentType = function(type) {
  if (['extractor', 'writer', 'application'].includes(type)) {
    return type;
  } else {
    return 'component';
  }
};

module.exports = {
  getComponentType: getComponentType
};
