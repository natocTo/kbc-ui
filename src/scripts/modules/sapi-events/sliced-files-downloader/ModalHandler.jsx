import React from 'react';
import Modal from './Modal';
import jobsApi from '../../jobs/JobsApi';
import storageApi from '../../components/StorageApi';
import actionCreators from '../../components/InstalledComponentsActionCreators';
import {fromJS} from 'immutable';

const SLICED_FILES_DOWNLOADER_COMPONENT = 'keboola.sliced-files-downloader';

export default React.createClass({
  propTypes: {
    file: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired
  },

  getInitialState() {
    return {
      isModalOpen: false,
      isRunning: false,
      createdFile: null,
      jobId: null,
      progress: null,
      progressStatus: null
    };
  },

  render() {
    const {file, children} = this.props;
    return (
      <a onClick={this.openModal}>
        {children}
        <Modal
          file={file}
          createdFile={this.state.createdFile}
          isModalOpen={this.state.isModalOpen}
          onModalHide={this.closeModal}
          isRunning={this.state.isRunning}
          onPrepareStart={this.startJob}
          progress={this.state.progress}
          progressStatus={this.state.progressStatus}
        />
      </a>
    );
  },

  startJob() {
    this.setState({
      isRunning: true,
      jobId: null,
      progress: 'Waiting for start...',
      progressStatus: null
    });
    actionCreators.runComponent({
      component: SLICED_FILES_DOWNLOADER_COMPONENT,
      notify: false,
      data: {
        configData: {
          storage: {
            input: {
              files: [
                {
                  query: `id:${this.props.file.get('id')}`
                }
              ]
            }
          }
        }
      }
    }).then(this.handleJobReceive).catch((e) => {
      this.setState({
        isRunning: false
      });
      throw e;
    });
  },

  handleJobReceive(job) {
    if (!this.isMounted()) {
      return;
    }
    if (job.isFinished) {
      if (job.status === 'success') {
        this.setState({
          isRunning: true,
          jobId: job.id,
          progress: 'Package was successfully created.',
          progressStatus: 'success'
        });
        this.fetchCreatedFile(job);
      } else {
        this.setState({
          isRunning: false,
          jobId: job.id,
          progress: 'Package create finished with an error.',
          progressStatus: 'danger'
        });
      }
    } else {
      this.setState({
        jobId: job.id,
        progress: job.state === 'waiting' ? 'Waiting for start...' : 'Creating package...'
      });
      setTimeout(this.checkJobStatus, 5000);
    }
  },

  fetchCreatedFile(job) {
    storageApi.getFiles({
      runId: job.runId
    }).then(this.handleFilesReceive).catch(() => {
      this.setState({
        isRunning: false,
        progress: 'File fetch finished with an error.',
        progressStatus: 'danger'
      });
    });
  },

  handleFilesReceive(files) {
    this.setState({
      isRunning: false,
      createdFile: fromJS(files[0])
    });
  },

  checkJobStatus() {
    if (!this.state.jobId) {
      return;
    }
    jobsApi
      .getJobDetail(this.state.jobId)
      .then(this.handleJobReceive)
      .catch((e) => {
        this.setState({
          isRunning: false
        });
        throw e;
      });
  },

  openModal() {
    this.setState({
      isModalOpen: true
    });
  },

  closeModal() {
    this.setState({
      isModalOpen: false
    });
  }

});
