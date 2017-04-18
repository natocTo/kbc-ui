import React, {PropTypes} from 'react/addons';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ConfirmButtons from '../../../../react/common/ConfirmButtons';
import actionCreators from '../../ActionCreators';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    transformation: PropTypes.object.isRequired,
    bucketId: PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      isSaving: false,
      phase: this.props.transformation.get('phase'),
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
      isSaving: false,
      showModal: false
    });
  },

  render() {
    return (
      <span>
        { this.renderOpenButton() }
        <Modal onHide={this.close} show={this.state.showModal}>
          <Modal.Header closeButton={true}>
            <Modal.Title>
              Transformation Phase
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-horizontal">
              <div className="form-group">
                <div className="col-sm-offset-1 col-sm-9">
                  <p>
                    <a href="https://help.keboola.com/manipulation/transformations/#phases">Phase</a> is a set of transformations.
                  </p>
                  <p className="help-block">
                    Phases may be used to divide transformations into logical blocks, transfer data between transformations, transformation engines and remote transformations.
                  </p>
                  <p>
                    Phase # <input
                      type="number"
                      className="form-control"
                      value={parseInt(this.state.phase, 10)}
                      onChange={this.handlePhaseChange}
                      disabled={this.state.isSaving}
                      style={{width: '50px', display: 'inline-block'}}
                      />
                  </p>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <ConfirmButtons
              isSaving={this.state.isSaving}
              onCancel={this.close}
              onSave={this.handleSave}
              isDisabled={!this.isValid()}
              />
          </Modal.Footer>
        </Modal>
      </span>
    );
  },

  renderOpenButton() {
    return (
      <OverlayTrigger overlay={<Tooltip>Change Transformation Phase</Tooltip>} placement="top">
        <span onClick={this.open} className="label kbc-label-rounded-small label-default kbc-cursor-pointer">
            Phase: {this.props.transformation.get('phase')}
            {' '}
          <span className="kbc-icon-pencil"/>
        </span>
      </OverlayTrigger>
    );
  },

  handlePhaseChange(e) {
    if (e.target.value < 0) {
      return;
    }
    this.setState({
      phase: e.target.value
    });
  },

  handleSave() {
    this.setState({
      isSaving: true
    });
    actionCreators
    .changeTransformationProperty(this.props.bucketId,
      this.props.transformation.get('id'),
      'phase',
      this.state.phase
    )
    .then(() => this.close())
    .catch((e) => {
      this.setState({
        isSaving: false
      });
      throw e;
    });
  },

  isValid() {
    return this.state.phase >= 1;
  }

});
