import React, {PropTypes} from 'react';
import Input from './JSONConfigurationInput';
import Clipboard from '../../../../react/common/Clipboard';
import SaveButtons from '../../../../react/common/SaveButtons';

export default React.createClass({
  propTypes: {
    jsonData: PropTypes.string,
    isEditingValid: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    onEditChange: PropTypes.func.isRequired,
    onEditSubmit: PropTypes.func.isRequired,
    isChanged: PropTypes.bool.isRequired
  },

  getDefaultProps() {
    return {
      jsonData: ''
    };
  },

  render() {
    return (
      <div>
        <h2 style={{lineHeight: '32px'}}>
          JSON Configuration
          <small>
            <Clipboard text={this.props.jsonData}/>
          </small>
          {this.renderButtons()}
        </h2>
        {this.scripts()}
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
  },

  scripts() {
    return (
      <Input
        jsonData={this.props.jsonData}
        disabled={this.props.isSaving}
        onChange={this.props.onEditChange}
        />
    );
  }
});
