import React from 'react';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import VersionsStore from '../../stores/VersionsStore';
import ComponentsStore from '../../stores/ComponentsStore';
import RoutesStore from '../../../../stores/RoutesStore';
import VersionRow from '../components/VersionRow';
import { getPreviousVersion } from '../../../../utils/VersionsDiffUtils';
import { Table } from 'react-bootstrap';
import {SearchBar} from '@keboola/indigo-ui';
import VersionsActionCreators from '../../VersionsActionCreators';
import fuzzy from 'fuzzy';
import immutableMixin from 'react-immutable-render-mixin';
import { Map } from 'immutable';
import createVersionOnRollback from '../../../../utils/createVersionOnRollback';
import createVersionOnCopy from '../../../../utils/createVersionOnCopy';
import { simpleMatch } from '../../../../utils/utils';

const ITEMS_PER_PAGE = 20;

export default function(componentIdValue, configIdParam = 'config', readOnlyMode = false) {
  return React.createClass({
    mixins: [createStoreMixin(VersionsStore), immutableMixin],

    getStateFromStores() {
      var versions, filteredVersions, query;
      const configId = RoutesStore.getCurrentRouteParam(configIdParam);
      const componentId = RoutesStore.getCurrentRouteParam('component') || componentIdValue;
      const component = ComponentsStore.getComponent(componentId);
      versions = VersionsStore.getVersions(componentId, configId);
      query = VersionsStore.getSearchFilter(componentId, configId);
      filteredVersions = versions;
      if (query && query !== '') {
        filteredVersions = versions.filter(function(version) {
          return (
            simpleMatch(query, (String(version.get('version')) || '')) ||
            fuzzy.test(query, (version.get('changeDescription') || '')) ||
            simpleMatch(query, (version.getIn(['creatorToken', 'description']) || '')) ||
            simpleMatch(query, (String(version.get('created')) || ''))
          );
        });
      }
      return {
        componentId: componentId,
        configId: configId,
        versions: versions,
        versionsConfigs: VersionsStore.getVersionsConfigs(componentId, configId),
        filteredVersions: filteredVersions,
        newVersionNames: VersionsStore.getNewVersionNames(componentId, configId),
        query: VersionsStore.getSearchFilter(componentId, configId),
        isPending: VersionsStore.isPendingConfig(componentId, configId),
        pendingActions: VersionsStore.getPendingVersions(componentId, configId),
        pendingMultiLoad: VersionsStore.getPendingMultiLoad(componentId, configId),
        deprecated: component.get('flags').includes('deprecated')
      };
    },

    getInitialState() {
      return {
        page: 1
      };
    },

    getPaginatedVersions() {
      return this.state.filteredVersions.slice(0, ITEMS_PER_PAGE * this.state.page);
    },

    renderVersionRows() {
      const allVersions = this.state.versions;
      return this.getPaginatedVersions().map(function(version, i) {
        const previousVersion = getPreviousVersion(this.state.versions, version);
        const previousVersionConfig = getPreviousVersion(this.state.versionsConfigs, version) || Map();
        const currentVersionConfig = this.state.versionsConfigs.filter((currentVersion) => {
          return version.get('version') === currentVersion.get('version');
        }).first() || Map();
        const isMultiPending = this.state.pendingMultiLoad.get(version.get('version'), false);
        return (
          <VersionRow
            key={version.get('version')}
            version={version}
            versionConfig={currentVersionConfig}
            componentId={this.state.componentId}
            configId={this.state.configId}
            newVersionName={this.state.newVersionNames.get(version.get('version'))}
            isCopyPending={this.state.pendingActions.getIn([version.get('version'), 'copy'], false)}
            isCopyDisabled={readOnlyMode || this.state.isPending}
            isRollbackPending={this.state.pendingActions.getIn([version.get('version'), 'rollback'], false)}
            isRollbackDisabled={readOnlyMode || this.state.isPending}
            hideRollback={readOnlyMode || (i === 0)}
            hideCopy={readOnlyMode || this.state.deprecated}
            isDiffPending={isMultiPending}
            isDiffDisabled={this.state.isPending || isMultiPending}
            previousVersion={previousVersion}
            previousVersionConfig={previousVersionConfig}
            onPrepareVersionsDiffData={() => this.prepareVersionsDiffData(version, previousVersion)}
            isLast={allVersions.first().get('version') === version.get('version')}
            onChangeName={(name) => VersionsActionCreators.changeNewVersionName(this.state.componentId, this.state.configId, version.get('version'), name)}
            onCopy={createVersionOnCopy(this.state.componentId, this.state.configId, version.get('version'), this.state.newVersionNames.get(version.get('version')))}
            onRollback={createVersionOnRollback(this.state.componentId, this.state.configId, version.get('version'))}
          />
        );
      }, this).toArray();
    },


    prepareVersionsDiffData(version1, version2) {
      const configId = this.state.configId;
      return VersionsActionCreators.loadTwoComponentConfigVersions(
        this.state.componentId, configId, version1.get('version'), version2.get('version'));
    },

    onSearchChange(query) {
      VersionsActionCreators.changeFilter(this.state.componentId, this.state.configId, query);
    },

    onShowMore() {
      const nextPage = this.state.page + 1;
      this.setState({page: nextPage});
    },

    render() {
      if (this.state.filteredVersions.count() === 0 && this.state.versions.count() > 0) {
        return (
          <div className="container-fluid">
            <div className="kbc-main-content">
              <div className="row">
                <div className="col-xs-12">
                  <SearchBar onChange={this.onSearchChange} query={this.state.query}/>
                </div>
              </div>
              <p className="row text-center">No results found.</p>
            </div>
          </div>
        );
      }
      return (
          <div className="container-fluid">
            <div className="kbc-main-content">
              <div className="row">
                <div className="col-xs-12">
                  <SearchBar onChange={this.onSearchChange} query={this.state.query}/>
                </div>
              </div>
              <Table striped hover>
                <thead>
                <tr>
                  <th>#</th>
                  <th />
                  <th>Description</th>
                  <th>Changed</th>
                  <th>Created by</th>
                  <th />
                </tr>
                </thead>
                <tbody>
                {this.renderVersionRows()}
                </tbody>
              </Table>
              {this.state.filteredVersions.count() > this.state.page * ITEMS_PER_PAGE ?
                  <div className="kbc-block-with-padding">
                    <button onClick={this.onShowMore} className="btn btn-default btn-large text-center">
                      More..
                    </button>
                  </div>
                  : null
              }
            </div>
          </div>
      );
    }
  });
}
