import React, {PropTypes} from 'react';
import {FormControl} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    column: PropTypes.object.isRequired
  },

  render() {
    const {disabled, onChange, column} = this.props;
    return (<FormControl
              type="text"
              disabled={disabled}
              onChange={e => onChange({...column, title: e.target.value})}
              value={column.title}
    />);
  }
});
