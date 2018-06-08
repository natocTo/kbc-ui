import React from 'react';
import _ from 'underscore';
import DatatypeFormRow from './DatatypeFormRow';

export default React.createClass({
  propTypes: {
    datatypes: React.PropTypes.object.isRequired,
    columns: React.PropTypes.array.isRequired,
    datatypesMap: React.PropTypes.object.isRequired,
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func
  },

  handleColumnChange(newType) {
    // replace the changed column
    const datatypes = this.props.datatypes.map((type) => {
      if (type.get('column') === newType.get('column')) {
        return newType;
      } else {
        return type;
      }
    });
    return this.props.onChange(datatypes);
  },

  getTypeOptions() {
    return _.map(_.keys(this.props.datatypesMap.toJS()), (option) => {
      return {
        label: option,
        value: option
      };
    });
  },

  renderColumn(column) {
    const columnObject = this.props.datatypes.filter((type) => {
      return type.get('column') === column;
    });
    return (
      <DatatypeFormRow
        datatype={columnObject.get(column)}
        typeOptions={this.getTypeOptions()}
        onChange={this.handleColumnChange}
        disabled={this.props.disabled}
      />
    );
  },

  render() {
    if (this.props.disabled) {
      return null;
    }
    const renderedColumns = this.props.columns.map((column) => {
      return this.renderColumn(column);
    });
    return (
      <div>{renderedColumns}</div>
    );
  }
});
