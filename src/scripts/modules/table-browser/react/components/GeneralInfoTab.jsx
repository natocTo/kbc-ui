import React, {PropTypes} from 'react';

import date from '../../../../utils/date';
import moment from 'moment';
import _ from 'underscore';
import {Table} from 'react-bootstrap';
import immutableMixin from '../../../../react/mixins/ImmutableRendererMixin';
import EmptyState from '../../../components/react/components/ComponentEmptyState';
import filesize from 'filesize';
import ComponentsStore from '../../../components/stores/ComponentsStore';
import ComponentIcon from '../../../../react/common/ComponentIcon';
import ComponentConfigurationLink from '../../../components/react/components/ComponentConfigurationLink';
import InstalledComponentsStore from '../../../components/stores/InstalledComponentsStore';
import {fromJS} from 'immutable';


export default React.createClass({

  propTypes: {
    isLoading: PropTypes.bool,
    table: PropTypes.object,
    tableExists: PropTypes.bool.isRequired
  },

  mixins: [immutableMixin],

  render() {
    if (!this.props.tableExists) {
      let msg = 'Table does not exist.';
      if (this.props.isLoading) {
        msg = 'Loading...';
      }
      return (
        <EmptyState key="emptytable">
          {msg}
        </EmptyState>
      );
    }
    const table = this.props.table;
    const primaryKey = table.get('primaryKey').toJS();
    const backend = table.getIn(['bucket', 'backend']);
    return (
      <div style={{'max-height': '80vh', overflow: 'auto'}}>
        <Table responsive className="table">
          <thead>
            <tr>
              <td style={{width: '20%'}}>
                ID
              </td>
              <td>
                {table.get('id')}
              </td>
            </tr>
          </thead>
          <tbody>
            {this.renderTableRow('Storage', (<span className="label label-info">{backend}</span>))}
            {this.renderTableRow('Created', this.renderTimefromNow(table.get('created')))}
            {this.renderTableRow('Primary Key', _.isEmpty(primaryKey) ? 'N/A' : primaryKey.join(', '))}
            {this.renderTableRow('Last Import', this.renderTimefromNow(table.get('lastImportDate')))}
            {this.renderTableRow('Last Change', this.renderTimefromNow(table.get('lastChangeDate')))}
            {this.renderTableRow('Origin', this.renderComponentFromMetadata(table))}
            {this.renderTableRow('Rows Count', this.renderRowsCount(table.get('rowsCount')))}
            {this.renderTableRow('Data Size', this.renderDataSize(table.get('dataSizeBytes')))}
            {this.renderTableRow('Columns', table.get('columns').count() + ' columns: ' + table.get('columns').join(', '))}
          </tbody>
        </Table>
      </div>
    );
  },

  renderComponentFromMetadata(table) {
    const metadata = table.get('metadata');
    const componentId = metadata.find(m => m.get('key') === 'KBC.lastUpdatedBy.component.id').get('value');
    const configId = metadata.find(m => m.get('key') === 'KBC.lastUpdatedBy.configuration.id').get('value');
    const component = componentId && ComponentsStore.getComponent(componentId);
    if (!component) return 'N/A';
    const componentName = component.get('type') !== 'transformation' ? `${component.get('name')} ${component.get('type')}` : `${component.get('type')}`;
    const config = InstalledComponentsStore.getConfig(componentId, configId);
    const configName = config ? config.get('name', configId) : configId;
    return (
      <span>
        <ComponentIcon component={fromJS(component)}/>
        <ComponentConfigurationLink componentId={componentId} configId={configId}>{componentName} / {configName}
        </ComponentConfigurationLink>
      </span>
    );
  },

  renderRowsCount(value) {
    if (value === null) {
      return 'N/A';
    }
    return value + ' rows';
  },

  renderDataSize(value) {
    if (value === null) {
      return 'N/A';
    }
    return filesize(value);
  },

  renderTimefromNow(value) {
    if (value === null) {
      return 'N/A';
    }
    const fromNow = moment(value).fromNow();
    return (
      <span> {date.format(value)}
        <small> {fromNow} </small>
      </span>
    );
  },

  renderTableRow(name, value) {
    return (
      <tr>
        <td>
          {name}
        </td>
        <td>
          {value}
        </td>
      </tr>
    );
  }

});
