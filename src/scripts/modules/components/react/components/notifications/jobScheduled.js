import React from 'react';
import {Link} from 'react-router';

export default (component, jobId) => {
  return React.createClass({
    propTypes: {
      onClick: React.PropTypes.func.isRequired
    },

    getJobName() {
      if (component) {
        if (component.get('type') === 'transformation') {
          return component.get('name') + ' job';
        } else {
          return component.get('name') + ' ' + component.get('type') + ' job';
        }
      } else {
        return 'Job';
      }
    },

    render() {
      return (
        <span>
          <Link to="jobDetail" params={{jobId: jobId}} onClick={this.props.onClick}>
            {this.getJobName()}
          </Link>
          {' '}
          has been scheduled.
        </span>
      );
    }
  });
};

