import React, {PropTypes} from 'react';
import {FormControl} from 'react-bootstrap';
import ColumnDefinition, {DataTypes} from '../../helpers/ColumnDefinition';
import ReactSelect from 'react-select';

export default React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    column: PropTypes.object.isRequired
  },

  render() {
    const {column} = this.props;
    const {fields} = ColumnDefinition(column);
    return (
      <span>
        {fields.dataType.show && this.renderDataType(fields.dataTypeSize)}
      </span>
    );
  },

  renderDataType(dataSizeField) {
    const dataTypeOptions = Object.keys(DataTypes).map(dataType => ({label: dataType, value: dataType}));

    return (
      <div>
        <span>Data Type</span>
        {this.renderColumnSelect('dataType', dataTypeOptions)}
        {dataSizeField.show && this.renderColumnInput('dataTypeSize')}
      </div>
    );
  },

  renderColumnSelect(fieldName, options) {
    const {disabled, onChange, column} = this.props;
    return (
      <ReactSelect
        bsize="small"
        autosize={false}
        clearable={false}
        value={column[fieldName]}
        options={options}
        onChange={e => onChange({...column, [fieldName]: e.value})}
        disabled={disabled}
      />
    );
  },

  renderColumnInput(fieldName) {
    const {disabled, onChange, column} = this.props;
    return (
      <FormControl
        type="text"
        disabled={disabled}
        onChange={e => onChange({...column, [fieldName]: e.target.value})}
        value={column[fieldName]}
      />);
  }
});
