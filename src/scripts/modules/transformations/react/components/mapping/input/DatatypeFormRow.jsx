import React from 'react';
import {Input} from './../../../../../../react/common/KbcBootstrap';
import Select from 'react-select';

export default React.createClass({

  propTypes: {
    datatype: React.PropTypes.object.isRequired,
    typeOptions: React.PropTypes.array.isRequired,
    disabled: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  handleTypeChange(newType) {
    return this.props.onChange(this.props.datatype.set('type', newType.value));
  },

  handleLengthChange(e) {
    return this.props.onChange(this.props.datatype.set('length', e.target.value));
  },

  handleNullableChange(e) {
    if (e.target.checked) {
      return this.props.onChange(this.props.datatype.set('convertEmptyValuesToNullValue'), true);
    } else {
      return this.props.onChange(this.props.datatype.set('convertEmptyValuesToNullValue'), false);
    }
  },

  render() {
    return (
      <div className="row" key={this.props.datatype.get('column')}>
        <div className="col-xs-2">
          <strong>{this.props.datatype.get('column')}</strong>
        </div>
        <div className="col-xs-4">
          <Select
            name={this.props.datatype.get('column') + '_datatype'}
            value={this.props.datatype.get('type')}
            options={this.props.typeOptions}
            onChange={this.handleTypeChange}
            disabled={this.props.disabled}
          />
        </div>
        <div className="col-xs-2">
          <Input
            name={this.props.datatype.get('column') + '_length'}
            type="text"
            value={this.props.datatype.get('length')}
            onChange={this.handleLengthChange}
            disabled={this.props.disabled}
            placeholder="Length, eg. 38,0"
          />
        </div>
        <div className="col-xs-4">
          <Input
            name={this.props.datatype.get('column') + '_nullable'}
            type="checkbox"
            checked={this.props.datatype.get('convertEmptyValuesToNullValue') > 0}
            onChange={this.handleNullableChange}
            label={
              <span>Convert empty values to <code>null</code></span>
            }
          />
        </div>
      </div>
    );
  }
});
