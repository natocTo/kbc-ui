import React, {PropTypes} from 'react';
import {Input} from './../../react/common/KbcBootstrap';
import ApplicationStore from '../../stores/ApplicationStore';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';


export default React.createClass({
  propTypes: {
    limit: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    redirectTo: PropTypes.string
  },

  getInitialState() {
    return {
      isSaving: false,
      limitValue: this.props.limit.get('limitValue'),
      projectId: ApplicationStore.getCurrentProjectId(),
      actionUrl: ApplicationStore.getUrlTemplates().get('editProjectLimit'),
      xsrf: ApplicationStore.getXsrfToken()
    };
  },

  render() {
    const {limit, isOpen, onHide} = this.props;
    let redirectToInput = null;
    if (this.props.redirectTo) {
      redirectToInput = (
        <input
          type="hidden"
          name="redirectTo"
          value={this.props.redirectTo}
        />
      );
    }
    return (
      <Modal show={isOpen} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Limit change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            className="form-horizontal"
            ref="limitEditForm"
            method="post"
            action={this.state.actionUrl}
            >
            <p>
              You can change the limit because you are superadmin. This feature is hidden for all other users.
            </p>
            <Input
              label={limit.get('name')}
              name="limitValue"
              ref="name"
              autoFocus={true}
              value={this.state.limitValue}
              onChange={this.handleChange}
              type="number"
              help={limit.get('id')}
              labelClassName="col-sm-6"
              wrapperClassName="col-sm-4"
              />
            <input
              type="hidden"
              name="limitName"
              value={limit.get('id')}
              />
            <input
              type="hidden"
              name="projectId"
              value={this.state.projectId}
              />
            <input
              type="hidden"
              name="xsrf"
              value={this.state.xsrf}
              />
            {redirectToInput}
            </form>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button onClick={this.props.onHide} bsStyle="link">
              Cancel
            </Button>
            <Button bsStyle="primary" onClick={this.handleSave} disabled={this.state.isSaving}>
              Save Limit
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  },

  handleChange(e) {
    this.setState({
      limitValue: e.target.value
    });
  },

  handleSave() {
    this.setState({
      isSaving: true
    });
    this.refs.limitEditForm.submit();
  }

});
