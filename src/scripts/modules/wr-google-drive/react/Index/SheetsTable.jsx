import React, {PropTypes} from 'react';

import ActivateDeactivateButton from '../../../../react/common/ActivateDeactivateButton';
import RunButton from '../../../components/react/components/RunComponentButton';

import Tooltip from '../../../../react/common/Tooltip';
import {Loader} from 'kbc-react-components';
import Confirm from '../../../../react/common/Confirm';
import StorageTableLink from '../../../components/react/components/StorageApiTableLinkEx';

export default React.createClass({
  propTypes: {
    componentId: PropTypes.string.isRequired,
    configId: PropTypes.string.isRequired,
    inputTables: PropTypes.object.isRequired,
    items: PropTypes.object.isRequired,
    onAddFn: PropTypes.object.isRequired,
    onDeleteFn: PropTypes.func.isRequired,
    onEditFn: PropTypes.func.isRequired,
    toggleEnabledFn: PropTypes.func.isRequired,
    isPendingFn: PropTypes.func.isRequired,
    getRunSingleDataFn: PropTypes.func.isRequired
  },

  render() {
    return (
      <div className="table table-striped table-hover">
        <div className="thead">
          <div className="tr">
            <div className="th">
              <strong>Table Name</strong>
            </div>
            <div className="th">
              {/* right arrow */}
            </div>
            <div className="th">
              <strong>Spreadsheet</strong>
            </div>
            <div className="th">
              <strong>Title</strong>
            </div>
            <div className="th pull-right">
              <button
                className="btn btn-success"
                onClick={this.props.onAddFn}>
                Add Table
              </button>
              {/* action buttons */}
            </div>
          </div>
        </div>
        <div className="tbody">
          {this.props.items.map((item) => this.renderRow(item))}
        </div>
      </div>
    );
  },

  renderRow(item) {
    return (
      <div className="tr">
        <div className="td">
          {this.renderFieldTable(item.get('tableId'))}
        </div>
        <div className="td">
          <i className="kbc-icon-arrow-right" />
        </div>
        <div className="td">
          {item.get('title')}
        </div>
        <div className="td">
          {this.renderFieldSpreadsheet(item.get('fileId'))}
        </div>
        <div className="td text-right kbc-no-wrap">
          {this.renderEditButton(item)}
          {this.renderDeleteButton(item)}
          {this.renderEnabledButton(item)}
          {this.renderRunButton(item)}
        </div>
      </div>
    );
  },

  renderFieldTable(tableId) {
    const configTables = this.props.inputTables.filter((t) => {
      return (t.get('name') === tableId);
    });
    if (configTables.count() === 0) return 'n/a';

    return (
      <StorageTableLink
        tableId={configTables.first().get('id')}
        linkLabel={configTables.first().get('name')}
      />
    );
  },

  renderFieldSpreadsheet(fileId) {
    return (<span>{fileId}</span>);
  },

  renderEditButton(item) {
    return (
      <button
        className="btn btn-link"
        onClick={() => this.props.onEditFn(item)}
      >
        <Tooltip tooltip="Edit" placement="top">
          <i className="kbc-icon-pencil" />
        </Tooltip>
      </button>
    );
  },

  renderDeleteButton(item) {
    const isPending = this.props.isPendingFn(['delete', item.get('id')]);
    if (isPending) {
      return <span className="btn btn-link"><Loader/></span>;
    }
    return (
      <Tooltip placement="top" tooltip="Delete">
        <Confirm
          title="Delete"
          text={`Do you really want to remove ${item.get('title')} from configuration?`}
          buttonLabel="Delete"
          onConfirm={() => this.props.onDeleteFn(item)}
        >
          <button className="btn btn-link">
            <i className="kbc-icon-cup" />
          </button>
        </Confirm>
      </Tooltip>
    );
  },

  renderEnabledButton(item) {
    return (
      <ActivateDeactivateButton
        activateTooltip="Enable"
        deactivateTooltip="Disable"
        isActive={item.get('enabled')}
        isPending={this.props.isPendingFn(['toggle', item.get('id')])}
        onChange={() => this.props.toggleEnabledFn(item.get('id'))}
      />
    );
  },

  renderRunButton(item) {
    return (
      <RunButton
        title="Run"
        component={this.props.componentId}
        runParams={ () => {
          return {
            config: this.props.configId,
            configData: this.props.getRunSingleDataFn(item.get('id'))
          };
        }}
      >
        You are about to upload {item.get('title')}
      </RunButton>
    );
  }

  // matchTableToLongestQuery(tableName) {
  //   const qs = this.props.queries.filter((q) => this.tableIsFromQuery(tableName, q.get('name')));
  //   return qs.max((qa, qb) => qa.get('name').length > qb.get('name').length);
  // },
  //
  // tableIsFromQuery(tableName, queryName) {
  //   return tableName.startsWith(`${queryName}_`) || tableName === queryName;
  // }
});
