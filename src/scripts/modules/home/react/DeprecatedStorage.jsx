import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import contactSupport from '../../../utils/contactSupport';

import './expiration.less';

export default React.createClass({
  propTypes: {
    buckets: PropTypes.object
  },

  render() {
    const mysqlBuckets = this.props.buckets.filter((bucket) => bucket.get('backend') === 'mysql');
    if (!mysqlBuckets.count()) {
      return null;
    }

    return (
      <div className="kbc-overview-component">
        <div className="row kbc-header kbc-expiration kbc-deprecation">
          <div className="alert alert-warning">
            <h3>
              Deprecated MySQL Storage Backend
            </h3>
            <div style={{paddingRight: '6em'}}>
              <p>
                This project has {mysqlBuckets.count()} buckets stored on deprecated MySQL backend.
              </p>
              <p>
                These buckets will be automatically migrated to Snowflake in January 2018. This will not affect any operations, only a short maintenance on the project will be required.
                Learn more about the deprecation <a href="http://status.keboola.com/deprecating-mysql-storage-and-transformations" target="_blank">timeline and reasons</a>.
              </p>
              <p>
                You can request the migration and leverage Snowflake performance benefits right now.
              </p>
              <Button onClick={contactSupport} bsStyle="primary">
                Request Migration
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
