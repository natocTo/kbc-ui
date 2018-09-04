import React from 'react';
import Promise from 'bluebird';
import _ from 'underscore';
import {Modal, Table, Tabs, Tab, Row, Col, Button} from 'react-bootstrap';
import {AlertBlock} from '@keboola/indigo-ui';
import {Check, Loader, RefreshIcon} from '@keboola/indigo-ui';
import {fromJS, List, Map} from 'immutable';
import {Link} from 'react-router';
import SapiTableLink from './StorageApiTableLink';
import InstalledComponentsActionCreators from '../../InstalledComponentsActionCreators';
import ConfirmButtons from '../../../../react/common/ConfirmButtons';
import jobsApi from '../../../jobs/JobsApi';
import DockerActionFn from '../../DockerActionsApi';
import date from '../../../../utils/date';
import JobStatusLabel from '../../../../react/common/JobStatusLabel';
import Tooltip from '../../../../react/common/Tooltip';
import InstalledComponentsStore from '../../stores/InstalledComponentsStore';
import ComponentConfigurationLink from './ComponentConfigurationLink';
import ComponentEmptyState from '../../../components/react/components/ComponentEmptyState';

const PERMANENT_MIGRATION_COMPONENTS = [
  'ex-db',
  'ex-gooddata',
  'ex-google-analytics',
  'ex-google-drive',
  'wr-db-mysql',
  'wr-db-oracle',
  'wr-db-redshift',
  'wr-google-drive'
];

const MIGRATION_COMPONENT_ID = 'keboola.config-migration-tool';

const componentNameMap = Map({
  'ex-gooddata': 'keboola.ex-gooddata',
  'ex-google-analytics': 'keboola.ex-google-analytics',
  'ex-google-drive': 'keboola.ex-google-drive',
  'wr-db-mysql': 'keboola.wr-db-mysql',
  'wr-db-oracle': 'keboola.wr-db-oracle',
  'wr-db-redshift': 'keboola.wr-redshift-v2',
  'wr-google-drive': ['keboola.wr-google-drive', 'keboola.wr-google-sheets']
});

const WR_DB_DESCRIPTION = 'Migrate your current configurations to new Database Writer. This writer will continue to work until May 2017. Then, all your configurations will be migrated automatically. The migration will also alter your orchestrations to use the new writers. The old configurations will remain intact for now. You can remove them yourself after a successful migration.';
const EX_GOODDATA_DESCRIPTION = (
  <p>
    <span>Migration takes place with the following consequences:</span>
    <ul>
      <li><strong>Only GoodData writer reports will be migrated:</strong> Only reports of the GoodData project belonging to a GoodData writer configuration of this project will be migrated. If there are reports from a different(non-writer) GoodData project, then users have to do the migration manually.</li>
      <li><strong>Tables will be stored into different buckets:</strong> A new GoodData extractor will store extracted tables into new buckets.</li>
      <li><strong>Orchestrations tasks update:</strong> All orchestration tasks of the old GoodData extractor configurations will be replaced with configurations of the new GoodData extractor.</li>
      <li><strong>Column naming conventions:</strong> The column names of the extracted table are based on the column names of the GoodData report. However, they can contain only alphanumeric characters and underscores. All other characters are replaced by underscores. For example, if there is a column in the report with the name "Month Revenue", then its corresponding table column name will be "Month_Revenue".</li>
    </ul>
  </p>
);

const WR_GOOGLE_DRIVE_DESCRIPTION = (
  <p>
    <span>Migrate your current configurations to new Google Drive or Google Sheets writer</span>
    <ul>
      <li>Depending on the type of files registered in your configuration, the configuration will be migrated either to new Google Drive Writer, Google Sheets Writer or both.</li>
      <li>If type of the file is 'sheet' and action is not 'create', the file will be migrated to Google Sheets Writer, otherwise to Google Drive Writer.</li>
      <li>The migration will also alter your orchestrations to use the new writers.</li>
      <li>This component will continue to work until December 2017. Then, all your configurations will be migrated automatically.</li>
      <li>The old configurations will remain intact for now. You can remove them after successful migration.</li>
    </ul>
  </p>
);

