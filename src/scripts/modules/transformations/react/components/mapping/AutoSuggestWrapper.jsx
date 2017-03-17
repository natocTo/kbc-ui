import React, {PropTypes} from 'react';
import AutoSuggest from 'react-autosuggest';
import {List} from 'immutable';

export default React.createClass({
  propTypes: {
    suggestions: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    disabled: PropTypes.bool
  },

  getDefaultProps() {
    return {
      disabled: false
    };
  },


  getInitialState() {
    return this.getStateFromProps(this.props);
  },

  getStateFromProps(props) {
    return {
      value: props.value,
      suggestions: props.suggestions
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
    this.filterSuggestions({value: this.state.value});
  },

  filterSuggestions({value}) {
    const suggestions = this.props.suggestions.filter(function(val) {
      return val.toLowerCase().indexOf(value.toLowerCase()) >= 0;
    }).sortBy(function(item) {
      return item;
    }).slice(0, 10).toList();
    this.setState({suggestions: suggestions});
  },

  renderSuggestion(suggestion) {
    return suggestion;
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
          value: this.state.value,
          className: 'form-control',
          placeholder: this.props.placeholder,
          disabled: this.props.disabled
        }}
      />);
  },

  handleChange(e, {newValue}) {
    this.setState({
      value: newValue ? newValue : ''
    });
    this.props.onChange(newValue);
  }

});
