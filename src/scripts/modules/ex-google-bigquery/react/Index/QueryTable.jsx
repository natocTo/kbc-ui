import React, {PropTypes} from 'react';

import {Check} from '@keboola/indigo-ui';

import StorageTableLink from '../../../components/react/components/StorageApiTableLinkEx';

import ActivateDeactivateButton from '../../../../react/common/ActivateDeactivateButton';
import RunExtractionButton from '../../../components/react/components/RunComponentButton';

import QueryDeleteButton from './../components/QueryDeleteButton';

import {Link} from 'react-router';

export default React.createClass({
  propTypes: {
    componentId: React.PropTypes.string.isRequired,
    queryDetailRoute: React.PropTypes.string.isRequired,
    configId: PropTypes.string.isRequired,
    deleteQueryFn: PropTypes.func.isRequired,
    isPendingFn: PropTypes.func.isRequired,
    toggleQueryEnabledFn: PropTypes.func.isRequired,
    getRunSingleQueryDataFn: PropTypes.func.isRequired,
    queries: PropTypes.object.isRequired
  },

  render() {
    return (
      <div className="table table-striped table-hover">
        <div
          className="thead"
          key="table-header"
        >
          <div className="tr">
            <div className="th">
              <strong> Name </strong>
            </div>
            <div className="th">
              <strong> Output table </strong>
            </div>
            <div className="th">
              <strong> Incremental </strong>
            </div>
            <div className="th">
              <strong> Primary key </strong>
            </div>
            <div className="th">
              {/* action buttons */}
            </div>
          </div>
        </div>
        <div className="tbody">
          {this.props.queries.map((q) => this.renderQueryRow(q))}
        </div>
      </div>
    );
  },

  renderQueryRow(query) {
    return (
      <Link
        to={this.props.queryDetailRoute}
        params={{
          config: this.props.configId,
          query: query.get('id')
        }}
        className="tr">
        <span className="td kbc-break-all">
          { query.get('name') ?
            query.get('name')
            :
            <span className="text-muted">
              Untitled
            </span>
          }
        </span>
        <span className="td kbc-break-all">
          <StorageTableLink tableId={query.get('outputTable')} />
        </span>
        <span className="td">
          <Check isChecked={query.get('incremental', false)} />
        </span>
        <span className="td">
          {query.get('primaryKey', []).join(', ')}
        </span>
        <span className="td text-right kbc-no-wrap">
          <QueryDeleteButton
            query={query}
            onDeleteFn={() => this.props.deleteQueryFn(query.get('id'))}
            isPending={this.props.isPendingFn(['deleteQuery', query.get('id')])}
          />
          <ActivateDeactivateButton
            activateTooltip="Enable Query"
            deactivateTooltip="Disable Query"
            isActive={query.get('enabled')}
            isPending={this.props.isPendingFn(['toggleQuery', query.get('id')])}
            onChange={() => this.handleToggleQuery(query)}
          />
          <RunExtractionButton
            title="Run Extraction"
            component={this.props.componentId}
            runParams={ () => {
              return {
                config: this.props.configId,
                configData: this.props.getRunSingleQueryDataFn(query.get('id'))
              };
            }}
          >
            You are about to run an extraction.
          </RunExtractionButton>
        </span>
      </Link>
    );
  },

  handleToggleQuery(query) {
    this.props.toggleQueryEnabledFn(query.get('id'));
  }

});
