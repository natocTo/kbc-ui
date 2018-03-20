import React from 'react';
export default React.createClass({
  propTypes: {
    queries: React.PropTypes.object.isRequired
  },

  render() {
    const invalidQueries = this.props.queries.filter((query) => {
      return query.get('status_code') !== 'DONE';
    });
    if (invalidQueries.length > 0) {
      return (
        <span>
          <pre style={{maxHeight: '350px'}}>
            {JSON.stringify(invalidQueries.toJS(), null, 2)}
          </pre>
        </span>
      );
    } else {
      return (
        <span>SQL is valid.</span>
      );
    }
  }
});
