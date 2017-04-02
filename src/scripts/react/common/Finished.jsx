import React from 'react';
import moment from 'moment';

export default React.createClass({
  propTypes: {
    endTime: React.PropTypes.string
  },

  render() {
    return (
      <span>
        {this.props.endTime ? moment(this.props.endTime).fromNow() : 'N/A'}
      </span>
    );
  }

});