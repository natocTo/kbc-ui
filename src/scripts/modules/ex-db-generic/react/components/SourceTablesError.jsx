import React from 'react';

import { loadSourceTables } from '../../actionsProvisioning';
import { Loader } from 'kbc-react-components';

export default React.createClass({
  propTypes: {
    configId: React.PropTypes.string.isRequired,
    componentId: React.PropTypes.string.isRequired,
    sourceTablesLoading: React.PropTypes.bool.isRequired,
    sourceTablesError: React.PropTypes.string
  },

  render() {
    const { componentId, configId, sourceTablesError, sourceTablesLoading } = this.props;
    if (sourceTablesError) {
      return (
        <div className="kbc-inner-content-padding-fix">
          <div className="alert alert-danger">
            <h4>An Error occurred fetching table listing</h4>
            <p>{sourceTablesError}</p>
            <p>
              {sourceTablesLoading ? (
                <span>
                  <Loader /> Retrying fetch of table list from source database ...
                </span>
              ) : (
                <button
                  className="btn btn-danger"
                  onClick={() => loadSourceTables(componentId, configId)}
                >
                  Try again
                </button>
              )}
            </p>
          </div>
        </div>
      );
    }

    return null;
  }
});
