import React from 'react';
import InvalidQuery from './InvalidQuery';

export default React.createClass({
  propTypes: {
    bucketId: React.PropTypes.string.isRequired,
    queries: React.PropTypes.object.isRequired,
    onRedirect: React.PropTypes.func.isRequired
  },

  render() {
    const invalidQueries = this.props.queries.filter((query) => {
      return query.get('status_code') !== 'DONE';
    });
    if (invalidQueries.count() > 0) {
      return (
        <div className="alert alert-danger">
          <h4>Following errors were found</h4>
          {invalidQueries.map((invalidItem) => {
            const [transformationId, itemType, itemIdentifier] = invalidItem.get('name').split('.');
            switch (itemType) {
              case 'query':
                return (
                  <InvalidQuery
                    bucketId={this.props.bucketId}
                    key={invalidItem.get('name')}
                    transformationId={transformationId}
                    queryNumber={parseInt(itemIdentifier, 10)}
                    message={invalidItem.get('status_desc')}
                    onClick={this.props.onRedirect}
                  />
                );
              default:
                return (
                  <p>{invalidItem.get('status_desc')}</p>
                );
            }
          }).toArray()}
        </div>);
    } else {
      return (
        <span>SQL is valid.</span>
      );
    }
  }
});
