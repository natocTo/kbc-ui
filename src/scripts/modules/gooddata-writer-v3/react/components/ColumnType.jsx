import React, {PropTypes} from 'react';
// import {FormControl} from 'react-bootstrap';
import ReactSelect from 'react-select';
import {Types} from '../../helpers/ColumnDefinition';

export default React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    column: PropTypes.object.isRequired
  },

  render() {
    const {disabled, onChange, column} = this.props;

    return (
      <ReactSelect
        autosize={false}
        clearable={false}
        value={column.type}
        options={this.prepareTypeOptions()}
        onChange={e => onChange({...column, type: e.value})}
        disabled={disabled}
      />

    );
  },

  prepareTypeOptions() {
    return Object.keys(Types).map(columnType =>
      ({label: columnType, value: columnType})
    );
  }
});
