import React from 'react';

import Clipboard from '../../../../react/common/Clipboard';

import {FormControls} from '../../../../react/common/KbcBootstrap';

const StaticText = FormControls.Static;

export default React.createClass({
  propTypes: {
    componentId: React.PropTypes.string.isRequired,
    configId: React.PropTypes.string.isRequired,
    credentialsTemplate: React.PropTypes.object.isRequired,
    credentials: React.PropTypes.object.isRequired
  },

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  },

  createInput(labelValue, propName, isProtected = false) {
    if (isProtected) {
      const unprotectedPropName = propName.replace('#', '');

      return (
        <StaticText
          key={propName}
          label={labelValue}
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8">
          <span className="fa fa-fw fa-lock"/>
          {
            this.props.credentials.get(unprotectedPropName) ?
              (
                <Clipboard text={this.props.credentials.get(unprotectedPropName).toString()}/>
              )
              :
              (
                null
              )
          }
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
    return this.props.credentialsTemplate.getFields(this.props.componentId).map(function(field) {
      return this.createInput(field[0], field[1], field[3]);
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

