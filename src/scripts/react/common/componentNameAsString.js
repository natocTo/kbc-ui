// TODO: move to ComponentName with prop "asString" after React upgrade

const shouldShowType = (component) => {
  return component.get('type') === 'extractor' || component.get('type') === 'writer';
};

export default (component, options = {showType: false}) => {
  if (options && options.showType && shouldShowType(component)) {
    return component.get('name') + ' ' + component.get('type');
  }
  return component.get('name');
};
