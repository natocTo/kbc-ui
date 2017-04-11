import React, {PropTypes} from 'react';
import {Map} from 'immutable';
import {Modal, TabbedArea, TabPane} from 'react-bootstrap';
import WizardButtons from '../../../components/react/components/WizardButtons';
import InputTab from './InputTab';
import FileTab from './FileTab';
import ActionTab from './ActionTab';
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
            {this.localState(['cleanFile', 'title'], false) ? 'Edit File' : 'Add File'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TabbedArea activeKey={step} defaultActiveEventKey={1} animation={false}>
            <TabPane tab="Source" eventKey={1} disabled={step !== 1}>
              <InputTab
                mapping={this.localState(['mapping'], Map())}
                tables={storageTables}
                onChange={this.onChangeInputMapping}
                exclude={this.localState(['exclude'], Map())}
                disabled={this.props.isSavingFn(this.file('id'))}
              />
            </TabPane>
            <TabPane tab="Action" eventKey={2} disabled={step !== 3}>
              <ActionTab
                onChangeAction={(e) => this.onChangeAction(e.target.value)}
                valueAction={this.file('action')}
              />
            </TabPane>
            <TabPane tab="Destination" eventKey={3} disabled={step !== 3}>
              <FileTab
                onSelectExisting={(data) => {
                  this.updateLocalState(['file'].concat('fileId'), data[0].id);
                  this.updateLocalState(['file'].concat('title'), data[0].name);
                }}
                onSelectFolder={(data) => {
                  this.updateLocalState(['file'].concat(['folder', 'id']), data[0].id);
                  this.updateLocalState(['file'].concat(['folder', 'title']), data[0].name);
                }}
                onChangeTitle={(e) => this.updateLocalState(['file'].concat('title'), e.target.value)}
                onSwitchType={this.onSwitchType}
                valueTitle={this.file('title', '')}
                valueFolder={this.file(['folder', 'title'], '/')}
                type={this.localState('uploadType', 'new')}
                action={this.file('action')}
              />
            </TabPane>
          </TabbedArea>
        </Modal.Body>
        <Modal.Footer>
          <WizardButtons
            onNext={this.handleNext}
            onPrevious={this.handlePrevious}
            onSave={this.handleSave}
            onCancel={this.props.onHideFn}
            isSaving={this.props.isSavingFn(this.file('id'))}
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
    const tableIdEmpty = !!this.file(['tableId']);
    const action = !!this.file(['action']);

    if (step === 1) {
      return !tableIdEmpty;
    }
    if (step === 2) {
      return !tableIdEmpty || !action;
    }
    return false;
  },

  isSavingDisabled() {
    const mapping = this.localState(['mapping'], Map());
    const mappingChanged = !mapping.equals(this.localState('cleanMapping'));
    const fileChanged = !this.file(null, Map()).equals(this.localState('cleanFile'));
    return (!fileChanged && !mappingChanged);
  },

  localState(path, defaultVal) {
    return this.props.localState.getIn([].concat(path), defaultVal);
  },

  file(path, defaultValue) {
    if (path) {
      return this.localState(['file'].concat(path), defaultValue);
    }
    return this.localState(['file'], defaultValue);
  },

  onChangeInputMapping(value) {
    const tableId = value.get('source');
    const title = tableId.substr(tableId.lastIndexOf('.') + 1);
    this.updateLocalState(['mapping'], value);
    this.updateLocalState(['file', 'tableId'], tableId);
    this.updateLocalState(['file', 'title'], title);
  },

  onChangeAction(value) {
    this.updateLocalState(['file', 'action'], value);
    // if action == 'create' uploadType is always 'new'
    if (value === 'create') {
      this.updateLocalState(['uploadType'], 'new');
    }
  },

  onSwitchType(event) {
    this.updateLocalState(
      'file',
      this.file()
        .set('title', '')
        .set('fileId', '')
    );
    this.updateLocalState(['uploadType'], event.target.value);
  },

  updateLocalState(path, newValue) {
    return this.props.updateLocalState([].concat(path), newValue);
  },

  handleSave() {
    const file = this.file();
    const mapping = this.localState('mapping');
    this.props.onSaveFn(file, mapping).then(
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
