React = require 'react'
_ = require('underscore')
Immutable = require('immutable')
{Input} = require('./../../../../../react/common/KbcBootstrap')
Input = React.createFactory Input
SelectCreatable = React.createFactory(require('react-select').Creatable)

module.exports = React.createClass
  displayName: 'FileInputMappingEditor'

  propTypes:
    value: React.PropTypes.object.isRequired
    onChange: React.PropTypes.func.isRequired
    disabled: React.PropTypes.bool.isRequired

  getInitialState: ->
    showDetails: false

  _handleToggleShowDetails: (e) ->
    @setState(
      showDetails: e.target.checked
    )

  shouldComponentUpdate: (nextProps, nextState) ->
    should = @props.value != nextProps.value ||
        @props.disabled != nextProps.disabled ||
        @state.showDetails != nextState.showDetails

    should

  _handleChangeQuery: (e) ->
    value = @props.value.set("query", e.target.value)
    @props.onChange(value)

  _handleChangeTags: (newOptions) ->
    listOfValues = newOptions.map((newOption) -> newOption.value)
    parsedValues = _.filter(_.invoke(listOfValues, "trim"), (value) ->
      value != ''
    )

    if parsedValues.length == 0
      value = @props.value.set("tags", Immutable.List())
    else
      value = @props.value.set("tags", Immutable.fromJS(parsedValues))
    @props.onChange(value)

  _handleChangeProcessedTags: (newOptions) ->
    listOfValues = newOptions.map((newOption) -> newOption.value)
    parsedValues = _.filter(_.invoke(listOfValues, "trim"), (value) ->
      value != ''
    )
    if parsedValues.length == 0
      value = @props.value.set("processed_tags", Immutable.List())
    else
      value = @props.value.set("processed_tags", Immutable.fromJS(parsedValues))
    @props.onChange(value)

  _getTags: ->
    tags = @props.value.get("tags", Immutable.List()).toMap()
    newTags = tags.map (tag) ->
      {
        label: tag
        value: tag
        className: 'Select-create-option-placeholder'
      }

    newTags.toArray()

  _getProcessedTags: ->
    tags = @props.value.get("processed_tags", Immutable.List()).toMap()
    newTags = tags.map (tag) ->
      {
        label: tag
        value: tag
        className: 'Select-create-option-placeholder'
      }

    newTags.toArray()

  render: ->
    React.DOM.div {className: 'form-horizontal clearfix'},
      React.DOM.div {className: "row col-md-12"},
        React.DOM.div className: 'form-group form-group-sm',
          React.DOM.div className: 'col-xs-10 col-xs-offset-2',
            Input
              standalone: true
              type: 'checkbox'
              label: React.DOM.small {}, 'Show details'
              checked: @state.showDetails
              onChange: @_handleToggleShowDetails

      React.DOM.div {className: "row col-md-12"},
        React.DOM.div className: 'form-group',
          React.DOM.label className: 'col-xs-2 control-label', 'Tags'
          React.DOM.div className: 'col-xs-10',
            SelectCreatable
              name: 'tags'
              autofocus: true
              value: @_getTags()
              disabled: @props.disabled
              placeholder: "Add tags"
              multi: true
              onChange: @_handleChangeTags

      if @state.showDetails
        React.DOM.div {className: "row col-md-12"},
          Input
            bsSize: 'small'
            type: 'text'
            label: 'Query'
            value: @props.value.get("query")
            disabled: @props.disabled
            placeholder: "Search query"
            onChange: @_handleChangeQuery
            labelClassName: 'col-xs-2'
            wrapperClassName: 'col-xs-10'
            help: React.DOM.small
              className: "help-block"
            ,
              "Specify an Elasticsearch query to refine search"
      if @state.showDetails
        React.DOM.div {className: "row col-md-12"},
          React.DOM.div className: 'form-group form-group-sm',
            React.DOM.label className: 'col-xs-2 control-label', 'Processed Tags'
            React.DOM.div className: 'col-xs-10',
              SelectCreatable
                name: 'processed_tags'
                value: @_getProcessedTags()
                disabled: @props.disabled
                placeholder: "Add tags"
                multi: true
                onChange: @_handleChangeProcessedTags
              React.DOM.small
                className: "help-block"
              ,
                "Add these tags to files that were successfully processed"

