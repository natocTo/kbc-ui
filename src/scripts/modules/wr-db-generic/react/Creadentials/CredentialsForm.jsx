import React from 'react';
import Clipboard from '../../../../react/common/Clipboard';

import {Input, FormControls} from '../../../../react/common/KbcBootstrap';
import Tooltip from '../../../../react/common/Tooltip';

const StaticText = FormControls.Static;

export default React.createClass({
  propTypes: {
    componentId: React.PropTypes.string.isRequired,
    configId: React.PropTypes.string.isRequired,
    credentialsTemplate: React.PropTypes.object.isRequired,
    credentials: React.PropTypes.object.isRequired,
    editingCredentials: React.PropTypes.object.isRequired,
    enabled: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func
  },

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  },

  handleChange(propName, event) {
    let value = event.target.value;
    if (['port'].indexOf(propName) >= 0) {
      value = parseInt(event.target.value, 10);
    }
    return this.props.onChange(this.props.credentials.set(propName, value));
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
    let savedValue = this.props.credentials.get(propName, '');

    return (
          <Input
            key={propName}
            label={this.renderProtectedLabel(labelValue, !!savedValue)}
            type="password"
            labelClassName="col-xs-4"
            wrapperClassName="col-xs-8"
            placeholder={(savedValue) ? 'type new password to change it' : ''}
            value={this.props.editingCredentials.get(propName)}
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
            labelClassName="col-xs-4"
            wrapperClassName="col-xs-8"
            value={this.props.editingCredentials.get(propName)}
            onChange={this.handleChange.bind(this, propName)}/>
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
          {this.props.editingCredentials.get(propName)}
          {(this.props.editingCredentials.get(propName)) ? <Clipboard text={this.props.editingCredentials.get(propName).toString()}/> : null}
        </StaticText>
      );
    }
  },

  renderFields() {
    return this.props.credentialsTemplate.getFields(this.props.componentId).map(function(field) {
      return this.createInput(field[0], field[1], field[2], field[3]);
    }, this);
  },

  render() {
    return (
      <form className="form-horizontal">
        <div className="kbc-inner-content-padding-fix">
          {this.renderFields()}
        </div>
      </form>
    );
  }
});

