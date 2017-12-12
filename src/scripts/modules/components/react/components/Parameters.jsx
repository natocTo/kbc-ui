import React, {PropTypes} from 'react';
import Input from './ParametersInput';
import Clipboard from '../../../../react/common/Clipboard';
import SaveButtons from '../../../../react/common/SaveButtons';

export default React.createClass({
  propTypes: {
    value: PropTypes.string,
    isEditingValid: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    onEditChange: PropTypes.func.isRequired,
    onEditSubmit: PropTypes.func.isRequired,
    isChanged: PropTypes.bool.isRequired
  },

  getDefaultProps() {
    return {
      value: ''
    };
  },

  render() {
    return (
      <div>
        <h2 style={{lineHeight: '32px'}}>
          Parameters
          {' '}
          <small>
            <Clipboard text={this.props.value}/>
          </small>
          {this.renderButtons()}
        </h2>
        <Input
          value={this.props.value}
          disabled={this.props.isSaving}
          onChange={this.props.onEditChange}
          />
      </div>
    );
  },

  renderButtons() {
    return (
      <span className="pull-right">
        <SaveButtons
          isSaving={this.props.isSaving}
          disabled={!this.props.isEditingValid}
          isChanged={this.props.isChanged}
          onSave={this.props.onEditSubmit}
          onReset={this.props.onEditCancel}
        />
      </span>
    );
  }
});
