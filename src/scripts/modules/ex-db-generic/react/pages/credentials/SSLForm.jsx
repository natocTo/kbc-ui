import React from 'react';

import Textarea from 'react-textarea-autosize';
import {Input, FormControls} from './../../../../../react/common/KbcBootstrap';

import {NewLineToBr, Check} from 'kbc-react-components';
import {HelpBlock} from 'react-bootstrap';

const helpUrl = 'https://help.keboola.com/extractors/database/sqldb/#mysql-encryption';
const StaticText = FormControls.Static;

export default React.createClass({
  displayName: 'SSLForm',
  propTypes: {
    onChange: React.PropTypes.func,
    data: React.PropTypes.object.isRequired,
    isEditing: React.PropTypes.bool.isRequired
  },

  getDefaultProps() {
    return {
      onChange: () => {}
    };
  },

  handleChange(propName, event) {
    return this.props.onChange(this.props.data.set(propName, event.target.value));
  },

  handleToggle(propName, event) {
    return this.props.onChange(this.props.data.set(propName, event.target.checked));
  },

  isEnabled() {
    return this.props.data.get('enabled');
  },

  renderEnableCheckbox(propName) {
    if (this.props.isEditing) {
      return (
        <Input
          disabled={!this.props.isEditing}
          type="checkbox"
          label={<span>Enable encrypted (SSL) connection {this.renderHelp()}</span>}
          wrapperClassName="col-xs-8 col-xs-offset-4"
          checked={this.isEnabled()}
          onChange={this.handleToggle.bind(this, propName)}
        />
      );
    } else {
      return (
        <StaticText
          label={<span>Encrypted connection (SSL) <small>{this.renderHelp()}</small></span>}
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8">
          <Check isChecked={this.isEnabled()} />
        </StaticText>
      );
    }
  },

  createStaticControl(labelValue, propName) {
    return (
      <StaticText
        label={labelValue}
        labelClassName="col-xs-4"
        wrapperClassName="col-xs-8">
        {this.isEnabled() ? <NewLineToBr text={this.props.data.get(propName)}/> : ''}
      </StaticText>
    );
  },

  createInput(labelValue, propName, help = null) {
    if (this.props.isEditing) {
      return (
        <div>
          <div className="form-group">
            <label className="control-label col-xs-4">
              {labelValue}
            </label>
            <div className="col-xs-8">
              <Textarea
                label={labelValue}
                type="textarea"
                value={this.props.data.get(propName)}
                onChange={this.handleChange.bind(this, propName)}
                className="form-control"
                minRows={4}
              />
              {help && <HelpBlock>{help}</HelpBlock>}
            </div>
          </div>
        </div>
      );
    } else {
      return this.createStaticControl(labelValue, propName);
    }
  },

  render() {
    return (
      <div>
        {this.renderEnableCheckbox('enabled')}
        {this.isEnabled() ?
          <div>
            {this.createInput('SSL Client Certificate (client-cert.pem)', 'cert')}
            {this.createInput('SSL Client Key (client-key.pem)', 'key')}
            {this.createInput('SSL CA Certificate (ca-cert.pem)', 'ca')}
            {this.createInput(
              'SSL Cipher',
              'cipher',
              'You can optionally provide a list of permissible ciphers to use for the SSL encryption.')}
          </div>
          : null
        }
      </div>
    );
  },

  renderHelp() {
    return (
      <span>
        <a href={helpUrl} target="_blank">
          Help
        </a>
      </span>
    );
  }
});
