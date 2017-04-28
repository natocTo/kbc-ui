import React, {PropTypes} from 'react';
import Select from 'react-select';
import {fromJS} from 'immutable';

export default React.createClass({
  propTypes: {
    transformation: PropTypes.object.isRequired,
    packages: PropTypes.object.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onEditChange: PropTypes.func.isRequired
  },

  render() {
    return (
      <div>
        <h2 style={{lineHeight: '32px'}}>
          Packages
        </h2>
        <div className="form-group">
          <Select.Creatable
            name="packages"
            value={this.getValue()}
            multi={true}
            disabled={this.props.isSaving}
            onChange={this.handleValueChange}
            placeholder="Add packages..."
            isLoading={this.props.isSaving}
            />
          <span className="help-block">
            {this.hint()}
          </span>
        </div>
      </div>
    );
  },

  hint() {
    if (this.props.transformation.get('type') === 'r') {
      return (
        <span>These packages will be installed from CRAN and loaded to the R script environment.</span>
      );
    }
    if (this.props.transformation.get('type') === 'python') {
      return (
        <span>These packages will be installed from PyPI to the Python script environment. Do not forget to load them using <code>import</code>.</span>
      );
    }
  },

  handleValueChange(newArray) {
    const values = fromJS(newArray).map((item) => item.get('value'));
    this.props.onEditChange(values);
  },

  getValue() {
    return this.props.packages.map((item) => {
      return {label: item, value: item};
    }).toJS();
  }
});
