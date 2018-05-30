const getComponentType = function(type) {
  switch (type) {
    case 'extractor':
      return 'extractor';
    case  'writer':
      return 'writer';
    case 'application':
      return 'application';
    default:
      return 'component';
  }
};

module.exports = {
  getComponentType: getComponentType
};
