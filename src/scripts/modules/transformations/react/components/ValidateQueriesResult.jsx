import React from 'react';
import Immutable from 'immutable';
export default React.createClass({
  propTypes: {
    result: React.PropTypes.object.isRequired
  },

  render() {
    const result = this.props.result.get('queries', Immutable.List()).filter((query) => {
      return query.get('status_code') !== 'DONE';
    });
    if (result.length > 0) {
      return (
        <span>
          <pre style={{maxHeight: '350px'}}>
            {JSON.stringify(result.toJS(), null, 2)}
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
