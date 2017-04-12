import React from 'react';
import moment from 'moment';
import date from '../../utils/date';

export default React.createClass({
  propTypes: {
    endTime: React.PropTypes.string
  },

  render() {
    return (
      <span title={this.props.endTime ? date.format(this.props.endTime) : ''}>
        {this.props.endTime ? moment(this.props.endTime).fromNow() : 'N/A'}
      </span>
    );
  }

});