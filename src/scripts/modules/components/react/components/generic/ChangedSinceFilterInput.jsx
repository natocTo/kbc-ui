import React, {PropTypes} from 'react';
import ChangedSinceInput from '../../../../../react/common/ChangedSinceInput';
export default React.createClass({
  propTypes: {
    mapping: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    labelClassName: PropTypes.string,
    wrapperClassName: PropTypes.string
  },

  getDefaultProps() {
    return {
      labelClassName: 'col-xs-2',
      wrapperClassName: 'col-xs-10'
    };
  },

  render() {
    return (
      <div className="form-group form-group-sm">
        <label className={'control-label ' + this.props.labelClassName}>
          Changed in last
        </label>
        <div className={this.props.wrapperClassName}>
          <ChangedSinceInput
            value={this.getChangedSinceValue()}
            disabled={this.props.disabled}
            onChange={this.handleChangeChangedSince}
          />
        </div>
      </div>
    );
  },

  getChangedSinceValue() {
    if (!this.props.mapping.get('changed_since') && this.props.mapping.get('days') > 0) {
      return '-' + this.props.mapping.get('days') + ' days';
    }
    return this.props.mapping.get('changed_since');
  },

  handleChangeChangedSince(changedSince) {
    let value = this.props.mapping;
    if (value.has('days')) {
      value = value.delete('days');
    }
    value = value.set('changed_since', changedSince);
    this.props.onChange(value);
  }
});
