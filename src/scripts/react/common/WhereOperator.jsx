import React from 'react';
import WhereOperatorConstants from './WhereOperatorConstants';

export default React.createClass({
  propTypes: {
    backendOperator: React.PropTypes.string
  },

  render() {
    if (this.props.backendOperator === WhereOperatorConstants.NOT_EQ_VALUE) {
      return <span>{WhereOperatorConstants.NOT_EQ_LABEL}</span>;
    } else {
      return <span>{WhereOperatorConstants.EQ_LABEL}</span>;
    }
  }
});