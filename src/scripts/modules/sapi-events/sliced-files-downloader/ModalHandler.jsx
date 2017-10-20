import React from 'react';
import Modal from './Modal';
import { filesize } from '../../../utils/utils';
import jobsApi from '../../jobs/JobsApi';
import actionCreators from '../../components/InstalledComponentsActionCreators';

const SLICED_FILES_DOWNLOADER_COMPONENT = 'keboola.sliced-files-downloader';

export default React.createClass({
  propTypes: {
    file: React.PropTypes.object
  },

  getInitialState() {
    return {
      isModalOpen: false,
      isRunning: false,
      jobId: null,
      progress: null,
      progressStatus: null,
      isCreated: false
    };
  },

  render() {
    const {file} = this.props;
    return (
      <a onClick={this.openModal}>
        {file.get('name')} ({filesize(file.get('sizeBytes'))})
        <Modal
          file={file}
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
          isRunning: false,
          progress: 'Package was successfully loaded.',
          progressStatus: 'success',
          jobId: null,
          isCreated: true
        });
      } else {
        this.setState({
          isRunning: false,
          progress: 'Package create finished with an error.',
          progressStatus: 'danger',
          jobId: job.id,
          isCreated: true
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
