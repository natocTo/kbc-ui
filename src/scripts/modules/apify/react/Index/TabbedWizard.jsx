import React, {PropTypes} from 'react';
import {List} from 'immutable';
import {InputGroup, FormControl, Tab, Tabs} from 'react-bootstrap';
import RadioGroup from 'react-radio-group';
import {Input} from '../../../../react/common/KbcBootstrap';
import SapiTableSelector from '../../../components/react/components/SapiTableSelector';

import Select from 'react-select';
import {RefreshIcon} from '@keboola/indigo-ui';

export const CRAWLER_KEY = 1;
export const AUTH_KEY = 2;
export const OPTIONS_KEY = 3;

import CodeMirror from 'react-code-mirror';
/* global require */
require('codemirror/addon/lint/lint');
require('../../../../utils/codemirror/json-lint');


export default React.createClass({

  propTypes: {
    localState: PropTypes.object.isRequired,
    settings: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    updateSettings: PropTypes.func.isRequired,
    crawlers: PropTypes.object.isRequired,
    inputTableId: PropTypes.string,
    updateInputTableId: PropTypes.func.isRequired,
    step: PropTypes.number.isRequired,
    updateLocalState: PropTypes.func.isRequired,
    parameters: PropTypes.object.isRequired,
    loadCrawlers: PropTypes.func.isRequired,
    updateParameters: PropTypes.func.isRequired,
    selectTab: PropTypes.func.isRequired
  },

  render() {
    return (
      <span>
        <Tabs activeKey={this.props.step} animation={false} onSelect={this.props.selectTab} id="controlled-tab-wizard" className="indigo-ui-tabs">
          <Tab title="Action"
            eventKey={CRAWLER_KEY} disabled={this.isTabDisabled(CRAWLER_KEY)}>
            {this.renderActionForm()}
          </Tab>
          {this.props.action === 'crawler' || this.props.action === 'dataset' ?
           <Tab title="Authentication" eventKey={AUTH_KEY}
             disabled={this.isTabDisabled(AUTH_KEY)}>
             {this.renderTokenForm()}
           </Tab>
           : null
          }
          <Tab title="Specification"
            eventKey={OPTIONS_KEY} disabled={this.isTabDisabled(OPTIONS_KEY)} >
            {this.props.step === OPTIONS_KEY ? this.renderOptionsContent() : null}
          </Tab>
        </Tabs>

      </span>
    );
  },

  renderOptionsContent() {
    switch (this.props.action) {
      case 'crawler':
      case 'executionId':
        return this.renderCrawlerSettingsForm();
      case 'dataset':
        return this.renderDatasetSettingsForm();
      default:
        return null;
    }
  },

  renderActionForm() {
    return (
      <RadioGroup
        name="Action"
        value={this.props.action}
        onChange={(e) => this.updateParameter('action', e.target.value)}
      >
        <Input
          type="radio"
          label="Run Crawler"
          help="Will run specified crawler or wait if it is already running, and eventually retrieve its results if it finishes succesfully"
          value="crawler"
        />
        <Input
          type="radio"
          label="Retrieve results only"
          help="Retrieve results of a crawler run specified by executionId"
          value="executionId"
        />
        <Input
          type="radio"
          label="Retrieve items from dataset"
          help="Retrieve items from specified Apify dataset"
          value="dataset"
        />
      </RadioGroup>
    );
  },

  renderDatasetSettingsForm() {
    return (
      <div className="form-horizontal">
        {this.renderInput('Dataset', 'datasetId', 'DatasetId or DatasetName of dataset you want to get items from', 'Enter dataset id or dataset name')}
      </div>
    );
  },

  renderCrawlerSettingsForm() {
    const editor = (
      <CodeMirror
        theme="solarized"
        lineNumbers={false}
        value={this.props.settings}
        readOnly={false}
        mode="application/json"
        lineWrapping={true}
        autofocus={false}
        onChange={this.handleCrawlerSettingsChange}
        lint={true}
        gutters={['CodeMirror-lint-markers']}
      />
    );
    const eidHelp = 'Execution id of a crawler run to retrieve results from';
    const executionIdControl = (
      <div className="form-horizontal">
        {this.renderInput('Execution ID', 'executionId', eidHelp, 'Enter Execution ID')}
      </div>
    );
    const action = this.props.action;
    return (
      action === 'executionId' ? executionIdControl
      :
      <div className="form-horizontal">
        {this.renderCrawlerSelector()}
        {this.renderInputTableIdSelector()}
        <div className="form-group">
          <div className="col-xs-2 control-label">
            Crawler Settings
          </div>
          <div className="col-xs-10">
            {editor}
            <div className="help-text">
              Optional <a href="https://www.apify.com/docs#crawlers" target="_blank" rel="noopener noreferrer">crawler settings</a> JSON object which overrides default crawler settings for current run.
            </div>
          </div>
        </div>
      </div>
    );
  },

  renderInputTableIdSelector() {
    const error = false;

    return (
      <div className={error ? 'form-group has-error' : 'form-group'}>
        <div className="col-xs-2 control-label">
          Input Table
        </div>
        <div className="col-xs-10">
          <SapiTableSelector
            clearable={true}
            onSelectTableFn={this.props.updateInputTableId}
            placeholder="Select table"
            value={this.props.inputTableId || ''}
          />
          <span className="help-block">
            Optional parameter. Data from input table will be pushed to crawler, where you can access them through Apify keyvalue store. Keyvalue store ID will be save to customData attribute.
          </span>
        </div>
      </div>
    );
  },

  handleCrawlerSettingsChange(e) {
    const value = e.target.value;
    this.props.updateSettings(value);
  },


  isTabDisabled(tabKey) {
    return this.props.step !== tabKey;
  },

  renderTokenForm() {
    const userHelp = <span>User ID from your <a href="https://my.apify.com/account#/integrations" target="_blank" rel="noopener noreferrer">account page</a>.</span>;
    const tokenHelp = <span>API token from your <a href="https://my.apify.com/account#/integrations" target="_blank" rel="noopener noreferrer">account page</a>.</span>;
    return (
      <div className="form-horizontal">
        {this.renderInput('User ID', 'userId', userHelp, 'Enter User ID')}
        {this.renderInput('Token', '#token', tokenHelp, 'Enter token')}
      </div>

    );
  },

  renderCrawlerSelector() {
    const crawlersData = this.props.crawlers.get('data') || List();
    const value = this.props.parameters.get('crawlerId');
    const isLoading = this.props.crawlers.get('loading', false);
    const error = this.props.crawlers.get('error');
    const refresh = (
      <span>
        {isLoading ? 'Loading list of crawlers... ' : null}
        <RefreshIcon
          isLoading={isLoading}
          onClick={this.props.loadCrawlers}/>
      </span>

    );
    const staticElement = (
      <FormControl.Static>
        {error}
        {refresh}
      </FormControl.Static>
    );
    const options = crawlersData
      .sortBy((c) => c.get('customId').toLowerCase())
      .map((c) => {
        return {value: c.get('id'), label: c.get('customId')};
      }).toArray();
    const selectControl = (
      <InputGroup>
        <Select
          placeholder="Select crawler"
          name="ids"
          key="ids"
          clearable={false}
          multi={false}
          options={options}
          value={value}
          onChange={({value: crawlerId}) =>
            this.updateParameter('crawlerId', crawlerId)}/>
        <InputGroup.Addon>{refresh}</InputGroup.Addon>
      </InputGroup>);
    return (
      <div className={error ? 'form-group has-error' : 'form-group'}>
        <div className="col-xs-2 control-label">
          Crawler
        </div>
        <div className="col-xs-10">
          {isLoading || error ? staticElement : selectControl}
        </div>
      </div>
    );
  },

  renderInputControl(propertyPath, placeholder) {
    const propValue = this.parameter(propertyPath, '');
    const isEncrypted = propValue.includes('KBC::') && propValue.includes('Encrypted');
    let value = '';
    let placeholderValue = '';
    if (isEncrypted ) {
      value = '';
      placeholderValue = 'Encrypted value, leave blank to keep it';
    } else {
      value = propValue;
      placeholderValue = placeholder;
    }
    return (
      <input
        placeholder={placeholderValue}
        type="text"
        value={value}
        onChange={(e) => this.updateParameter(propertyPath, e.target.value)}
        className="form-control"
      />
    );
  },

  parameter(key, defaultValue) {
    return this.props.parameters.get(key, defaultValue);
  },

  updateParameter(key, newValue) {
    this.props.updateParameters(this.props.parameters.set(key, newValue));
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
