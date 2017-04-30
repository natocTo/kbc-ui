import { first } from 'underscore';
import React from 'react';
import Select from 'react-select';
import ConfirmButtons from '../../../react/common/ConfirmButtons';
import {Modal} from 'react-bootstrap';
import DropboxChooser from 'react-dropbox-chooser';
import { Button } from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    onHide: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
    canSaveConfig: React.PropTypes.func,
    saveConfig: React.PropTypes.func,
    cancelConfig: React.PropTypes.func,
    isSaving: React.PropTypes.bool,
    selectedInputBucket: React.PropTypes.func,
    handleCsvSelectChange: React.PropTypes.func,
    handleBucketChange: React.PropTypes.func,
    keboolaBuckets: React.PropTypes.array,
    selectedDropboxFiles: React.PropTypes.array
  },

  handleCancelFunction() {
    this.props.cancelConfig();
    this.props.onHide();
  },

  handleSaveFunction() {
    this.props.saveConfig().then(() => this.props.onHide());
  },

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Dropbox file selector</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="section well">
            <h3 className="section-heading">1.Please specify CSV files you want to upload to Keboola Storage.</h3>
            <DropboxChooser
              appKey={'2is8jmvnwbchcyr'}
              cancel={() => {}}
              success={files => this.onSelectFiles(files)}
              multiselect={false}
              extensions={['.csv']} >
              <div className="dropbox-button">
                <Button bsStyle="success">
                  <i className={Array.isArray(this.props.selectedDropboxFiles) && this.props.selectedDropboxFiles.length > 0 ? 'fa fa-fw fa-check-circle-o' : 'fa fa-fw fa-dropbox' } /> Choose from Dropbox
                </Button>
              </div>
            </DropboxChooser>
            {Array.isArray(this.props.selectedDropboxFiles) && this.props.selectedDropboxFiles.length > 0 && <div><br /><div>Selected: {first(this.props.selectedDropboxFiles).name}</div></div>}
          </div>
          <div className="section well">
            <h3 className="section-heading">2. Please specify a KBC Bucket where the files will be uploaded.</h3>
            <Select
              ref="stateSelect"
              options={this.props.keboolaBuckets}
              value={this.props.selectedInputBucket()}
              placeholder="Select a Bucket from the Keboola Storage"
              onChange={this.onSelectBucket}
              searchalble={true}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ConfirmButtons
            saveLabel="Save"
            isSaving={this.props.isSaving}
            onCancel={this.handleCancelFunction}
            onSave={this.handleSaveFunction}
            isDisabled={this.props.canSaveConfig()}
          />
        </Modal.Footer>
      </Modal>
    );
  },

  onSelectFiles(values = []) {
    this.props.handleCsvSelectChange(values);
  },

  onSelectBucket(selected) {
    this.props.handleBucketChange(selected ? selected.value : '');
  }
});