const descriptionsMap = Map({
  'ex-db': 'Migrate your current configurations to new vendor specific database extractors (MySql, Postgres, Oracle, Microsoft SQL). This extractor will continue to work until August 2016. Then, all your configurations will be migrated automatically. The migration will also alter your orchestrations to use the new extractors. The old configurations will remain intact for now. You can remove them yourself after a successful migration.',
  'ex-gooddata': EX_GOODDATA_DESCRIPTION,
  'ex-google-analytics': 'Migrate your current configurations to new Google Analytics Extractor, which uses the newest API V4. This extractor will continue to work until November 2016. Then, all your configurations will be migrated automatically. The migration will also alter your orchestrations to use the new extractors. The old configurations will remain intact for now. You can remove them yourself after a successful migration.',
  'ex-google-drive': 'Migrate your current configurations to new Google Drive Extractor. This extractor will continue to work until April 2017. Then, all your configurations will be migrated automatically. The migration will also alter your orchestrations to use the new extractors. The old configurations will remain intact for now. You can remove them yourself after a successful migration.',
  'wr-db-mysql': WR_DB_DESCRIPTION,
  'wr-db-oracle': WR_DB_DESCRIPTION,
  'wr-db-redshift': WR_DB_DESCRIPTION,
  'wr-google-drive': WR_GOOGLE_DRIVE_DESCRIPTION
});

