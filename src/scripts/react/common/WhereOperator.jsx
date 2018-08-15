import React from 'react';
import whereOperatorConstants from './whereOperatorConstants';

export default React.createClass({
  propTypes: {
    backendOperator: React.PropTypes.string
  },

  render() {
    if (this.props.backendOperator === whereOperatorConstants.NOT_EQ_VALUE) {
      return <span>{whereOperatorConstants.NOT_EQ_LABEL}</span>;
    } else {
      return <span>{whereOperatorConstants.EQ_LABEL}</span>;
    }
  }
});
