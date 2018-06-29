import React from 'react';
import _ from 'underscore';
import {Input} from './../../../../../../react/common/KbcBootstrap';
import Select from 'react-select';

export default React.createClass({

  propTypes: {
    datatype: React.PropTypes.object.isRequired,
    datatypesMap: React.PropTypes.object.isRequired,
    disabled: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  lengthEnabled() {
    const selectedType = this.props.datatypesMap.filter((datatype) => {
      return datatype.get('name') === this.props.datatype.get('type');
    });
    return selectedType.get(this.props.datatype.get('type')).get('size');
  },

  handleTypeChange(newType) {
    return this.props.onChange(this.props.datatype.set('type', newType.value));
  },

  handleLengthChange(e) {
    return this.props.onChange(this.props.datatype.set('length', e.target.value));
  },

  handleNullableChange(e) {
    if (e.target.checked) {
      return this.props.onChange(this.props.datatype.set('convertEmptyValuesToNull'), true);
    } else {
      return this.props.onChange(this.props.datatype.set('convertEmptyValuesToNull'), false);
    }
  },

  getTypeOptions() {
    return _.map(_.keys(this.props.datatypesMap.toJS()), (option) => {
      return {
        label: option,
        value: option
      };
    });
  },

  render() {
    return (
      <tr key={this.props.datatype.get('column')}>
        <td>
          <strong>{this.props.datatype.get('column')}</strong>
        </td>
        <td>
          <Select
            name={this.props.datatype.get('column') + '_datatype'}
            value={this.props.datatype.get('type')}
            options={this.getTypeOptions()}
            onChange={this.handleTypeChange}
            disabled={this.props.disabled}
            autosize={false}
          />
        </td>
        <td>
          {
            this.lengthEnabled()
              ? <Input
                name={this.props.datatype.get('column') + '_length'}
                type="text"
                value={this.props.datatype.get('length')}
                onChange={this.handleLengthChange}
                disabled={this.props.disabled || !this.lengthEnabled()}
                placeholder="Length, eg. 38,0"
              />
              : null
          }
        </td>
        <td>
          <Input
            name={this.props.datatype.get('column') + '_nullable'}
            type="checkbox"
            checked={this.props.datatype.get('convertEmptyValuesToNull')}
            onChange={this.handleNullableChange}
            label={
              <span>Convert empty values to <code>null</code></span>
            }
          />
        </td>
      </tr>
    );
  }
});
