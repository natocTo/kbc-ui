const getComponentType = (type) => {
  if (['extractor', 'writer', 'application'].includes(type)) {
    return type;
  }
  return 'component';
};

export {
  getComponentType
};
