import React from 'react';
import {Loader} from '@keboola/indigo-ui';

export default React.createClass({
  displayName: 'MigrateToRowsButton',
  propTypes: {
    componentId: React.PropTypes.string,
    configId: React.PropTypes.string.isRequired,
    actionsProvisioning: React.PropTypes.object.isRequired,
    isPending: React.PropTypes.bool
  },

  migrateConfig() {
    const ExDbActionCreators = this.props.actionsProvisioning.createActions(this.props.componentId);
    ExDbActionCreators.migrateConfig(this.props.configId);
  },

  render() {
    if (this.props.isPending) {
      return (
        <span className="btn">
          <Loader/>
        </span>
      );
    } else {
      return (
          <button
            className="btn"
            onClick={this.migrateConfig}
          >
            Migrate configuration
          </button>
      );
    }
  }
});