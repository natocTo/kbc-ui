import _ from 'underscore';
import React from 'react';
import moment from 'moment';
import byteConverter from 'byte-converter';
import FileSelectorModal from './DropboxFileSelectorModal';
import RunButtonModal from '../../components/react/components/RunComponentButton';

import classnames from 'classnames';
import ComponentDescription from '../../components/react/components/ComponentDescription';
import DeleteConfigurationButton from '../../components/react/components/DeleteConfigurationButton';
import LatestVersions from '../../components/react/components/SidebarVersionsWrapper';

import SapiTableLinkEx from '../../components/react/components/StorageApiTableLinkEx';
import actions from '../../components/InstalledComponentsActionCreators';

import { MD5 } from 'crypto-js';
import { Loader } from 'kbc-react-components';
import { fromJS, Map, List } from 'immutable';

import InstalledComponentsStore from '../../components/stores/InstalledComponentsStore';
import ExDropboxStore from '../stores/ExDropboxStore';
import createStoreMixin from '../../../react/mixins/createStoreMixin';
import RoutesStore from '../../../stores/RoutesStore';
import StorageActionCreators from '../../components/StorageActionCreators';
import StorageBucketsStore from '../../components/stores/StorageBucketsStore';
import LatestJobsStore from '../../jobs/stores/LatestJobsStore';
import LatestJobs from '../../components/react/components/SidebarJobs';
import ComponentsMetadata from '../../components/react/components/ComponentMetadata';

import {
  filterBuckets,
  listBucketNames,
  getDestinationName,
  getBucketsForSelection,
  sortTimestampsInAscendingOrder,
  sortTimestampsInDescendingOrder
} from '../actions/ApplicationActions';

const componentId = 'radektomasek.ex-dropbox-v2';

