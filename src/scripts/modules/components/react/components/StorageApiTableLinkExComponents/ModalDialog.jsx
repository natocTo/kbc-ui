import React, {PropTypes} from 'react';

import EventsTab from './EventsTab';
import GeneralInfoTab from './GeneralInfoTab';
import DataSampleTab from './DataSampleTab';
import ColumnsInfoTab from './ColumnsInfoTab';
import TableDescriptionTab from './TableDescriptionTab';

import SapiTableLink from '../StorageApiTableLink';
import immutableMixin from '../../../../../react/mixins/ImmutableRendererMixin';

import {TabbedArea, TabPane} from './../../../../../react/common/KbcBootstrap';
import {Modal} from 'react-bootstrap';
import {RefreshIcon} from 'kbc-react-components';


export default React.createClass({

  propTypes: {
    show: PropTypes.bool.isRequired,
    tableId: PropTypes.string.isRequired,
    reload: PropTypes.func.isRequired,
    tableExists: PropTypes.bool.isRequired,
    omitFetches: PropTypes.bool,
    events: PropTypes.object.isRequired,
    omitExports: PropTypes.bool,
    isLoading: PropTypes.bool,
    loadingProfilerData: PropTypes.bool,
    table: PropTypes.object,
    dataPreview: PropTypes.object,
    dataPreviewError: PropTypes.string,
    enhancedAnalysis: PropTypes.object,
    onOmitFetchesFn: PropTypes.func,
    onOmitExportsFn: PropTypes.func,
    onHideFn: PropTypes.func,
    isRedshift: PropTypes.bool,
    onRunAnalysis: PropTypes.func,
    isCallingRunAnalysis: PropTypes.bool

  },

  mixins: [immutableMixin],

  render() {
    const modalBody = this.renderModalBody();
    let tableLink = (<small className="disabled btn btn-link"> Explore in Console</small>);
    if (this.props.tableExists) {
      tableLink =
      (
        <SapiTableLink
          tableId={this.props.tableId}>
          <small className="btn btn-link">
            Explore in Console
          </small>
        </SapiTableLink>);
    }
    return (
      <span className="static-modal">
        <Modal
          bsSize="large"
          show={this.props.show}
          onHide={this.props.onHideFn}
          >
          <Modal.Header closeButton>
            <Modal.Title>
              {this.props.tableId}
              {tableLink}
              <RefreshIcon
                 isLoading={this.props.isLoading}
                 onClick={this.props.reload}
              />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalBody}
          </Modal.Body>
        </Modal>
      </span>
    );
  },

  renderModalBody() {
    return (
      <TabbedArea defaultActiveKey="general" animation={false} id={'modal' + this.props.tableId}>
        <TabPane eventKey="general" title="General Info">
          {this.renderGeneralInfo()}
        </TabPane>
        <TabPane eventKey="description" title="Description">
          {this.renderTableDescription()}
        </TabPane>
        <TabPane eventKey="columns" title="Columns">
          {this.renderColumnsInfo()}
        </TabPane>
        <TabPane eventKey="datasample" title="Data Sample">
          {this.renderDataSample()}
        </TabPane>
        <TabPane eventKey="events" title="Events">
          {this.renderEvents()}
        </TabPane>
      </TabbedArea>
    );
  },

  renderGeneralInfo() {
    return (
      <GeneralInfoTab
        isLoading={this.props.isLoading}
        table={this.props.table}
        tableExists={this.props.tableExists}
      />
    );
  },

  renderTableDescription() {
    return (
      <TableDescriptionTab
        isLoading={this.props.isLoading}
        tableId={this.props.tableId}
        tableExists={this.props.tableExists}
      />
    );
  },

  renderEvents() {
    return (
      <EventsTab
        tableExists={this.props.tableExists}
        tableId={this.props.tableId}
        events={this.props.events}
        omitFetches={this.props.omitFetches}
        omitExports={this.props.omitExports}
        onOmitFetchesFn={this.props.onOmitFetchesFn}
        onOmitExportsFn={this.props.onOmitExportsFn}
      />

    );
  },

  renderDataSample() {
    return (
      <DataSampleTab
        dataPreview={this.props.dataPreview}
        dataPreviewError={this.props.dataPreviewError}
      />
    );
  },

  renderColumnsInfo() {
    return (
      <ColumnsInfoTab
        tableExists={this.props.tableExists}
        table={this.props.table}
        dataPreview={this.props.dataPreview}
        dataPreviewError={this.props.dataPreviewError}
        isRedshift={this.props.isRedshift}
        isCallingRunAnalysis={this.props.isCallingRunAnalysis}
        onRunAnalysis={this.props.onRunAnalysis}
        loadingProfilerData={this.props.loadingProfilerData}
        enhancedAnalysis={this.props.enhancedAnalysis}
      />
    );
  }

});
