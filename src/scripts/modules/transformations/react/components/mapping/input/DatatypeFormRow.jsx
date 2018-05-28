import React from 'react';
import {Input} from './../../../../../../react/common/KbcBootstrap';
import Select from 'react-select';

export default React.createClass({

  propTypes: {
    column: React.PropTypes.object.isRequired,
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func
  },

  render: function() {
    return (
      <div className="row">
        <div className="col-xs-4">
          {this.props.column.get('name')}
        </div>
        <div className="col-xs-4">
          <Select
            name={this.props.column.get('name') + '_datatype'}
            value={this.props.column.get('type')}
            onChange={this.onChange}
          />
        </div>
        <div className="col-xs-4">
          <Input
            name={this.props.column.get('name') + '_length'}
            type="text"
            value={this.props.column.get('length')}
            onChange={this.onChange}
            disabled={this.props.disabled}
            placeholder="Length, eg. 38,0"
          />
        </div>
        <div className="col-xs-4">
          <Input
            name={this.props.column.get('name') + '_nullable'}
            type="checkbox"
            checked={this.props.column.get('convertEmptyValuesToNullValue')}
            label={
              <span>Convert empty values to <code>null</code></span>
            }
          />
        </div>
      </div>
    );
  }
});
