import React, {PropTypes} from 'react';
import Select from 'react-select';
import {fromJS} from 'immutable';
import ComponentIcon from '../../../../react/common/ComponentIcon';
import ComponentName from '../../../../react/common/ComponentName';
import './ComponentsSelector.less';

export default React.createClass({

  propTypes: {
    disabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    selectedComponents: PropTypes.object.isRequired,
    allComponents: PropTypes.object.isRequired
  },

  render() {
    return (
      <Select
        className="kbc-components-selector"
        placeholder="Select component..."
        multi={true}
        disabled={this.props.disabled}
        value={this.props.selectedComponents.toArray()}
        onChange={this.handleSelect}
        optionRenderer={this.optionRenderer}
        valueRenderer={this.optionRenderer}
        options={this.getOptions()}
      />
    );
  },

  handleSelect(componentsArray) {
    this.props.onChange(fromJS(componentsArray.map(c => c.value)));
  },

  getOptions() {
    const options = this.props.allComponents.map((component, componentId) => {
      const componentRender = (
        <span>
          <ComponentIcon component={component}/>
          <ComponentName component={component}/>
        </span>
      );
      return {label: componentId, value: componentId, componentRender};
    });
    return options.toArray();
  },

  optionRenderer(op) {
    return op.componentRender;
  }

});
