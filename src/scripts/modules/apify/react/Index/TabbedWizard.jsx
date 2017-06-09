import React, {PropTypes} from 'react';
import {List} from 'immutable';
import {FormControl, Tab, Tabs} from 'react-bootstrap';
import Select from 'react-select';
// import {Loader} from 'kbc-react-components';
import {RefreshIcon} from 'kbc-react-components';
export const AUTH_KEY = 1;
export const CRAWLER_KEY = 2;
export const OPTIONS_KEY = 3;

export default React.createClass({

  propTypes: {
    localState: PropTypes.object.isRequired,
    crawlers: PropTypes.object.isRequired,
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
          {this.renderCrawlersForm()}
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
        {this.renderInput('User ID', 'userId', 'user Id', 'Enter User ID')}
        {this.renderInput('Token', '#token', 'manage token', 'Enter token')}
      </div>

    );
  },

  renderCrawlersForm() {
    return (
      <div className="row form-horizontal clearfix">
        {this.renderCrawlerSelector()}
      </div>
    );
  },

  renderCrawlerSelector() {
    const crawlersData = this.props.crawlers.get('data') || List();
    const value = this.props.settings.get('crawlerId');
    const isLoading = this.props.crawlers.get('loading');
    const error = this.props.crawlers.get('error');
    const refresh = (
      <RefreshIcon
        isLoading={isLoading}
        onClick={this.props.loadCrawlers}/>

    );
    const staticElement = (
      <FormControl.Static>
        {isLoading ? refresh
         : error}
      </FormControl.Static>
    );
    const options = crawlersData.map((c) => {
      return {value: c.get('id'), label: c.get('customId')};
    }).toArray();
    const selectControl = (
      <span>
        <Select
          name="ids"
          key="ids"
          clearable={false}
          multi={false}
          options={options}
          value={value}
          onChange={({value: crawlerId}) => this.updateSetting('crawlerId', crawlerId)}/>
        {refresh}
      </span>);
    return (
      <div className={error ? 'form-group has-error' : 'form-group'}>
        <label className="col-xs-2 control-label">
          User Crawlers
        </label>
        <div className="col-xs-8">
          {isLoading || error ? staticElement : selectControl}
        </div>
      </div>
    );
  },


  // this.renderFormControl('User Crawlers', isLoading || error ? staticElement : selectControl, '', !!error);


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
