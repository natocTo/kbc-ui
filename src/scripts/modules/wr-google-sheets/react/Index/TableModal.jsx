import React, {PropTypes} from 'react';
import {Map} from 'immutable';
import ConfirmButtons from '../../../../react/common/ConfirmButtons';
// import {Modal, OverlayTrigger, Tooltip, TabbedArea, TabPane} from 'react-bootstrap';
import {Modal, Input} from 'react-bootstrap';
// import Select from '../../../../react/common/Select';
import RadioGroup from 'react-radio-group';
import SapiTableSelector from '../../../components/react/components/SapiTableSelector';
import Picker from '../../../google-utils/react/GooglePicker';
import ViewTemplates from '../../../google-utils/react/PickerViewTemplates';

const HELP_INPUT_TABLE = 'Select source table from Storage';
const HELP_SHEET_TITLE = 'Name of the sheet';
const HELP_PICKER_SPREADSHEET = 'Parent spreadsheet';
const HELP_PICKER_FOLDER = 'Parent folder';
const HELP_TITLE = 'Name of the spreadsheet';
// const HELP_SHEET_ACTION = 'Action to perform';

export default React.createClass({
  propTypes: {
    email: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    isSavingFn: PropTypes.func.isRequired,
    onHideFn: PropTypes.func,
    onSaveFn: PropTypes.func.isRequired,
    onCreateNewFn: PropTypes.func.isRequired,
    getFileFn: PropTypes.func.isRequired,
    localState: PropTypes.object.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    prepareLocalState: PropTypes.func.isRequired
  },

  render() {
    const sheetType = this.localState(['sheet', 'type']);
    return (
      <Modal
        bsSize="large"
        show={this.props.show}
        onHide={this.props.onHideFn}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.localState(['currentSheet', 'title'], false) ? 'Edit' : 'Add'} {sheetType}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-horizontal">
            {this.renderTableSelector()}
            {this.renderFields()}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ConfirmButtons
            isSaving={this.props.isSavingFn(this.sheet('id'))}
            onSave={this.handleSave}
            onCancel={this.props.onHideFn}
            placement="right"
            saveLabel="Save"
            isDisabled={this.isSavingDisabled()}
          />
        </Modal.Footer>
      </Modal>
    );
  },

  renderFields() {
    const modalType = this.localState(['modalType']);

    if (modalType === 'sheetInNew') {
      return this.renderSheetFieldsNew();
    }
    return this.renderSheetFieldsExisting();
  },

  renderSheetFieldsNew() {
    const spreadsheetTitle = this.renderInput('Spreadsheet Title', 'title', HELP_TITLE);
    const folder = this.renderFolderPicker();
    const sheetTitle = this.renderInput('Sheet Title', 'sheetTitle', HELP_SHEET_TITLE, 'My Sheet');
    const action = this.renderActionRadio();
    return (
      <div>
        {spreadsheetTitle}
        {folder}
        {sheetTitle}
        {action}
      </div>
    );
  },

  renderSheetFieldsExisting() {
    const sheetTitle = this.renderInput('Sheet Title', 'sheetTitle', HELP_SHEET_TITLE, 'My Sheet');
    const spreadsheet = this.renderSpreadsheetPicker();
    const action = this.renderActionRadio();
    return (
      <div>
        {spreadsheet}
        {sheetTitle}
        {action}
      </div>
    );
  },

  renderTableSelector() {
    const element = (
      <SapiTableSelector
        onSelectTableFn={(value) => this.updateLocalState(['sheet', 'tableId'], value)}
        placeholder="Select..."
        value={this.sheet(['tableId'], '')}
        allowCreate={false}
      />
    );
    return this.renderFormElement('Input table', element, HELP_INPUT_TABLE);
  },

  renderActionRadio() {
    const element = (
      <RadioGroup
        name="Action"
        value={this.sheet(['action'])}
        onChange={(e) => this.updateLocalState(['sheet', 'action'], e.target.value)}
      >
        <div className="form-horizontal">
          <Input
            type="radio"
            label="Update data in a Sheet"
            help="Overwrites data in existing Sheet. Creates new one if it doesn't exist"
            wrapperClassName="col-sm-8"
            value="update"
          />
          <Input
            type="radio"
            label="Create new Sheet every run"
            help="Create another Sheet in a Spreadsheet"
            wrapperClassName="col-sm-8"
            value="create"
          />
          <Input
            type="radio"
            label="Append data to a Sheet"
            help="Add new data to the end of existing Sheet"
            wrapperClassName="col-sm-8"
            value="append"
          />
        </div>
      </RadioGroup>
    );
    return this.renderFormElement('Action', element, '');
  },

  renderInput(caption, propertyPath, helpText, placeholder, validationFn = () => null) {
    const validationText = validationFn();
    const inputElement = this.renderInputElement(propertyPath, placeholder);
    return this.renderFormElement(caption, inputElement, helpText, validationText);
  },

  renderSpreadsheetPicker() {
    const parentName = this.sheet('title', '');
    const element = (
      <div>
        <Picker
          email={this.props.email}
          dialogTitle="Select Spreadsheet"
          buttonLabel={parentName ? parentName : 'Select Spreadsheet'}
          onPickedFn={(data) => {
            const parentId = data[0].id;
            const title = data[0].name;
            this.updateLocalState(['sheet'].concat('fileId'), parentId);
            this.updateLocalState(['sheet'].concat('title'), title);
          }}
          buttonProps={{
            bsStyle: 'default',
            bsSize: 'medium'
          }}
          views={[
            ViewTemplates.sheets,
            ViewTemplates.sharedSheets
          ]}
        />
      </div>
    );
    return this.renderFormElement('Spreadsheet', element, HELP_PICKER_SPREADSHEET);
  },

  renderFolderPicker() {
    const folderName = this.sheet(['folder', 'name'], '');
    const element = (
      <div>
        <Picker
          email={this.props.email}
          dialogTitle="Select Folder"
          buttonLabel={folderName ? folderName : 'Select Folder'}
          onPickedFn={(data) => {
            const parentId = data[0].id;
            const title = data[0].name;
            this.updateLocalState(['sheet'].concat(['folder', 'id']), parentId);
            this.updateLocalState(['sheet'].concat('title'), title);
          }}
          buttonProps={{
            bsStyle: 'default',
            bsSize: 'medium'
          }}
          views={[
            ViewTemplates.rootFolder,
            ViewTemplates.recentFolders
          ]}
        />
      </div>
    );
    return this.renderFormElement('Folder', element, HELP_PICKER_FOLDER);
  },

  renderInputElement(propertyPath, placeholder) {
    return (
      <input
        placeholder={placeholder}
        type="text"
        value={this.sheet(propertyPath)}
        onChange={(e) => this.updateLocalState(['sheet'].concat(propertyPath), e.target.value)}
        className="form-control"
      />
    );
  },

  renderFormElement(label, element, helpText, errorMsg) {
    return (
      <div className={errorMsg ? 'form-group has-error' : 'form-group'}>
        <label className="col-sm-2 control-label">
          {label}
        </label>
        <div className="col-sm-10">
          {element}
          <span className="help-block">
            {errorMsg || helpText}
          </span>
        </div>
      </div>
    );
  },

  isSavingDisabled() {
    const hasChanged = !this.sheet(null, Map()).equals(this.localState('currentSheet'));
    const nameEmpty = !!this.sheet(['title']);
    return !hasChanged || !nameEmpty;
  },

  localState(path, defaultVal) {
    return this.props.localState.getIn([].concat(path), defaultVal);
  },

  sheet(path, defaultValue) {
    if (path) {
      return this.localState(['sheet'].concat(path), defaultValue);
    } else {
      return this.localState(['sheet'], defaultValue);
    }
  },

  updateLocalState(path, newValue) {
    return this.props.updateLocalState([].concat(path), newValue);
  },

  handleSave() {
    this.props.onSaveFn(this.sheet()).then(
      () => this.props.onHideFn()
    );
  },

  createNewSpreadsheet() {
    this.props.onCreateNewFn().then(
      (data) => {
        const parentId = data[0].id;
        const title = data[0].name;
        this.updateLocalState(['sheet'].concat('fileId'), parentId);
        this.updateLocalState(['sheet'].concat('title'), title);
      }
    );
  }
});
