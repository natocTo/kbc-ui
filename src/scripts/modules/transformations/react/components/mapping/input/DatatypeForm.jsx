import React from 'react';
import DatatypeFormRow from './DatatypeFormRow';

export default React.createClass({
  propTypes: {
    datatypes: React.PropTypes.object.isRequired,
    columns: React.PropTypes.array.isRequired,
    datatypesMap: React.PropTypes.object.isRequired,
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func
  },

  handleDatatypeChange(newType) {
    return this.props.onChange(this.props.datatypes.set(newType.get('column'), newType));
  },

  renderColumn(column) {
    const columnObject = this.props.datatypes.filter((type) => {
      return type.get('column') === column;
    });
    return (
      <DatatypeFormRow
        datatype={columnObject.get(column)}
        datatypesMap={this.props.datatypesMap}
        onChange={this.handleDatatypeChange}
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
