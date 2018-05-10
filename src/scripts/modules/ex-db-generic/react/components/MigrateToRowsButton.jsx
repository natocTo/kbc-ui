import React from 'react';

export default React.createClass({
  propTypes: {
    componentId: React.PropTypes.string.isRequired,
    configId: React.PropTypes.string.isRequired,
    pending: React.PropTypes.bool.isRequired,
    actionsProvisioning: React.PropTypes.object.isRequired
  },

  migrateConfig() {
    const ExDbActionCreators = this.props.actionsProvisioning.createActions(this.props.componentId);
    ExDbActionCreators.migrateConfig(this.props.configId);
  },

  render() {
    return (
      <button
        className="btn btn-success"
        onClick={this.migrateConfig}
        disabled={this.props.pending}
      >
        Migrate Configuration
      </button>
    );
  }
});
