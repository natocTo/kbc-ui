import React from 'react';
import {Link} from 'react-router';
import {Map} from 'immutable';

import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import ComponentsStore from '../../../components/stores/ComponentsStore';
import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';
import InstaledComponentsActions from '../../../components/InstalledComponentsActionCreators';
import ApplicationStore from '../../../../stores/ApplicationStore';

import Select from '../../../../react/common/Select';
import SplashIcon from '../../../../react/common/SplashIcon';
import SearchRow from '../../../../react/common/SearchRow';
import DeletedComponentRow from '../components/DeletedComponentRow';
import TrashHeaderButtons from '../components/TrashHeaderButtons';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentsStore, ComponentsStore)],

  getStateFromStores() {
    const components = ComponentsStore.getAll().filter(function(component) {
      if (component.get('flags').includes('excludeFromNewList')) {
        return false;
      }

      return true;
    });

    return {
      filterName: InstalledComponentsStore.getTrashFilter('name'),
      filterType: InstalledComponentsStore.getTrashFilter('type'),
      installedComponents: InstalledComponentsStore.getAllDeleted(),
      installedFilteredComponents: InstalledComponentsStore.getAllDeletedFiltered(),
      deletingConfigurations: InstalledComponentsStore.getDeletingConfigurations(),
      restoringConfigurations: InstalledComponentsStore.getRestoringConfigurations(),
      components: components
    };
  },

  handleFilterChange(query, filterType) {
    InstaledComponentsActions.deletedConfigurationsFilterChange(query, filterType);
  },

  renderTabs() {
    return (
      <ul className="nav nav-tabs">
        <li role="presentation">
          <a href={this.projectPageUrl('settings-users')}>Users</a>
        </li>
        <li role="presentation">
          <a href={this.projectPageUrl('settings')}>Settings</a>
        </li>
        <li role="presentation">
          <Link to="settings-limits">Limits</Link>
        </li>
        <li role="presentation">
          <Link to="settings-project-power">Project Power</Link>
        </li>
        <li role="presentation" className="active">
          <Link to="settings-trash">Trash</Link>
        </li>
      </ul>
    );
  },

  render() {
    const typeFilterOptions = [
      {
        'label': 'Extractors',
        'value': 'extractor'
      },
      {
        'label': 'Transformations',
        'value': 'transformation'
      },
      {
        'label': 'Writers',
        'value': 'writer'
      },
      {
        'label': 'Applications',
        'value': 'application'
      },
      {
        'label': 'Extractors',
        'value': 'extractor'
      }
    ];
    if (this.state.installedComponents.count()) {
      let components = this.state.installedFilteredComponents;
      const rows = components.map(function(component) {
        return (
          <DeletedComponentRow
            component={component}
            deletingConfigurations={this.state.deletingConfigurations.get(component.get('id'), Map())}
            restoringConfigurations={this.state.restoringConfigurations.get(component.get('id'), Map())}
            key={component.get('id')}
          />
        );
      }, this).toArray();

      return (
        <div className="container-fluid kbc-main-content kbc-components-list">
          {this.renderTabs()}
          <SearchRow
            className="row kbc-search-row"
            query={this.state.filterName}
            onChange={(query) => this.handleFilterChange(query, 'name')}
          />
          <div className="row">
            <h2>Configuration trash</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
          </div>
          <div>
            <blockquote>
            <div className="table kbc-table-border-vertical" style={{ 'borderBottom': 0}}>
              <div className="tr">
                <div className="td">
                  <SearchRow
                    className="row kbc-search-row"
                    query={this.state.filterName}
                    onChange={(query) => this.handleFilterChange(query, 'name')}
                  />
                </div>
                <div className="td col-xs-2" style={{ 'padding': 0}}>
                  <TrashHeaderButtons />
                </div>
              </div>
            </div>
            </blockquote>
          </div>
          <div>
            <div className="col-xs-5">
              <SearchRow
                className="row kbc-search-row"
                query={this.state.filterName}
                onChange={(query) => this.handleFilterChange(query, 'name')}
              />
            </div>
            <div className="col-xs-1" />
            <div className="col-xs-4">
              <div className="kbc-search-row">
                <Select
                  value={this.state.filterType}
                  onChange={(query) => this.handleFilterChange(query, 'type')}
                  options={typeFilterOptions}
                  placeholder="All components"
                />
              </div>
            </div>
            <div className="col-xs-2">
              <div className="kbc-search-row">
                <TrashHeaderButtons />
              </div>
            </div>
          </div>
          {rows}
        </div>
      );
    } else {
      return (
        <SplashIcon icon="kbc-icon-cup" label="Trash is empty"/>
      );
    }
  },

  projectPageUrl(path) {
    return ApplicationStore.getProjectPageUrl(path);
  }
});
