import React, {PropTypes} from 'react';
import { Modal, Button, OverlayTrigger, Tooltip} from './../../../../react/common/KbcBootstrap';
import ConfirmButtons from '../../../../react/common/ConfirmButtons';
import OutputMappingRowEditor from '../components/mapping/OutputMappingRowEditor';
import resolveOutputShowDetails from './resolveOutputShowDetails';
import validateStorageTableId from '../../../../utils/validateStorageTableId';
import Immutable from 'immutable';

const MODE_CREATE = 'create', MODE_EDIT = 'edit';

export default React.createClass({
  propTypes: {
    mode: PropTypes.oneOf([MODE_CREATE, MODE_EDIT]).isRequired,
    mapping: PropTypes.object.isRequired,
    tables: PropTypes.object.isRequired,
    buckets: PropTypes.object.isRequired,
    backend: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    definition: PropTypes.object
  },

  getDefaultProps() {
    return {
      definition: Immutable.Map()
    };
  },

  isValid() {
    return !!this.props.mapping.get('source') &&
      !!this.props.mapping.get('destination') &&
      validateStorageTableId(this.props.mapping.get('destination', ''));
  },

  getInitialState() {
    return {
      isSaving: false,
      showModal: false
    };
  },

  open() {
    this.setState({
      showModal: true
    });
  },

  close() {
    this.setState({
      showModal: false
    });
  },

  render() {
    let title = 'Output Mapping';
    if (this.props.definition.get('label')) {
      title = this.props.definition.get('label');
    }
    return (
      <span>
        { this.renderOpenButton() }
        <Modal
          onHide={this.close}
          show={this.state.showModal}
          bsSize="large"
          >
          <Modal.Header closeButton={true}>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <OutputMappingRowEditor
              fill={true}
              value={this.props.mapping}
              tables={this.props.tables}
              buckets={this.props.buckets}
              onChange={this.props.onChange}
              disabled={this.state.isSaving}
              backend={this.props.backend}
              type={this.props.type}
              initialShowDetails={resolveOutputShowDetails(this.props.mapping)}
              definition={this.props.definition}
              />
          </Modal.Body>
          <Modal.Footer>
            <ConfirmButtons
              saveLabel={this.props.mode === MODE_CREATE ? 'Create' : 'Save'}
              isSaving={this.state.isSaving}
              onCancel={this.handleCancel}
              onSave={this.handleSave}
              isDisabled={!this.isValid()}
              />
          </Modal.Footer>
        </Modal>
      </span>
    );
  },

  renderOpenButton() {
    if (this.props.mode === MODE_EDIT) {
      return (
        <OverlayTrigger overlay={<Tooltip>Edit Output</Tooltip>} placement="top">
          <Button bsStyle="link" onClick={this.handleOpenButtonLink}>
            <span className="fa fa-pencil" />
          </Button>
        </OverlayTrigger>
      );
    } else {
      return (
        <Button bsStyle="primary" onClick={this.open}>
          <i className="fa fa-plus" /> Add Output
        </Button>
      );
    }
  },

  handleOpenButtonLink(e) {
    e.preventDefault();
    e.stopPropagation();
    this.open();
  },

  handleCancel() {
    this.props.onCancel();
    this.close();
  },

  handleSave() {
    this.setState({
      isSaving: true
    });
    this.props
      .onSave()
      .then(() => {
        this.setState({
          isSaving: false
        });
        this.close();
      })
      .catch((e) => {
        this.setState({
          isSaving: false
        });
        throw e;
      });
  }

});
