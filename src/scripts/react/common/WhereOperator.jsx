import React from 'react';

export default React.createClass({
  propTypes: {
    backendOperator: React.PropTypes.string
  },

  render() {
    if (this.props.backendOperator === 'ne') {
      return <span>not in</span>;
    } else {
      return <span>in</span>;
    }
  }
});