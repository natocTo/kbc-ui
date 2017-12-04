
import React from 'react';

import {Loader} from 'kbc-react-components';
import {Link} from 'react-router';

export default React.createClass({
  displayName: 'TableLoader',
  propTypes: {
    componentId: React.PropTypes.string,
    configId: React.PropTypes.string.isRequired,
    isLoadingSourceTables: React.PropTypes.bool.isRequired,
    isTestingConnection: React.PropTypes.bool.isRequired,
    validConnection: React.PropTypes.bool.isRequired,
    tableSelectorElement: React.PropTypes.object.isRequired
  },

  render() {
    const { componentId, configId, isLoadingSourceTables, isTestingConnection, validConnection, tableSelectorElement } = this.props;
    if (isTestingConnection) {
      return (
        <div className="form-control-static">
          <Loader/> Asserting connection validity ...
        </div>
      );
    } else if (!validConnection) {
      return (
        <div className="form-control-static">
          <div className="warning"> Failed making database connection, please check your
            <Link
              to={'ex-db-generic-' + componentId + '-credentials'}
              params={{config: configId}}
            > credentials
            </Link>.
          </div>
        </div>
      );
    } else if (isLoadingSourceTables) {
      return (
        <div className="form-control-static">
          <Loader/> Fetching table list from source database ...
        </div>
      );
    }
    return tableSelectorElement;
  }
});
