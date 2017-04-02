/*
   TableSelector
 */
import React from 'react';
import AutoSuggestWrapper from '../../modules/transformations/react/components/mapping/AutoSuggestWrapper';
require('./TableSelectorInput.less');

export default React.createClass({

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    options: React.PropTypes.object.isRequired,
    value: React.PropTypes.string.isRequired,
    bucket: React.PropTypes.string,
    help: React.PropTypes.string,
    disabled: React.PropTypes.bool.isRequired
  },

  getSuggestionsFunction() {
    const props = this.props;
    return function(input, callback) {
      var suggestions;
      suggestions = props.options.filter(function(value) {
        var searchName = value.get('name').toLowerCase();
        var searchId = value.get('id').toLowerCase();
        if (props.bucket) {
          if (value.get('id').indexOf(props.bucket + '.') !== 0) {
            return false;
          }
          searchName = searchName.substring(props.bucket.length + 1);
          searchId = searchId.substring(props.bucket.length + 1);
        }
        if (searchId.indexOf(input.toLowerCase()) >= 0) {
          return true;
        }
        if (searchName.indexOf(input.toLowerCase()) >= 0) {
          return true;
        }
        return false;
      }).sortBy(function(item) {
        return item.get('id').toLowerCase();
      }).slice(0, 10)
        .map(function(item) {
          if (props.bucket) {
            return item.get('id').substring(props.bucket.length + 1);
          } else {
            return item.get('id');
          }
        })
        .toList();
      return callback(null, suggestions.toJS());
    };
  },

  onChange(value) {
    if (this.props.bucket) {
      this.props.onChange(this.props.bucket + '.' + value);
    } else {
      this.props.onChange(value);
    }
  },

  renderBucket() {
    if (this.props.bucket) {
      return (
        <div className="input-group-addon">
          <small>{this.props.bucket}</small>.
        </div>
      );
    }
  },

  getValue() {
    if (!this.props.bucket) {
      return this.props.value;
    }
    return this.props.value.substring(this.props.bucket.length + 1);
  },

  renderHelp() {
    if (this.props.help) {
      return (<span className="help-block">{this.props.help}</span>);
    }
    return null;
  },

  render() {
    return (
      <div>
        <div className={this.props.bucket ? 'input-group' : null}>
          {this.renderBucket()}
          <AutoSuggestWrapper
            suggestions={this.getSuggestionsFunction()}
            value={this.getValue()}
            onChange={this.onChange}
            placeholder="Table name"
            id="tableSelector"
            name="tableSelector"
            disabled={this.props.disabled}
          />
        </div>
        {this.renderHelp()}
      </div>
    );
  }
});
