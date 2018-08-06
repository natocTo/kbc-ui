import React from 'react';

export default React.createClass({
  propTypes: {
    backendOperator: React.PropTypes.string
  },

  render() {
    if (this.props.backendOperator === 'ne') {
      return <span>not eq</span>;
    } else {
      return <span>eq</span>;
    }
  }
});