export default React.createClass({

  mixins: [createStoreMixin(InstalledComponentsStore, LatestJobsStore, ExDropboxStore, StorageBucketsStore)],

  getStateFromStores() {
    let configId = RoutesStore.getCurrentRouteParam('config');
    let configData = InstalledComponentsStore.getConfigData(componentId, configId);
    let localState = InstalledComponentsStore.getLocalState(componentId, configId);
    let parameters = configData.get('parameters', Map());
    let dropboxFiles = ExDropboxStore.getCsvFiles();
    let keboolaBuckets = StorageBucketsStore.getAll();
    let isSaving = InstalledComponentsStore.isSavingConfigData(componentId, configId);
    let selectedInputBucket = localState.get('selectedInputBucket', Map());
    let selectedDropboxFiles = localState.get('selectedDropboxFiles', Map());
    let isDefaultBucketSelected = localState.get('isDefaultBucketSelected', true);

    return {
      configId: configId,
      isSaving: isSaving,
      configData: configData,
      parameters: parameters,
      localState: localState,
      dropboxFiles: dropboxFiles,
      keboolaBuckets: keboolaBuckets,
      selectedInputBucket: selectedInputBucket,
      selectedDropboxFiles: selectedDropboxFiles,
      isDefaultBucketSelected: isDefaultBucketSelected,
      latestJobs: LatestJobsStore.getJobs(componentId, configId)
    };
  },

  getInitialState() {
    return {
      showFileSelectorModal: false
    };
  },

  openFileSelectorModal() {
    this.setState({
      showFileSelectorModal: true
    });
  },

  closeFileSelectorModal() {
    this.setState({
      showFileSelectorModal: this.state.isSaving
    });

    this.updateLocalState(['selectedDropboxFiles'], fromJS([]));
    this.updateLocalState(['selectedInputBucket'], '');
  },

  componentDidMount() {
    StorageActionCreators.loadBucketsForce();
  },

  render() {
    return (
      <div className="container-fluid">
        {this.renderMainContent()}
        {this.renderSideBar()}
      </div>
    );
  },

  renderMainContent() {
    const hasFiles = this.state.configData.hasIn(['parameters', 'config', 'dropboxFiles']);
    const filesCount = hasFiles ? this.state.configData.getIn(['parameters', 'config', 'dropboxFiles']).count() : 0;

    return (
      <div className="col-md-9 kbc-main-content">
        {this.renderComponentDescription(hasFiles, filesCount)}
        {this.renderConfigSummary()}
        {this.renderInitialSelectionOfFiles(hasFiles, filesCount)}
      </div>
    );
  },

  renderComponentDescription(hasFiles, filesCount) {
    const renderStandardFileSelection = hasFiles && filesCount > 0 ? this.renderFileSelectorModal() : null;
    return (
      <div className="row kbc-header">
        <div className="col-sm-8">
          <ComponentDescription
            componentId={componentId}
            configId={this.state.configId}
          />
        </div>
        <div className="col-sm-4 kbc-buttons">
          {renderStandardFileSelection}
        </div>
      </div>
    );
  },

  renderFileSelectorModal() {
    return (
      <div>
        <a onClick={this.openFileSelectorModal}>
          <span className="btn btn-success">+ Add Files</span>
        </a>
        <FileSelectorModal
          configId={this.state.configId}
          saveConfig={this.saveConfig}
          isSaving={this.state.isSaving}
          cancelConfig={this.cancelConfig}
          canSaveConfig={this.canSaveConfig}
          onHide={this.closeFileSelectorModal}
          keboolaBuckets={this.getInputBuckets()}
          show={this.state.showFileSelectorModal}
          selectedInputBucket={this.getSelectedBucket}
          handleCsvSelectChange={this.handleCsvSelectChange}
          handleBucketChange={this.handleInputBucketChange}
          selectedDropboxFiles={this.getSelectedCsvFiles()}
        />
      </div>
    );
  },

  renderConfigSummary() {
    const hasSelectedFiles = this.state.configData.hasIn(['parameters', 'config', 'dropboxFiles']);
    const selectedFiles = hasSelectedFiles ? this.state.configData.getIn(['parameters', 'config', 'dropboxFiles']) : List();
    const converter = byteConverter.converterBase10;

    if (hasSelectedFiles && selectedFiles.count() > 0) {
      return (
        <div className="section">
          <table className="table table-striped">
          <thead>
            <tr>
              <th>Dropbox File</th>
              <th>Size</th>
              <th>Bucket</th>
              <th />
              <th>Output Table</th>
              <th />
            </tr>
          </thead>
            <tbody>
            {
              selectedFiles.toJS().map((table, index) => {
                const handleDeletingSingleElement = this.handleDeletingSingleElement.bind(this, index);
                const handleUploadingSingleElement = this.handleUploadingSingleElement.bind(this, index);
                return (
                  <tr key={index}>
                      <td>{table.name}</td>
                      <td>{converter(table.bytes, 'B', 'MB').toFixed(5)} MB</td>
                      <td>{table.bucket}</td>
                      <td>&gt;</td>
                      <td><SapiTableLinkEx tableId={table.output} /></td>
                      <td className="text-right">
                      {this.state.isSaving ? <Loader /> : <button className="btn btn-link" onClick={handleDeletingSingleElement}><i className="fa kbc-icon-cup" /></button>}
                      <RunButtonModal
                        title="Upload"
                        icon="fa fa-fw fa-play"
                        mode="button"
                        component={componentId}
                        runParams={handleUploadingSingleElement}
                        >
                        You are about to upload <strong>1 csv file</strong> from your Dropbox.
                        The result will be stored into selected buckets.
                      </RunButtonModal>
                    </td>
                  </tr>
                );
              })
            }
            </tbody>
          </table>
        </div>
      );
    }
  },

  // This component will popup once the authorization is done, but no file has been selected yet.
  renderInitialSelectionOfFiles(hasFiles, filesCount) {
    if (!hasFiles || filesCount === 0) {
      return (
        <div className="row component-empty-state text-center">
          <p>No files selected yet.</p>
          {this.renderFileSelectorModal()}
        </div>
      );
    }
  },

  runParams() {
    return () => ({config: this.state.configId});
  },

  renderSideBar() {
    return (
      <div className="col-md-3 kbc-main-sidebar">
        <div className="kbc-buttons kbc-text-light">
          <ComponentsMetadata componentId={componentId} configId={this.state.configId} />
        </div>
        <ul className="nav nav-stacked">
          <li className={classnames({disabled: !this.canRunUpload()})}>
            <RunButtonModal
              title="Run"
              icon="fa-play"
              mode="link"
              component={componentId}
              disabled={!this.canRunUpload()}
              disabledReason="A Dropbox file must be selected."
              runParams={this.runParams()}
              >
              You are about to run upload of <strong>{this.state.configData.getIn(['parameters', 'config', 'dropboxFiles'], List()).count()} csv files</strong> from your Dropbox.
              The result will be stored into selected bucket(s).
            </RunButtonModal>
          </li>
          <li>
            <DeleteConfigurationButton
              componentId={componentId}
              configId={this.state.configId}
              customDeleteFn={() => {}}
            />
          </li>
          <li>
            <LatestJobs
              limit={3}
              jobs={this.state.latestJobs}
            />
            <LatestVersions
              limit={3}
              componentId={componentId}
            />
          </li>
        </ul>
      </div>
    );
  },

  canSaveConfig() {
    let hasLocalConfigDataBucket = this.state.localState.has('selectedInputBucket');
    let localConfigDataBucket = this.state.localState.get('selectedInputBucket');

    // We can save new config whether user changed files selection.
    // On the other hand the bucket may be changed, but we also have to make sure the bucket is set.
    return !(hasLocalConfigDataBucket && this.getLocalConfigDataFilesCount() > 0 && localConfigDataBucket !== '');
  },

  getLocalConfigDataFilesCount() {
    if (!this.state.localState.has('selectedDropboxFiles')) {
      return 0;
    }
    return fromJS(this.state.localState.get('selectedDropboxFiles')).size;
  },

  updateParameters(newParameters) {
    this.updateAndSaveConfigData(['parameters'], newParameters);
  },

  updateAndSaveConfigData(path, data) {
    let newData = this.state.configData.setIn(path, data);
    return actions.saveComponentConfigData(componentId, this.state.configId, newData);
  },

  saveConfig() {
    const hasSelectedBucket = this.state.localState.has('selectedInputBucket');
    const hasSelectedDropboxFiles = this.state.localState.has('selectedDropboxFiles');

    if (hasSelectedBucket && hasSelectedDropboxFiles) {
      const localBucket = this.state.localState.get('selectedInputBucket');
      const localState = this.state.localState.get('selectedDropboxFiles').map((dropboxFile) => {
        return {
          bytes: dropboxFile.bytes,
          link: dropboxFile.link,
          name: dropboxFile.name,
          bucket: localBucket,
          timestamp: moment().unix(),
          hash: MD5(dropboxFile.name + localBucket).toString(),
          output: localBucket + '.' + getDestinationName(dropboxFile.name)
        };
      });

      const oldState = this.state.configData.getIn(['parameters', 'config', 'dropboxFiles'], Map()).toJS();
      const mergedState = [...oldState, ...localState];

      // We need to dedup the state in case there has been selected the same combination of file + bucket.
      // We also need to keep the older files to make sure we keep consistent file names in case of duplicate in names.
      const dedupState = _.values(_.indexBy(mergedState.sort(sortTimestampsInDescendingOrder), 'hash'));

      // We need to make sure the final name will be unique.
      const newState = _.flatten(_.values(_.groupBy(dedupState, 'output')).map((arrayOfFileNames) =>{
        if (arrayOfFileNames.length === 1) {
          return arrayOfFileNames;
        } else {
          return arrayOfFileNames.sort(sortTimestampsInAscendingOrder).map((fileName, index) => {
            if (index > 0) {
              return Object.assign({}, fileName, {
                output: fileName.output + fileName.hash.slice(0, 4)
              });
            }
            return fileName;
          });
        }
      })).sort(sortTimestampsInAscendingOrder);

      return this.updateAndSaveConfigData(['parameters', 'config', 'dropboxFiles'], fromJS(newState));
    }
  },

  cancelConfig() {
    this.updateLocalState(['selectedDropboxFiles'], fromJS([]));
    this.updateLocalState(['selectedInputBucket'], '');
  },

  canRunUpload() {
    return (this.state.configData.hasIn(['parameters', 'config', 'dropboxFiles']) && this.state.configData.getIn(['parameters', 'config', 'dropboxFiles']).count() > 0);
  },

  getSelectedCsvFiles() {
    let selectedDropboxFiles = [];
    let localConfigDataFiles = this.state.localState.get('selectedDropboxFiles');
    let hasLocalConfigDataFiles = this.state.localState.has('selectedDropboxFiles');

    if (hasLocalConfigDataFiles) {
      localConfigDataFiles.map((fileName) => {
        selectedDropboxFiles.push(fileName);
      });
    }

    return selectedDropboxFiles;
  },

  getSelectedBucket() {
    let localConfigDataBucket = this.state.localState.get('selectedInputBucket');
    let hasLocalConfigDataBucket = this.state.localState.has('selectedInputBucket');

    if (hasLocalConfigDataBucket && localConfigDataBucket !== '') {
      return localConfigDataBucket;
    }

    return '';
  },

  handleDeletingSingleElement(element) {
    if (this.state.configData.hasIn(['parameters', 'config', 'dropboxFiles'])) {
      let newConfig = this.state.configData.getIn(['parameters', 'config', 'dropboxFiles']).delete(element);
      this.updateAndSaveConfigData(['parameters', 'config', 'dropboxFiles'], newConfig);
    }
  },

  handleUploadingSingleElement(element) {
    if (this.state.configData.hasIn(['parameters', 'config', 'dropboxFiles'])) {
      const selectedFile = this.state.configData.getIn(['parameters', 'config', 'dropboxFiles']).get(element).toJS();
      return {
        configData: {
          parameters: {
            config: {
              dropboxFiles: [{
                link: selectedFile.link,
                name: selectedFile.name,
                bucket: selectedFile.bucket,
                output: selectedFile.output
              }]
            }
          }
        }
      };
    }
  },

  getInputBuckets() {
    return getBucketsForSelection(listBucketNames(filterBuckets(this.state.keboolaBuckets)));
  },

  handleCsvSelectChange(values) {
    this.updateLocalState(['selectedDropboxFiles'], values);
  },

  handleInputBucketChange(value) {
    this.updateLocalState(['selectedInputBucket'], value);
  },

  updateLocalState(path, data) {
    let newLocalState = this.state.localState.setIn(path, data);
    actions.updateLocalState(componentId, this.state.configId, newLocalState, path);
  }
});
