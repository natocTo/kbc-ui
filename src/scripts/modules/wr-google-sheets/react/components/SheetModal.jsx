import React, {PropTypes} from 'react';
import {Map} from 'immutable';
import {Modal, Tabs, Tab} from 'react-bootstrap';
import WizardButtons from './WizardButtons';
import InputTab from './InputTab';
import SpreadsheetTab from './SpreadsheetTab';
import SheetTab from './SheetTab';
import StorageTablesStore from '../../../components/stores/StorageTablesStore';

export default React.createClass({
  propTypes: {
    show: PropTypes.bool.isRequired,
    isSavingFn: PropTypes.func.isRequired,
    onHideFn: PropTypes.func,
    onSaveFn: PropTypes.func.isRequired,
    localState: PropTypes.object.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    prepareLocalState: PropTypes.func.isRequired
  },

  render() {
    const step = this.localState(['step'], 1);
    const storageTables = StorageTablesStore.getAll();

    return (
      <Modal
        bsSize="large"
        show={this.props.show}
        onHide={this.props.onHideFn}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {this.localState(['currentSheet', 'title'], false) ? 'Edit Sheet' : 'Add Sheet'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            minHeight: '250px'
          }}
        >
          <Tabs className="tabs-inside-modal" activeKey={step} defaultActiveKey={1} animation={false} id="wr-google-sheets-sheet-modal-tabs">
            <Tab title="Source" eventKey={1} disabled={step !== 1}>
              <InputTab
                onSelect={this.onChangeInputMapping}
                tables={storageTables}
                mapping={this.localState(['mapping'], Map())}
                exclude={this.localState(['exclude'], Map())}
              />
            </Tab>
            <Tab title="Destination" eventKey={2} disabled={step !== 3}>
              <SpreadsheetTab
                onSelectExisting={(data) => {
                  this.updateLocalState(['sheet'].concat('fileId'), data[0].id);
                  this.updateLocalState(['sheet'].concat('title'), data[0].name);
                }}
                onSelectFolder={(data) => {
                  this.updateLocalState(['sheet'].concat(['folder', 'id']), data[0].id);
                  this.updateLocalState(['sheet'].concat(['folder', 'title']), data[0].name);
                }}
                onChangeTitle={(e) => this.updateLocalState(['sheet'].concat('title'), e.target.value)}
                onSwitchType={this.onSwitchType}
                valueTitle={this.sheet('title', '')}
                valueFolder={this.sheet(['folder', 'title'], '/')}
                type={this.localState('uploadType', 'new')}
              />
            </Tab>
            <Tab title="Options" eventKey={3} disabled={step !== 3}>
              <SheetTab
                onChangeSheetTitle={this.onChangeSheetTitle}
                onChangeAction={(e) => this.updateLocalState(['sheet', 'action'], e.target.value)}                 valueSheetTitle={this.sheet('sheetTitle')}
                valueAction={this.sheet('action')}
              />
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <WizardButtons
            onNext={this.handleNext}
            onPrevious={this.handlePrevious}
            onSave={this.handleSave}
            onCancel={this.props.onHideFn}
            isSaving={this.props.isSavingFn(this.sheet('id'))}
            isNextDisabled={this.isStepValid(step)}
            isSaveDisabled={this.isSavingDisabled()}
            isPreviousDisabled={step === 1}
            showNext={step < 3}
            showSave={step === 3}
            savingMessage={this.localState('savingMessage')}
          />
        </Modal.Footer>
      </Modal>
    );
  },

  isStepValid(step) {
    const tableIdEmpty = !!this.sheet(['tableId']);
    const titleEmpty = !!this.sheet(['title']);
    const sheetTitleEmpty = !!this.sheet(['sheetTitle']);
    const action = !!this.sheet(['action']);

    if (step === 1) {
      return !tableIdEmpty;
    } else if (step === 2) {
      return !tableIdEmpty || !titleEmpty;
    } else if (step === 3) {
      return !tableIdEmpty || !titleEmpty || !sheetTitleEmpty || !action;
    }
  },

  isSavingDisabled() {
    const mapping = this.localState(['mapping'], Map());
    const mappingChanged = !mapping.equals(this.localState('currentMapping'));
    const sheetChanged = !this.sheet(null, Map()).equals(this.localState('currentSheet'));
    const titleEmpty = !!this.sheet(['title']);
    const sheetTitleEmpty = !!this.sheet(['sheetTitle']);
    return (!sheetChanged && !mappingChanged) || !titleEmpty || !sheetTitleEmpty;
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

  onChangeInputMapping(value) {
    const tableId = value.get('source');
    const title = tableId.substr(tableId.lastIndexOf('.') + 1);
    this.updateLocalState(['mapping'], value);
    this.updateLocalState(['sheet', 'tableId'], tableId);
    this.updateLocalState(['sheet', 'title'], title);
  },

  onChangeSheetTitle(event) {
    this.updateLocalState(['sheet', 'sheetTitle'], event.target.value);
    this.updateLocalState(['sheet', 'sheetId'], '');
  },

  onSwitchType(event) {
    const sheet = this.sheet();
    this.updateLocalState(
      'sheet',
      sheet
        .set('title', '')
        .set('fileId', '')
        .set('sheetTitle', 'Sheet1')
        .set('sheetId', ''));
    this.updateLocalState(['uploadType'], event.target.value);
  },

  updateLocalState(path, newValue) {
    return this.props.updateLocalState([].concat(path), newValue);
  },

  handleSave() {
    const sheet = this.sheet();
    const mapping = this.localState('mapping');
    this.props.onSaveFn(sheet, mapping).then(
      () => this.props.onHideFn()
    );
  },

  handleNext() {
    const step = this.localState(['step']);
    const nextStep = (step >= 3) ? 3 : step + 1;
    this.updateLocalState(['step'], nextStep);
  },

  handlePrevious() {
    const step = this.localState(['step']);
    const nextStep = (step <= 1) ? 1 : step - 1;
    this.updateLocalState(['step'], nextStep);
  },

  switchType() {
    const currentType = this.localState(['modalType']);
    let nextModalType = 'sheetInNew';
    if (currentType === 'sheetInNew') {
      nextModalType = 'sheetInExisting';
    }
    this.updateLocalState(['modalType'], nextModalType);
  }
});
