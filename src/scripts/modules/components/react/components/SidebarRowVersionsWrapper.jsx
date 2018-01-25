import React from 'react';
import SidebarVesions from './SidebarVersions';

import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import InstalledComponentStore from '../../stores/InstalledComponentsStore';
import ComponentStore from '../../stores/ComponentsStore';
import VersionsStore from '../../stores/VersionsStore';
import VersionsActionCreators from '../../VersionsActionCreators';

export default React.createClass({
  displayName: 'LatestRowVersionsWrapper',

  mixins: [createStoreMixin(InstalledComponentStore, ComponentStore, VersionsStore)],

  getStateFromStores: function() {
    const versionsLinkTo = this.props.componentId + '-row-versions';
    const versionsLinkParams = {
      component: this.props.componentId,
      config: this.props.configId,
      row: this.props.rowId
    };

    return {
      versions: VersionsStore.getVersions(this.props.componentId, this.props.configId),
      componentId: this.props.componentId,
      configId: this.props.configId,
      isLoading: false,
      versionsLinkTo: versionsLinkTo,
      versionsLinkParams: versionsLinkParams,
      versionsConfigs: VersionsStore.getVersionsConfigs(this.props.componentId, this.props.configId),
      pendingMultiLoad: VersionsStore.getPendingMultiLoad(this.props.componentId, this.props.configId),
      isPending: VersionsStore.isPendingConfig(this.props.componentId, this.props.configId)
    };
  },

  propTypes: {
    limit: React.PropTypes.number,
    componentId: React.PropTypes.string,
    configId: React.PropTypes.string,
    rowId: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      limit: 5
    };
  },

  render: function() {
    if (!this.state.versionsLinkTo) {
      return null;
    }
    return (
      <SidebarVesions
        versions={this.state.versions}
        isLoading={this.state.isLoading}
        configId={this.state.configId}
        componentId={this.state.componentId}
        versionsLinkTo={this.state.versionsLinkTo}
        versionsLinkParams={this.state.versionsLinkParams}
        limit={this.props.limit}
        prepareVersionsDiffData={this.prepareVersionsDiffData}
        versionsConfigs={this.state.versionsConfigs}
        pendingMultiLoad={this.state.pendingMultiLoad}
        isPending={this.state.isPending}
      />
    );
  },

  prepareVersionsDiffData(version1, version2) {
    const configId = this.props.configId;
    return VersionsActionCreators.loadTwoComponentConfigVersions(
      this.props.componentId, configId, version1.get('version'), version2.get('version'));
  }

});
