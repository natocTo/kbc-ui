import React from 'react';
import {Link} from 'react-router';
import {Map} from 'immutable';

import './TrashIndex.less';

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

  renderHelp() {
    if (this.state.installedFilteredComponents.count()) {
      return (
        <div className="row">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
        </div>
      );
    }
  },

  renderRows() {
    let components = this.state.installedFilteredComponents;

    if (components.count()) {
      return components.map(function(component) {
        return (
          <DeletedComponentRow
            component={component}
            deletingConfigurations={this.state.deletingConfigurations.get(component.get('id'), Map())}
            restoringConfigurations={this.state.restoringConfigurations.get(component.get('id'), Map())}
            key={component.get('id')}
          />
        );
      }, this).toArray();
    } else {
      return (
        <SplashIcon icon="kbc-icon-cup" label={this.splashLabel()}/>
      );
    }
  },

  splashLabel() {
    if (this.state.filterName || this.state.filterType) {
      return 'Any configurations found';
    } else {
      return 'Trash is empty';
    }
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

    return (
      <div className="container-fluid kbc-main-content kbc-components-list">
        {this.renderTabs()}
        <div className="kbc-trash-search clearfix">
          <div className="col-md-7">
            <SearchRow
              className="row kbc-search-row"
              query={this.state.filterName}
              onChange={(query) => this.handleFilterChange(query, 'name')}
            />
          </div>
          <div className="col-md-5">
            <div className="col-md-12">
              <div className="kbc-trash-controls">
                <div className="kbc-trash-buttons">
                  <TrashHeaderButtons />
                </div>
                <div className="kbc-trash-filter">
                  <Select
                    value={this.state.filterType}
                    onChange={(query) => this.handleFilterChange(query, 'type')}
                    options={typeFilterOptions}
                    placeholder="All components"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.renderHelp()}
        {this.renderRows()}
      </div>
    );
  },

  projectPageUrl(path) {
    return ApplicationStore.getProjectPageUrl(path);
  }
});
