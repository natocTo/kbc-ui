import React, {PropTypes} from 'react';
import Tooltip from '../../../react/common/Tooltip';
import moment from 'moment';

export default React.createClass({

  propTypes: {
    token: PropTypes.object.isRequired
  },

  render() {
    const expires = this.props.token.get('expires');
    if (!expires) {
      return <span>Never</span>;
    }

    return (
      <Tooltip placement="top" tooltip={this.formatDate(expires)}>
        <span>{moment(expires).fromNow()}</span>
      </Tooltip>
    );
  },

  formatDate(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }

});