export default React.createClass({
  propTypes: {
    componentId: React.PropTypes.string.isRequired,
    replacementAppId: React.PropTypes.string
  },

  getInitialState() {
    return {
      loadingStatus: false,
      isLoading: false,
      status: Map(),
      showModal: false,
      error: null
    };
  },

  loadStatus(additionalState) {
    const newState = _.extend({}, additionalState, {loadingStatus: true});
    this.setState(newState);
    const replacementApp = this.props.replacementAppId;
    let parameters = {
      component: this.props.componentId
    };
    if (replacementApp) {
      parameters = {
        origin: this.props.componentId,
        destination: replacementApp
      };
    }

    const params = {
      configData: {
        parameters: parameters
      }
    };
    const componentsPromise = InstalledComponentsActionCreators.loadComponentsForce();
    const lastJobPromise = this.fetchLastMigrationJob(this.props.componentId);
    const statusPromise = DockerActionFn(MIGRATION_COMPONENT_ID, 'status', params);
    return Promise.props(
      {
        components: componentsPromise,
        job: lastJobPromise,
        status: statusPromise
      }
    ).then((result) => {
      if (result.status.status === 'error') {
        return this.setState({error: result.status.message, loadingStatus: false});
      } else {
        return this.setState({
          job: result.job,
          status: fromJS(result.status),
          loadingStatus: false
        });
      }
    });
  },

  canMigrate() {
    const isPermanent = PERMANENT_MIGRATION_COMPONENTS.indexOf(this.props.componentId) >= 0;
    const hasReplacementApp = this.props.replacementAppId;
    return isPermanent || hasReplacementApp;
  },

  renderTabTitle(title, helptext) {
    return (
      <span>
        {title}
        <Tooltip tooltip={helptext}>
          <span className="fa fa-fw fa-question-circle" />
        </Tooltip>
      </span>
    );
  },

  render() {
    if (!this.canMigrate()) {
      return null;
    }

    const configHelpText = 'List of all configurations to be migrated and their new counterparts';
    const orchHelpText = 'List of orchestrations containing tasks of either the old component or new component. '
      + 'After a successful migration there should be only new component\'s tasks.';

    const body = !this.state.loadingStatus ? (
      <span>
        {this.state.error ?
          <p className="alert alert-danger">
           Error Loading status: {this.state.error}
          </p>
          :
          <div>
            <Tabs className="tabs-inside-modal" defaultActiveKey="general" animation={false} id="components-migration-row-tabs">

              <Tab eventKey="general" title={this.renderTabTitle('Affected Configurations', configHelpText)}>
                {this.renderConfigStatus()}
              </Tab>
              <Tab eventKey="datasample" title={this.renderTabTitle('Affected Orchestrations', orchHelpText)}>
                {this.renderOrhcestrationsStatus()}
              </Tab>
            </Tabs>
          </div>
        }
      </span>
    ) : 'Loading migration status...';
    const dialogTitle = this.renderDialogTitle();
    const footer = (
      <ConfirmButtons
        saveStyle="success"
        saveLabel="Migrate"
        isSaving={this.state.isLoading}
        isDisabled={this.state.isLoading || this.state.loadingStatus || this.state.error}
        onSave={this.onMigrate}
        onCancel={this.hideModal}
      />
    );
    const dialogProps = {
      show: this.state.showModal,
      onHide: this.hideModal,
      bsSize: 'large'
    };
    return (
      <div className="kbc-overview-component-container">
        {this.renderInfoRow()}
        {this.renderModal(dialogTitle, body, footer, dialogProps)}
      </div>
    );
  },

  renderMigrationButton() {
    return (
      <Button
        bsStyle="primary"
        onClick={this.showModal}
        disabled={this.state.isLoading}
      >
        Proceed to Migration
        {this.state.isLoading ? <Loader/> : null}
      </Button>
    );
  },

  showModal() {
    return this.loadStatus({showModal: true});
  },

  hideModal() {
    return this.setState({showModal: false});
  },

  renderInfoRow() {
    return (
      <AlertBlock type="warning" title="This component has been deprecated">
        <Row>
          <Col md={9}>
            <span>
              <p>
                {this.getInfo()}
              </p>
            </span>
            {this.renderMigrationButton()}
          </Col>
        </Row>
      </AlertBlock>
    );
  },

  getInfo() {
    const replacementApp = this.props.replacementAppId;
    if (descriptionsMap.has(this.props.componentId)) {
      return descriptionsMap.get(this.props.componentId);
    }
    if (replacementApp) {
      return `Migration process will migrate all configurations of ${this.props.componentId} to new configurations of ${replacementApp} component within this project. Any encrypted values or authorized accounts will not be migrated and have to be entered/authorized manually again. Beside that all orchestration tasks of the ${this.props.componentId} configurations will be replaced with configurations of the new ${replacementApp}`;
    }
    return '';
  },

  renderModal(title, body, footer, props) {
    return (
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title>
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {body}
        </Modal.Body>
        <Modal.Footer>
          {footer}
        </Modal.Footer>
      </Modal>
    );
  },

  renderOrhcestrationsStatus() {
    const orchestrations = this.state.status.get('orchestrations', List());
    return (
      <span>
        {orchestrations.count() > 0 ?
          <Table responsive className="table table-stripped">
            <thead>
              <tr>
                <th>
                 Orchestration
                </th>
                <th>
                 Contains Old extractor tasks
                </th>
                <th>
                 Contains New extractors tasks
                </th>
              </tr>
            </thead>
            <tbody>
              {orchestrations.map((row) =>
                <tr>
                  <td>
                    {this.renderOrchestrationLink(row.get('id'), row.get('name'))}
                  </td>
                  <td>
                    <Check isChecked={row.get('hasOld')} />
                  </td>
                  <td>
                    <Check isChecked={row.get('hasNew')} />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          :
          <ComponentEmptyState>
           No affected orchestrations found.
          </ComponentEmptyState>
        }
      </span>
    );
  },

  renderDialogTitle() {
    return (
      <span>
        Configuration Migration {' '}
        <RefreshIcon
          isLoading={this.state.loadingStatus}
          onClick={this.loadStatus}
        />
        {this.renderJobInfo()}
      </span>
    );
  },

  fetchLastMigrationJob(componentId) {
    const jobQuery = `params.component:${MIGRATION_COMPONENT_ID}`;
    return jobsApi.getJobsParametrized(jobQuery, 10, 0).then((result) => {
      const jobs = result ? fromJS(result) : List();
      return jobs.find((j) => j.getIn(['params', 'configData', 'parameters', 'component']) === componentId);
    }
    );
  },

  renderConfigStatus() {
    const isReplacementApp = this.props.replacementAppId;
    return (
      <Table responsive className="table table-stripped">
        <thead>
          <tr>
            <th>
              Configuration
            </th>
            {isReplacementApp ? null :
              <th>
               Config Table
              </th>
            }
            <th />
            <th>New Configuration</th>
            <th>
              Migration Status
            </th>
          </tr>
        </thead>
        <tbody>
          {this.state.status.get('configurations', List()).map((row) =>
            <tr>
              <td>
                {this.renderConfigLink(row.get('configId'), this.props.componentId, row.get('configName'))}
              </td>
              {isReplacementApp ? null :
                <td>
                  {this.renderTableLink(row.get('tableId'))}
                </td>
              }
              <td>
                <i className="kbc-icon-arrow-right" />
              </td>
              <td>
                {this.renderNewConfigLink(row)}
              </td>
              <td>
                {this.renderRowStatus(row.get('status'))}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  },

  renderRowStatus(status) {
    if (status === 'success') {
      return <span className="label label-success">{status}</span>;
    }
    if (status.includes('error')) {
      return <span className="label label-danger">error</span>;
    }
    return <span className="label label-info">{status}</span>;
  },

  renderJobInfo() {
    const {job} = this.state;
    if (!job) {
      return (
        <div>
          <small>
            Last Job: N/A
          </small>
        </div>
      );
    }

    return (
      <div>
        <small>
          <strong>Last Job: {' '}</strong>
          {date.format(job.get('createdTime'))} by {job.getIn(['token', 'description'])}
          {' '}
          <Link to="jobDetail" params={{jobId: job.get('id')}}>
            {job.get('id')}
          </Link>
          {'  '}
          <JobStatusLabel status={job.get('status')} />
        </small>
      </div>
    );
  },

  renderNewConfigLink(row) {
    const newComponentIds = List([].concat(this.getNewComponentId(row.get('componentId'))));
    const configs = newComponentIds.map(function(value) {
      return Map()
        .set('newComponentId', value)
        .set('config', InstalledComponentsStore.getConfig(value, row.get('configId')).count() > 0)
        .set('label', `${value} / ${row.get('configName')}`);
    });

    return (
      <ul className="list-unstyled">
        {configs.map((item) =>
          item.get('config')
            ?
            <li>
              {this.renderConfigLink(
                row.get('configId'),
                item.get('newComponentId'),
                item.get('label')
              )}
            </li>
            :
            <li>{item.get('label')}</li>
        )}
      </ul>
    );
  },

  getNewComponentId(componentId) {
    const replacementApp = this.props.replacementAppId;
    if (componentNameMap.has(componentId)) {
      return componentNameMap.get(componentId);
    } else if (replacementApp) {
      return replacementApp;
    } else {
      return componentId;
    }
  },

  renderOrchestrationLink(orchestrationId, name) {
    return (
      <Link to={'orchestrationTasks'} params={{orchestrationId: orchestrationId}}>
        {name ? name : orchestrationId}
      </Link>
    );
  },

  renderConfigLink(configId, componentId, label) {
    return (
      <ComponentConfigurationLink componentId={componentId} configId={configId}>
        {label ? label : configId}
      </ComponentConfigurationLink>
    );
  },

  renderTableLink(tableId) {
    return (
      <SapiTableLink
        tableId={tableId}>
        {tableId}
      </SapiTableLink>);
  },

  onMigrate() {
    this.setState({isLoading: true});
    const replacementApp = this.props.replacementAppId;
    let parameters = {
      component: this.props.componentId
    };
    if (replacementApp) {
      parameters = {
        origin: this.props.componentId,
        destination: replacementApp
      };
    }
    const params = {
      method: 'run',
      component: MIGRATION_COMPONENT_ID,
      data: {
        configData: {
          parameters: parameters
        }
      },
      notify: true
    };

    InstalledComponentsActionCreators
      .runComponent(params)
      .then(this.handleStarted)
      .catch((error) => {
        this.setState({isLoading: false});
        throw error;
      });
  },

  handleStarted() {
    this.setState({isLoading: false});
  }

});
