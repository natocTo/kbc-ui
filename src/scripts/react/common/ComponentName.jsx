import React, {PropTypes} from 'react';

const shouldShowType = (component) => {
  return component.get('type') === 'extractor' || component.get('type') === 'writer';
};

export const componentNameAsString = (component, options = {showType: false}) => {
  if (options && options.showType && shouldShowType(component)) {
    return component.get('name') + ' ' + component.get('type');
  }
  return component.get('name');
};

export default React.createClass({
  propTypes: {
    component: PropTypes.object.isRequired,
    showType: PropTypes.bool
  },

  getDefaultProps() {
    return {
      showType: false
    };
  },

  render() {
    const { component, showType } = this.props;
    return (
      <span>
        {component.get('name')}
        {showType && shouldShowType(component) && (
          <span>{' '}<small>{this.props.component.get('type')}</small></span>
        )}
      </span>
    );
  }
});
