import React, {PropTypes} from 'react';
import {FormControl} from 'react-bootstrap';
import ColumnDefinition from '../../helpers/ColumnDefinition';

export default React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    column: PropTypes.object.isRequired
  },

  render() {
    const {disabled, onChange, column} = this.props;
    const {fields} = ColumnDefinition(column);
    if (fields.title.show) {
      return (<FormControl
                type="text"
                disabled={disabled}
                onChange={e => onChange({...column, title: e.target.value})}
                value={column.title}
      />);
    } else {
      return null;
    }
  }
});
