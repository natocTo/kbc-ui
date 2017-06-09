import React, {PropTypes} from 'react';
import {Tab, Tabs} from 'react-bootstrap';

export const AUTH_KEY = 1;
export const CRAWLER_KEY = 2;
export const OPTIONS_KEY = 3;

export default React.createClass({

  propTypes: {
    localState: PropTypes.object.isRequired,
    step: PropTypes.number.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    loadCrawlers: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
    selectTab: PropTypes.func.isRequired
  },

  /* getInitialState() {
   *   return {
   *     step: AUTH_KEY
   *   };
   * },*/

  render() {
    return (
      <Tabs activeKey={this.props.step} animation={false} onSelect={this.props.selectTab} generateChildId={true}>
        <Tab title="Setup Token" eventKey={AUTH_KEY} disabled={this.isTabDisabled(AUTH_KEY)}>
          {this.renderTokenForm()}
        </Tab>
        <Tab title="Select Crawler" eventKey={CRAWLER_KEY} disabled={this.isTabDisabled(CRAWLER_KEY)}>
          {this.renderCrawlerSelector()}
        </Tab>
        <Tab title="Crawler Settings(optional)" eventKey={OPTIONS_KEY} disabled={this.isTabDisabled(OPTIONS_KEY)}>
          Crawler Settings
        </Tab>
      </Tabs>
    );
  },

  isTabDisabled(tabKey) {
    return this.props.step !== tabKey;
  },

  renderTokenForm() {
    return (
      <div className="row form-horizontal clearfix">
        {this.renderInput('Token', '#token', 'manage token', 'Enter token')}
        {this.renderInput('User ID', 'userId', 'user Id', 'Enter User ID')}
      </div>

    );
  },

  renderCrawlerSelector() {

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
