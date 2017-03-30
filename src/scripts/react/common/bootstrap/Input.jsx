import React from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Checkbox, Radio } from 'react-bootstrap';
import classNames from 'classnames';

const inputTypes = {
  TYPE_CHECKBOX: 'checkbox',
  TYPE_RADIO: 'radio',
  TYPE_SELECT: 'select',
  TYPE_TEXTAREA: 'textarea'
};

export default React.createClass({

  propTypes: {
    children: React.PropTypes.any,
    type: React.PropTypes.string,
    id: React.PropTypes.string,
    label: React.PropTypes.object,
    help: React.PropTypes.object,
    disabled: React.PropTypes.bool,
    labelClassName: React.PropTypes.string,
    bsSize: React.PropTypes.oneOf(['sm', 'small', 'lg', 'large']),
    wrapperClassName: React.PropTypes.string
  },

  render() {
    switch (this.props.type) {
      // checkbox
      case inputTypes.TYPE_CHECKBOX:
        return (
          <FormGroup bsSize={this.props.bsSize}>
            <div className={this.props.wrapperClassName} key="wrapper">
              <Checkbox {...this.props}>
                {this.props.children}
                {this.props.label}
              </Checkbox>
              {this.props.help && <HelpBlock>{this.props.help}</HelpBlock>}
            </div>
          </FormGroup>
        );
      // radio
      case inputTypes.TYPE_RADIO:
        return (
          <FormGroup bsSize={this.props.bsSize}>
            <div className={this.props.wrapperClassName} key="wrapper">
              <Radio {...this.props}>
                {this.props.children}
                {this.props.label}
              </Radio>
              {this.props.help && <HelpBlock>{this.props.help}</HelpBlock>}
            </div>
          </FormGroup>
        );
      // input, textarea, select
      default:
        return (
          <FormGroup bsSize={this.props.bsSize}>
            {this.renderLabel()}

            <div className={this.props.wrapperClassName} key="wrapper">
              <FormControl
                {...this.props}
                componentClass={this.getComponentClass()}
              >
                {this.props.children}
              </FormControl>
              {this.props.help && <HelpBlock>{this.props.help}</HelpBlock>}
            </div>
          </FormGroup>
        );
    }
  },

  renderLabel() {
    return this.props.label ? (
      <ControlLabel className={classNames(this.props.labelClassName)}>
        {this.props.label}
      </ControlLabel>
    ) : null;
  },

  getComponentClass() {
    switch (this.props.type) {
      case inputTypes.TYPE_SELECT:
        return 'select';
      case inputTypes.TYPE_TEXTAREA:
        return 'textarea';
      default:
        return 'input';
    }
  }

});
