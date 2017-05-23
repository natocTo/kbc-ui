import React, {PropTypes} from 'react';
import {Input} from '../../../../react/common/KbcBootstrap';
import RadioGroup from 'react-radio-group';
import Picker from '../../../google-utils/react/GooglePicker';
import ViewTemplates from '../../../google-utils/react/PickerViewTemplates';

export default React.createClass({
  propTypes: {
    onSelectExisting: PropTypes.func.isRequired,
    onSelectFolder: PropTypes.func.isRequired,
    onChangeTitle: PropTypes.func.isRequired,
    onToggleConvert: PropTypes.func.isRequired,
    onSwitchType: PropTypes.func.isRequired,
    valueTitle: PropTypes.string.isRequired,
    valueFolder: PropTypes.string.isRequired,
    valueAction: PropTypes.oneOf(['create', 'update']),
    valueConvert: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(['new', 'existing'])
  },

  render() {
    const radio = (this.props.valueAction === 'create') ? null : this.renderTypeRadio();
    const picker = (this.props.type === 'new') ? this.renderFolderPicker() : this.renderFilePicker();
    const convertCheckbox = (this.props.type === 'new') ? this.renderConvertCheckbox() : null;
    return (
      <div className="form-horizontal">
        {radio}
        {picker}
        {convertCheckbox}
      </div>
    );
  },

  renderTypeRadio() {
    return (
      <div className="row">
        <div className="form-group">
          <label className="col-md-2 control-label">
            File exists?
          </label>
          <div className="col-md-10">
            <RadioGroup
              name="type"
              value={this.props.type}
              onChange={this.props.onSwitchType}
            >
              <Input
                type="radio"
                label="No"
                help="Create a new File, that will be updated on each run"
                wrapperClassName="col-sm-8"
                value="new"
              />
              <Input
                type="radio"
                label="Yes"
                help="Use existing File"
                wrapperClassName="col-sm-8"
                value="existing"
              />
            </RadioGroup>
          </div>
        </div>
      </div>
    );
  },

  renderFilePicker() {
    return (
      <div className="row">
        <div className="form-group">
          <label className="col-md-2 control-label">
            File location
          </label>
          <div className="col-md-10">
            <Picker
              dialogTitle="Select File"
              buttonLabel={this.props.valueTitle ? this.props.valueTitle : 'Select File'}
              onPickedFn={this.props.onSelectExisting}
              buttonProps={{
                bsStyle: 'default',
                bsSize: 'large'
              }}
              views={[
                ViewTemplates.files,
                ViewTemplates.sharedFiles,
                ViewTemplates.starredFiles
              ]}
              multiselectEnabled={false}
            />
            <span className="help-block">
              Choose File you wish to update
            </span>
          </div>
        </div>
      </div>
    );
  },

  renderFolderPicker() {
    return (
      <div className="row">
        <div className="form-group">
          <label className="col-md-2 control-label">
            File location
          </label>
          <div className="col-md-10">
            <div className="input-group">
              <div className="input-group-btn">
                <Picker
                  dialogTitle="Select Folder"
                  buttonLabel={this.props.valueFolder}
                  onPickedFn={this.props.onSelectFolder}
                  buttonProps={{
                    bsStyle: 'default',
                    bsSize: 'large'
                  }}
                  views={[
                    ViewTemplates.rootFolder,
                    ViewTemplates.sharedFolders,
                    ViewTemplates.starredFolders
                  ]}
                  multiselectEnabled={false}
                />
              </div>
              <input
                placeholder="New File"
                type="text"
                value={this.props.valueTitle ? this.props.valueTitle : ''}
                onChange={this.props.onChangeTitle}
                className="form-control"
              />
            </div>
            <span className="help-block">
              Select Files parent <strong>folder</strong> and enter <strong>title</strong> of the File.<br/>
              {this.props.valueAction === 'create' ? 'The File will be created on next run. Current date and time will be appended to Files name.' : 'The File will be created upon save.'}
            </span>
          </div>
        </div>
      </div>
    );
  },

  renderConvertCheckbox() {
    return (
      <div className="row">
        <div className="form-group">
          <label className="col-md-2 control-label">
            Format
          </label>
          <div className="col-md-10">
            <Input
              type="checkbox"
              checked={this.props.valueConvert}
              onChange={this.props.onToggleConvert}
              label="Convert to Google Docs format"
              help="After upload, file will be converted so it can be edited directly in Google Drive"
            />
          </div>
        </div>
      </div>
    );
  }
});