export default (type) => {
  if (['extractor', 'writer', 'application'].includes(type)) {
    return type;
  }
  return 'component';
};
