import React from 'react';
import Immutable from 'immutable';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import SnowflakeSandboxCredentialsStore from '../../../provisioning/stores/SnowflakeSandboxCredentialsStore';
import CredentialsActionCreators from '../../../provisioning/ActionCreators';
import SnowflakeCredentials from '../../../provisioning/react/components/SnowflakeCredentials';
import ConfigureSandbox from '../components/ConfigureSandbox';
import RunComponentButton from '../../../components/react/components/RunComponentButton';
import DeleteButton from '../../../../react/common/DeleteButton';
import StorageBucketsStore from '../../../components/stores/StorageBucketsStore';
import StorageTablesStore from '../../../components/stores/StorageTablesStore';

var SnowflakeSandbox = React.createClass({
  mixins: [createStoreMixin(SnowflakeSandboxCredentialsStore, StorageBucketsStore, StorageTablesStore)],
  displayName: 'SnowflakeSandbox',
  getStateFromStores: function() {
    return {
      credentials: SnowflakeSandboxCredentialsStore.getCredentials(),
      pendingActions: SnowflakeSandboxCredentialsStore.getPendingActions(),
      isLoading: SnowflakeSandboxCredentialsStore.getIsLoading(),
      isLoaded: SnowflakeSandboxCredentialsStore.getIsLoaded(),
      tables: StorageTablesStore.getAll(),
      buckets: StorageBucketsStore.getAll()
    };
  },

  getInitialState: function() {
    return {
      sandboxConfiguration: Immutable.Map()
    };
  },

  _renderCredentials: function() {
    return (
      <span>
        <SnowflakeCredentials
          credentials={this.state.credentials}
          isCreating={this.state.pendingActions.get('create')}
        />
      </span>
    );
  },

  _renderControlButtons: function() {
    var state = this.state;
    var component = this;
    const connectLink = 'https://' + this.state.credentials.get('hostname') + '/console/login#/?returnUrl=sql/worksheet';
    if (this.state.credentials.get('id')) {
      return (
        <div>
          <div>
            <RunComponentButton
              component="transformation"
              method="create-sandbox"
              title="Load tables into Snowflake sandbox"
              mode="button"
              label="Load data"
              runParams={() => {
                return state.sandboxConfiguration.toJS();
              }}
              disabled={this.state.pendingActions.size > 0}
              modalRunButtonDisabled={this.state.sandboxConfiguration.get('include', Immutable.List()).size === 0}
            >
              <ConfigureSandbox
                backend="snowflake"
                tables={this.state.tables}
                buckets={this.state.buckets}
                onChange={(params) => {
                  component.setState({
                    sandboxConfiguration: Immutable.fromJS(params)
                  });
                }}/>
            </RunComponentButton>
          </div>
          <div>
            <a
              href={connectLink}
              className="btn btn-link"
              target="_blank"
              disabled={this.state.pendingActions.size > 0}
            >
              <span className="fa fa-fw fa-database"/>
              &nbsp;Connect
            </a>
            <div>
              <DeleteButton
                tooltip="Delete Snowflake Sandbox"
                isPending={this.state.pendingActions.get('drop')}
                pendingLabel="Deleting sandbox"
                isEnabled={this.state.pendingActions.size === 0}
                label="Drop sandbox"
                fixedWidth={true}
                confirm={{
                  title: 'Delete Snowflake Sandbox',
                  text: 'Do you really want to delete the Snowflake sandbox?',
                  onConfirm: this._dropCredentials
                }}
              />
            </div>
          </div>
        </div>
      );
    } else if (!this.state.pendingActions.get('create')) {
      return (
        <button
          className="btn btn-link"
          onClick={this._createCredentials}
        >
          <i className="kbc-icon-plus"/>
          New Sandbox
        </button>
      );
    }
  },
  render: function() {
    return (
      <div className="row">
        <h4>Snowflake</h4>
        <div className="col-md-9">
          {this._renderCredentials()}
        </div>
        <div className="col-md-3">
          {this._renderControlButtons()}
        </div>
      </div>
    );
  },
  _createCredentials: function() {
    return CredentialsActionCreators.createSnowflakeSandboxCredentials();
  },
  _dropCredentials: function() {
    return CredentialsActionCreators.dropSnowflakeSandboxCredentials();
  }
});

module.exports = SnowflakeSandbox;
