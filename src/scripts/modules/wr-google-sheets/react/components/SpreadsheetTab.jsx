import React, {PropTypes} from 'react';
import {Input} from 'react-bootstrap';
import RadioGroup from 'react-radio-group';
import Picker from '../../../google-utils/react/GooglePicker';
import ViewTemplates from '../../../google-utils/react/PickerViewTemplates';

export default React.createClass({
  propTypes: {
    onSelectExisting: PropTypes.func.isRequired,
    onSelectFolder: PropTypes.func.isRequired,
    onChangeTitle: PropTypes.func.isRequired,
    onSwitchType: PropTypes.func.isRequired,
    valueTitle: PropTypes.string.isRequired,
    valueFolder: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['new', 'existing']),
    show: PropTypes.bool.isRequired
  },

  render() {
    const spreadsheet = (this.props.type === 'new') ? this.renderFolderPicker() : this.renderSpreadsheetPicker();
    return (
      <div className="form-horizontal">
      {this.renderTypeRadio()}
      {spreadsheet}
      </div>
    );
  },

  renderTypeRadio() {
    return (
      <div className="row">
        <div className="form-group">
          <label className="col-md-2 control-label">
            Upload data to
          </label>
          <div className="col-md-10">
            <RadioGroup
              name="type"
              value={this.props.type}
              onChange={this.props.onSwitchType}
            >
              <Input
                type="radio"
                label="New spreadsheet"
                help="Create new Google Spreadsheet"
                wrapperClassName="col-sm-8"
                value="new"
              />
              <Input
                type="radio"
                label="Existing spreadsheet"
                help="Add new sheet to existing Google Spreadsheet"
                wrapperClassName="col-sm-8"
                value="existing"
              />
            </RadioGroup>
          </div>
        </div>
      </div>
    );
  },

  renderSpreadsheetPicker() {
    return (
      <div className="row">
        <div className="form-group">
          <label className="col-md-2 control-label">
            Spreadsheet
          </label>
          <div className="col-md-10">
            <Picker
              dialogTitle="Select Spreadsheet"
              buttonLabel={this.props.valueTitle ? this.props.valueTitle : 'Select spreadsheet'}
              onPickedFn={this.props.onSelectExisting}
              buttonProps={{
                bsStyle: 'default',
                bsSize: 'large'
              }}
              views={[
                ViewTemplates.sheets,
                ViewTemplates.sharedSheets
              ]}
            />
            <span className="help-block">
              Choose spreadsheet, in which you want to upload the data
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
            Spreadsheet
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
                    ViewTemplates.recentFolders
                  ]}
                />
              </div>
              <input
                placeholder="New Spreadsheet"
                type="text"
                value={this.props.valueTitle ? this.props.valueTitle : ''}
                onChange={this.props.onChangeTitle}
                className="form-control"
              />
            </div>
            <span className="help-block">
              Select spreadsheets parent <strong>folder</strong> and enter spreadsheets <strong>title</strong>.<br/>The spreadsheet will be created upon save.
            </span>
          </div>
        </div>
      </div>
    );
  }

});