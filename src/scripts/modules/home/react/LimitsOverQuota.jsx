import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import classnames from 'classnames';

import {bytesToGBFormatted, numericMetricFormatted} from '../../../utils/numbers';

import './limits.less';

export default React.createClass({
  propTypes: {
    limits: PropTypes.object.isRequired
  },

  render() {
    const {limits} = this.props;

    if (!limits.size) {
      return null;
    }

    return (
        <div className="kbc-overview-component">
          <div className={classnames(
            'row',
            'kbc-header',
            'kbc-limits',
            {'kbc-limits-one': limits.size === 1}
          )}>
            <div className="alert alert-danger">
              <h3>
                Project is over quota
              </h3>
              <ul className="list-unstyled">
                {limits.map(this.limit)}
              </ul>
            </div>
          </div>
        </div>
    );
  },

  limit(limit, index) {
    let values;

    if (limit.get('unit') === 'bytes') {
      values = `(${bytesToGBFormatted(limit.get('metricValue'))} GB of ${bytesToGBFormatted(limit.get('limitValue'))} GB)`;
    } else {
      values = `(${numericMetricFormatted(limit.get('metricValue'))} of ${numericMetricFormatted(limit.get('limitValue'))})`;
    }

    return (
      <li key={index}>
        <Link to="settings-limits">
          <strong>{limit.get('section')} - {limit.get('name')}</strong> {values}
        </Link>
      </li>
    );
  }

});
