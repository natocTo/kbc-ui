import React from 'react';
import {Link} from 'react-router';
import { componentNameAsString } from '../../../../../react/common/ComponentName';

export default (component, jobId) => {
  return React.createClass({
    propTypes: {
      onClick: React.PropTypes.func.isRequired
    },

    getJobName() {
      if (component) {
        return componentNameAsString(component, {showType: true}) + ' job';
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

