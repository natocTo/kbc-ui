/*
   TableSelector
 */
import React from 'react';
import TableSelector from './TableSelector';

// css
require('./TableSelectorForm.less');

export default React.createClass({

  propTypes: {
    value: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired,
    bucket: React.PropTypes.string,
    help: React.PropTypes.string,
    onEdit: React.PropTypes.func.isRequired,
    editing: React.PropTypes.bool.isRequired,
    wrapperClassName: React.PropTypes.string,
    labelClassName: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      labelClassName: 'col-xs-4',
      wrapperClassName: 'col-xs-8'
    };
  },

  render() {
    return (
      <div className="form-group">
        <div className={this.props.labelClassName + ' control-label'}>{this.props.label}</div>
        <div className={this.props.wrapperClassName}>
          <TableSelector
            value={this.props.value}
            disabled={this.props.disabled}
            onChange={this.props.onChange}
            bucket={this.props.bucket}
            help={this.props.help}
            onEdit={this.props.onEdit}
            editing={this.props.editing}
          />
        </div>
      </div>
    );
  }
});
