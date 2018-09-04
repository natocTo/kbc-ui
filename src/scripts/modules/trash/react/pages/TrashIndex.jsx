import React from 'react';
import {Map} from 'immutable';

import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import ComponentsStore from '../../../components/stores/ComponentsStore';
import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';
import InstaledComponentsActions from '../../../components/InstalledComponentsActionCreators';
import Select from 'react-select';
import SplashIcon from '../../../../react/common/SplashIcon';
import SearchRow from '../../../../react/common/SearchRow';
import DeletedComponentRow from '../components/DeletedComponentRow';
import TrashHeaderButtons from '../components/TrashHeaderButtons';
import SettingsTabs from '../../../../react/layout/SettingsTabs';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentsStore, ComponentsStore)],

  getStateFromStores() {
    return {
      filterName: InstalledComponentsStore.getTrashFilter('name'),
      filterType: InstalledComponentsStore.getTrashFilter('type'),
      installedFilteredComponents: InstalledComponentsStore.getAllDeletedFiltered(),
      deletingConfigurations: InstalledComponentsStore.getDeletingConfigurations(),
      restoringConfigurations: InstalledComponentsStore.getRestoringConfigurations(),
      components: ComponentsStore.getAll()
    };
  },

  handleFilterChange(query, filterType) {
    InstaledComponentsActions.deletedConfigurationsFilterChange(query, filterType);
  },

  renderRows() {
    let components = this.state.installedFilteredComponents;

    if (components.count()) {
      return components.map(function(component) {
        let configurations = InstalledComponentsStore.getAllDeletedConfigurationsFiltered(component);
        if (configurations.count() < 1) {
          configurations = component.get('configurations');
        }

        return (
          <DeletedComponentRow
            component={component}
            configurations={configurations}
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
      return 'No removed configurations found';
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
        'label': 'Orchestrations',
        'value': 'orchestrator'
      },
      {
        'label': 'Applications',
        'value': 'application'
      }
    ];

    return (
      <div className="container-fluid">
        <div className="kbc-main-content kbc-components-list">
          <SettingsTabs active="settings-trash" />
          <div className="tab-content">
            <div className="tab-pane tab-pane-no-padding active">
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
                          onChange={(selected) => {
                            const query = selected !== null ? selected.value : '';
                            this.handleFilterChange(query, 'type');
                          }}
                          options={typeFilterOptions}
                          placeholder="All components"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {this.renderRows()}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
