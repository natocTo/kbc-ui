/*
   ChangedSinceInput
 */
import React from 'react';
import Select from 'react-select';

export default React.createClass({

  selectOptions: [
    {
      'label': '10 minutes',
      'value': '-10 minutes'
    },
    {
      'label': '15 minutes',
      'value': '-15 minutes'
    },
    {
      'label': '30 minutes',
      'value': '-30 minutes'
    },
    {
      'label': '45 minutes',
      'value': '-45 minutes'
    },
    {
      'label': '1 hour',
      'value': '-1 hours'
    },
    {
      'label': '2 hours',
      'value': '-2 hours'
    },
    {
      'label': '4 hours',
      'value': '-4 hours'
    },
    {
      'label': '6 hours',
      'value': '-6 hours'
    },
    {
      'label': '12 hours',
      'value': '-12 hours'
    },
    {
      'label': '18 hours',
      'value': '-18 hours'
    },
    {
      'label': '1 day',
      'value': '-1 days'
    },
    {
      'label': '2 days',
      'value': '-2 days'
    },
    {
      'label': '3 days',
      'value': '-3 days'
    },
    {
      'label': '7 days',
      'value': '-7 days'
    },
    {
      'label': '15 days',
      'value': '-15 days'
    },
    {
      'label': '30 days',
      'value': '-30 days'
    }
  ],

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
    disabled: React.PropTypes.bool.isRequired
  },

  getSelectOptions() {
    const props = this.props;
    let selectOptions = this.selectOptions;
    if (this.props.value && selectOptions.filter(function(item) {
      return item.value === props.value;
    }).length === 0) {
      selectOptions.push({
        label: this.props.value.replace('-', ''),
        value: this.props.value
      });
    }
    return selectOptions;
  },

  onChange(value) {
    if (!value) {
      this.props.onChange(null);
    } else {
      this.props.onChange(value.value);
    }
  },

  render() {
    return (
      <div>
        <Select
          placeholder="Select period..."
          value={this.props.value}
          disabled={this.props.disabled}
          onChange={this.onChange}
          options={this.getSelectOptions()}
        />
      </div>
    );
  }
});
