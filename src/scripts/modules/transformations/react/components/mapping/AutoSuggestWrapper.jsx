import React, {PropTypes} from 'react';
import AutoSuggest from 'react-autosuggest';
import {List} from 'immutable';

export default React.createClass({
  propTypes: {
    suggestions: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    id: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string.isRequired,
    inputClassName: PropTypes.string,
    disabled: PropTypes.bool
  },

  getDefaultProps() {
    return {
      inputClassName: 'form-control',
      disabled: false
    };
  },

  getInitialState() {
    return {
      suggestions: List()
    };
  },

  filterSuggestions(options) {
    const value = options.value;
    const suggestions = this.props.suggestions.filter(function(val) {
      return val.toLowerCase().indexOf(value.toLowerCase()) >= 0;
    }).sortBy(function(item) {
      return item;
    }).slice(0, 10).toList();
    this.setState({suggestions: suggestions});
  },

  renderSuggestion(suggestion) {
    return (<span>{suggestion}</span>);
  },

  render() {
    return (
      <AutoSuggest
        suggestions={this.state.suggestions.toJS()}
        onSuggestionsClearRequested={() => this.setState({suggestions: List()})}
        onSuggestionsFetchRequested={this.filterSuggestions}
        renderSuggestion={this.renderSuggestion}
        getSuggestionValue={(val) => val}
        inputProps={{
          onChange: this.handleChange,
          value: this.props.value,
          className: this.props.inputClassName,
          placeholder: this.props.placeholder,
          disabled: this.props.disabled
        }}
      />);
  },

  handleChange(e, options) {
    this.props.onChange(options.newValue);
  }

});
