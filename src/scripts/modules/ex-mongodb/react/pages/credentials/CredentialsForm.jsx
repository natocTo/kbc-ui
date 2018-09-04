import React from 'react';
import {Map} from 'immutable';
import Clipboard from '../../../../../react/common/Clipboard';

import TestCredentialsButtonGroup from '../../../../../react/common/TestCredentialsButtonGroup';
import {Input, FormControls} from './../../../../../react/common/KbcBootstrap';
import Tooltip from '../../../../../react/common/Tooltip';
import SshTunnelRow from '../../../../../react/common/SshTunnelRow';


const StaticText = FormControls.Static;

export default React.createClass({
  propTypes: {
    savedCredentials: React.PropTypes.object.isRequired,
    credentials: React.PropTypes.object.isRequired,
    isEditing: React.PropTypes.bool.isRequired,
    isValidEditingCredentials: React.PropTypes.bool.isRequired,
    enabled: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func,
    componentId: React.PropTypes.string.isRequired,
    configId: React.PropTypes.string.isRequired,
    credentialsTemplate: React.PropTypes.object.isRequired,
    actionCreators: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {
      onChange: () => null
    };
  },


  testCredentials() {
    return this.props.actionCreators.testCredentials(this.props.configId, this.props.credentials);
  },

  handleChange(propName, event) {
    let value = event.target.value;
    if (['port'].indexOf(propName) >= 0) {
      value = parseInt(event.target.value, 10);
    }
    return this.props.onChange(this.props.credentials.set(propName, value));
  },

  handleCheckboxChange(propName, e) {
    return this.props.onChange(this.props.credentials.set(propName, e.target.checked));
  },

  renderProtectedLabel(labelValue, alreadyEncrypted) {
    let msg = labelValue + 'will be stored securely encrypted.';
    if (alreadyEncrypted) {
      msg = msg + ' The most recently stored value will be used if left empty.';
    }
    return (
      <span>
        {labelValue}
        <small>
          <Tooltip tooltip={msg}>
            <span className="fa fa-fw fa-question-circle"/>
          </Tooltip>
        </small>
      </span>
    );
  },

  createProtectedInput(labelValue, propName) {
    let savedValue = this.props.savedCredentials.get(propName);
    return (
          <Input
            key={propName}
            label={this.renderProtectedLabel(labelValue, !!savedValue)}
            type="password"
            labelClassName="col-xs-4"
            wrapperClassName="col-xs-8"
            placeholder={(savedValue) ? 'type new password to change it' : ''}
            value={this.props.credentials.get(propName)}
            onChange={this.handleChange.bind(this, propName)}/>
    );
  },

  createInput(labelValue, propName, type = 'text', isProtected = false) {
    if (this.props.enabled) {
      if (isProtected) {
        return this.createProtectedInput(labelValue, propName);
      } else {
        return (
          <Input
            key={propName}
            label={labelValue}
            type={type}
            labelClassName={(type === 'checkbox') ? '' : 'col-xs-4'}
            wrapperClassName={(type === 'checkbox') ? 'col-xs-8 col-xs-offset-4' : 'col-xs-8'}
            value={this.props.credentials.get(propName)}
            checked={(type === 'checkbox') ? this.props.credentials.get(propName) : false}
            onChange={
              (type === 'checkbox') ?
                this.handleCheckboxChange.bind(this, propName) :
                this.handleChange.bind(this, propName)
            }
          />
        );
      }
    } else if (isProtected) {
      return (
        <StaticText
          key={propName}
          label={labelValue}
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8">
          <Tooltip tooltip="Encrypted password">
            <span className="fa fa-fw fa-lock"/>
          </Tooltip>
        </StaticText>
      );
    } else {
      return (
        <StaticText
          key={propName}
          label={labelValue}
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8">
          {this.props.credentials.get(propName)}
          {(this.props.credentials.get(propName)) ? <Clipboard text={this.props.credentials.get(propName).toString()}/> : null}
        </StaticText>
      );
    }
  },

  renderFields() {
    return this.props.credentialsTemplate.getFields().map(function(field) {
      return this.createInput(field.label, field.name, field.type, field.protected);
    }, this);
  },

  sshRowOnChange(sshObject) {
    return this.props.onChange(this.props.credentials.set('ssh', sshObject));
  },

  render() {
    const { componentId, configId, enabled, isValidEditingCredentials, isEditing } = this.props;
    return (
      <form className="form-horizontal">
        <div className="kbc-inner-padding">
          {this.renderFields()}
          <SshTunnelRow
            isEditing={this.props.enabled}
            data={this.props.credentials.get('ssh', Map())}
            onChange={this.sshRowOnChange}
            disabledCheckbox={false}
          />
          <TestCredentialsButtonGroup
            componentId={componentId}
            configId={configId}
            isEditing={isEditing}
            disabled={enabled ? !isValidEditingCredentials : false}
            testCredentialsFn={this.testCredentials}
          />
        </div>
      </form>
    );
  }
});

