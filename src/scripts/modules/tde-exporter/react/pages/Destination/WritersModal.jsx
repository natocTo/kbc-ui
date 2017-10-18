import React, {PropTypes} from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import {Button, Modal} from 'react-bootstrap';
import ComponentsStore from '../../../../components/stores/ComponentsStore';
import {Loader} from 'kbc-react-components';
import {OAUTH_V2_WRITERS} from '../../../tdeCommon';

export default React.createClass({

  propTypes: {
    localState: PropTypes.object.isRequired,
    setLocalState: PropTypes.func,
    onChangeWriterFn: PropTypes.func,
    initValue: PropTypes.string,
    isSaving: PropTypes.bool
  },

  getInitialState() {
    return {task: this.props.initValue || 'tableauServer'};
  },

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isSaving) {
      this.setState({task: nextProps.initValue || 'tableauServer'});
    }
  },

  render() {
    return (
      <Modal show={this.props.localState.get('show', false)} onHide={this.close}>
        <Modal.Header>
          <Modal.Title> Choose Destination Type </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderBody()}
        </Modal.Body>
        <Modal.Footer>
          {this.props.isSaving ? <Loader/> : null}
          <Button bsStyle="link" onClick={this.close}>Close</Button>
          <Button bsStyle="primary"
                  disabled={this.props.isSaving}
                  onClick={() => this.props.onChangeWriterFn(this.state.task)}>Change</Button>
        </Modal.Footer>
      </Modal>
    );
  },

  renderBody() {
    return (
      <div className="form form-horizontal">
        <FormGroup>
          <ControlLabel className="col-sm-3">
            Destination Type
          </ControlLabel>
          <div className="col-sm-9">
            <FormControl
              componentClass="select"
              value={this.state.task}
              onChange={(e) => {
                this.setState({task: e.target.value});
              }
              } >
              {this.generateOption('wr-tableau-server', 'tableauServer')}
              {OAUTH_V2_WRITERS.map(c => this.generateOption(c, c))}
            </FormControl>
          </div>
        </FormGroup>
      </div>
    );
  },

  generateOption(componentId, taskName) {
    const component = ComponentsStore.getComponent(componentId);
    return (
      <option key={taskName} value={taskName}>
        {component.get('name')}
      </option>
    );
  },

  close() {
    this.props.setLocalState('show', false);
  }

});
