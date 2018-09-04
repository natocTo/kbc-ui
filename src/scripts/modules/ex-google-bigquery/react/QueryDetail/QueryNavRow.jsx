import React, {PropTypes} from 'react';
import {Link} from 'react-router';

const ROUTE_PREFIX = 'ex-db-generic-';
const COMPONENT_ID = 'keboola.ex-google-bigquery';

export default React.createClass({
  propTypes: {
    query: PropTypes.object.isRequired,
    configurationId: PropTypes.string.isRequired
  },

  render() {
    return (
      <Link
        className="list-group-item"
        to={`${ROUTE_PREFIX + COMPONENT_ID}-query`}
        params={this.linkParams()}
        >
        <strong>{this.props.query.get('name')}</strong>
      </Link>
    );
  },

  linkParams() {
    return {
      config: this.props.configurationId,
      query: this.props.query.get('id')
    };
  }
});
