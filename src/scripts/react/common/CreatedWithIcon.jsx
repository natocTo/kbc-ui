import React from 'react';
import moment from 'moment';
import date from '../../utils/date';

export default React.createClass({
  displayName: 'CreatedWithIcon',

  propTypes: {
    createdTime: React.PropTypes.string
  },

  render: function() {
    return (
      <span title={date.format(this.props.createdTime)}>
        <i className="fa fa-fw fa-calendar" />
        {' '}
        {moment(this.props.createdTime).fromNow()}
      </span>
    );
  }
});
