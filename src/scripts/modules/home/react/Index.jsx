import React from 'react';
import ApplicationStore from '../../../stores/ApplicationStore';
import filesize from 'filesize';
import string from 'underscore.string';
import LimitsOverQuota from './LimitsOverQuota';
import Expiration from './Expiration';
// import ComponentStore from '../../components/stores/ComponentsStore';
import InstalledComponentStore from '../../components/stores/InstalledComponentsStore';
import componentsActions from '../../components/InstalledComponentsActionCreators';
// import InstalledComponentsApi from '../../components/InstalledComponentsApi';
import Deprecation from './Deprecation';
import createStoreMixin from '../../../react/mixins/createStoreMixin';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentStore)],

  getStateFromStores() {
    return {
      installedComponents: InstalledComponentStore.getAll()
    };
  },

  componentDidMount() {
    componentsActions.loadComponents();
  },

  getInitialState() {
    const currentProject = ApplicationStore.getCurrentProject(),
      tokenStats = ApplicationStore.getTokenStats();
    const limits = ApplicationStore.getLimits().find(function(group) {
      return group.get('id') === 'connection';
    }).get('limits');
    const sizeBytes = limits.find(function(limit) {
      return limit.get('id') === 'storage.dataSizeBytes';
    }).get('metricValue');
    const rowsCount = limits.find(function(limit) {
      return limit.get('id') === 'storage.rowsCount';
    }).get('metricValue');
    return {
      data: {
        sizeBytes: sizeBytes,
        rowsCount: rowsCount
      },
      tokens: tokenStats,
      projectId: currentProject.get('id'),
      limitsOverQuota: ApplicationStore.getLimitsOverQuota(),
      expires: ApplicationStore.getCurrentProject().get('expires')
    };
  },

  render() {
    return (
      <div className="container-fluid kbc-main-content">
        <Expiration expires={this.state.expires} />
        <LimitsOverQuota limits={this.state.limitsOverQuota} />
        <Deprecation components={this.state.installedComponents} />
        <div className="table kbc-table-border-vertical kbc-layout-table kbc-overview">
          <div className="tbody">
            <div className="tr">
              <div className="td">
                <h2>Storage</h2>
                <h3 style={ {fontSize: '42px'} }>{filesize(this.state.data.sizeBytes)}</h3>
                <h3 style={ {fontSize: '24px'} }>{string.numberFormat(this.state.data.rowsCount)} <small>Rows</small></h3>
              </div>
              <div className="td">
                <h2>Access</h2>
                <h3 style={ {fontSize: '42px'} }>{this.state.tokens.get('adminCount')} <small style={ {fontSize: '16px'} }>Users</small></h3>
                <h3 style={ {fontSize: '24px'} }>{this.state.tokens.get('totalCount') - this.state.tokens.get('adminCount')} <small>API Tokens</small></h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
