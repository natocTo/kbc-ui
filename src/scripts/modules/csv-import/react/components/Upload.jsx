import React, {PropTypes} from 'react';
import immutableMixin from '../../../../react/mixins/ImmutableRendererMixin';
import {ProgressBar} from 'react-bootstrap';
import {Loader} from 'kbc-react-components';

// css
require('./Upload.less');

export default React.createClass({
  mixins: [immutableMixin],

  propTypes: {
    onStartUpload: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    isValid: PropTypes.bool.isRequired,
    isFileTooBig: PropTypes.bool.isRequired,
    isFileInvalidFormat: PropTypes.bool.isRequired,
    isUploading: PropTypes.bool.isRequired,
    uploadingMessage: PropTypes.string.isRequired,
    uploadingProgress: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  onChange(e) {
    this.props.onChange(e.target.files[0]);
  },

  uploadStatus() {
    if (!this.props.isUploading) {
      return null;
    }
    return (
      <div className="form-group">
        <div className="col-xs-8 col-xs-offset-4">
          <p className="form-control-static">
            {this.props.uploadingMessage}
            <ProgressBar
              active
              now={this.props.uploadingProgress}
            />
          </p>
        </div>
      </div>
    );
  },

  fileInputHelp() {
    if (this.props.isFileInvalidFormat) {
      return (
        <div className="help-block">
          <small>
            Only <code>.csv</code>, <code>.tsv</code> and <code>.gz</code> (gzipped CSV or TSV) files are supported.
          </small>
        </div>
      );
    }
    if (this.props.isFileTooBig) {
      return (
        <div className="help-block">
          <small>Upload time limit is 10 minutes. The CSV file is larger than 100MB, your upload may not be successful.
            Please refer to <a
              href="http://docs.keboola.apiary.io/#reference/tables/create-table-asynchronously/create-new-table-from-csv-file">documentation</a>
            to perform a manual upload and import.
          </small>
        </div>
      );
    }
    return null;
  },

  uploadButtonCaption() {
    if (this.props.isUploading) {
      return (<Loader />);
    }
    return 'Upload';
  },

  render() {
    return (
      <div className="form-horizontal">
        <div className="form-group">
          <label className="control-label col-xs-4">
            <span>Select file</span>
          </label>
          <div className="col-xs-8">
            <span className="pull-right upload-button">
              <button
                className="btn btn-success"
                title="Upload"
                onClick={this.props.onStartUpload}
                disabled={!this.props.isValid || this.props.disabled || this.props.isUploading}
              >
                {this.uploadButtonCaption()}
              </button>
            </span>
            <input
              className="form-control-static"
              type="file"
              label="Select file"
              onChange={this.onChange}
              disabled={this.props.isUploading}
            />
            {this.fileInputHelp()}
          </div>
        </div>
        {this.uploadStatus()}
      </div>
    );
  }
});
