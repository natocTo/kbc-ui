/*
   ChangedSinceInput
 */
import React from 'react';
import {Input} from './KbcBootstrap';
import Select from 'react-select';

export default React.createClass({

  selectOptions: [
    {
      'label': 'minutes',
      'value': 'minutes'
    },
    {
      'label': 'hours',
      'value': 'hours'
    },
    {
      'label': 'days',
      'value': 'days'
    }
  ],

  getInitialState() {
    return {
      rawInput: '',
      number: 0,
      dimension: 'days',
      display: 'selector'
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.isParsable(nextProps.value)) {
      this.setState({
        display: 'selector',
        number: this.getNumber(nextProps.value),
        dimension: this.getDimension(nextProps.dimension)
      });
    } else {
      this.setState({
        display: 'input',
        rawInput: nextProps.value
      });
    }
  },

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    disabled: React.PropTypes.bool.isRequired
  },

  onChangeRawInput(e) {
    this.setState({
      rawInput: e.target.value
    });
    this.props.onChange(e.target.value);
  },

  onChangeNumberInput(value) {
    this.setState({
      number: value
    });
    this.props.onChange(this.constructValue());
  },

  onChangeDimensionSelector() {
    this.props.onChange(this.constructValue());
  },

  constructValue() {
    if (parseInt(this.state.number, 10) === 0) {
      return '';
    }
    return '-' + this.state.number + ' ' + this.state.dimension;
  },

  isParsable(string) {
    const processed = '-' + this.getNumber(string) + ' ' + this.getDimension(string);
    if (processed === string && ['minutes', 'hours', 'days'].includes(this.getDimension(string))) {
      return true;
    }
    return false;
  },

  getNumber(string) {
    return Math.abs(parseInt(string.split(' ')[0], 10));
  },

  getDimension(string) {
    return string.split(' ')[1];
  },

  render() {
    if (this.state.display === 'selector') {
      return this.renderSelector();
    } else {
      return this.renderRawInput();
    }
  },

  renderRawInput() {
    return (
      <div>
        <span className="col-xs-4">
          <Input
            value={this.props.value}
            disabled={this.props.disabled}
            onChange={this.onChangeRawInput}
            ref="raw"
          />
        </span>
      </div>
    );
  },

  renderSelector() {
    return (
      <div>
        <span className="col-xs-2">
          <Input
            value={this.getNumber(this.props.value)}
            disabled={this.props.disabled}
            onChange={this.onChangeNumberInput}
            ref="number"
            type="number"
            placeholder="0"
          />
        </span>
        <span className="col-xs-2">
          <Select
            value={this.getDimension(this.props.value)}
            disabled={this.props.disabled}
            onChange={this.onChangeDimensionSelector}
            options={this.selectOptions}
            ref="selector"
          />
        </span>
      </div>
    );
  }

});
