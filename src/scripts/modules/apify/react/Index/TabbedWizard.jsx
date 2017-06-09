import React, {PropTypes} from 'react';
import {Tab, Tabs} from 'react-bootstrap';

export default React.createClass({

  propTypes: {
    localState: PropTypes.object.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    updateSettings: PropTypes.func.isRequired
  },

  render() {
    return (
      <Tabs>
        <Tab title="Setup Token">
          {this.renderTokenForm()}
        </Tab>
        <Tab title="Select Crawler">
          Select crawler
        </Tab>
        <Tab title="Crawler Settings(optional)">
          Crawler Settings
        </Tab>
      </Tabs>
    );
  },

  renderTokenForm() {
    return (
      <div className="row form-horizontal clearfix">
        {this.renderInput('Token', '#token', 'manage token', 'Enter token')}
        {this.renderInput('User ID', 'userId', 'user Id', 'Enter User ID')}
      </div>

    );
  },

  renderInputControl(propertyPath, placeholder) {
    return (
      <input
        placeholder={placeholder}
        type="text"
        value={this.setting(propertyPath)}
        onChange={(e) => this.updateSetting(propertyPath, e.target.value)}
        className="form-control"
      />
    );
  },

  setting(key) {
    return this.props.settings.get(key);
  },

  updateSetting(key, newValue) {
    this.props.updateSettings(this.props.settings.set(key, newValue));
  },

  renderInput(caption, propertyPath, helpText, placeholder, validationFn = () => null) {
    const validationText = validationFn();
    const inputControl = this.renderInputControl(propertyPath, placeholder);
    return this.renderFormControl(caption, inputControl, helpText, validationText);
  },


  renderFormControl(controlLabel, control, helpText, errorMsg) {
    return (
      <div className={errorMsg ? 'form-group has-error' : 'form-group'}>
        <label className="col-xs-2 control-label">
          {controlLabel}
        </label>
        <div className="col-xs-10">
          {control}
          <span className="help-block">
            {errorMsg || helpText}
          </span>
        </div>
      </div>
    );
  }

});
