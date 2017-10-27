React = require 'react'
_ = require('underscore')
Immutable = require('immutable')
{Input} = require('./../../../../../react/common/KbcBootstrap')
Input = React.createFactory Input
SelectCreatable = React.createFactory(require('react-select').Creatable)

module.exports = React.createClass
  displayName: 'FileOutputMappingEditor'

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

  _handleChangeSource: (e) ->
    value = @props.value.set("source", e.target.value.trim())
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

  _handleChangeIsPublic: (e) ->
    value = @props.value.set("is_public", e.target.checked)
    @props.onChange(value)

  _handleChangeIsPermanent: (e) ->
    value = @props.value.set("is_permanent", e.target.checked)
    @props.onChange(value)

  _getTags: ->
    tags = @props.value.get("tags", Immutable.List())
    newTags = tags.map (tag) ->
      {
        label: tag,
        value: tag
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
        Input
          type: 'text'
          label: 'Source'
          value: @props.value.get("source")
          disabled: @props.disabled
          placeholder: ""
          onChange: @_handleChangeSource
          labelClassName: 'col-xs-2'
          wrapperClassName: 'col-xs-10'
          autoFocus: true
          help: React.DOM.span {},
            "File will be uploaded from "
            React.DOM.code {}, "/data/out/files/" + @props.value.get("source", "")

      React.DOM.div {className: "row col-md-12"},
        React.DOM.div className: 'form-group',
          React.DOM.label className: 'col-xs-2 control-label', 'Tags'
          React.DOM.div className: 'col-xs-10',
            SelectCreatable
              name: 'tags'
              value: @_getTags()
              disabled: @props.disabled
              placeholder: "Add tags"
              multi: true
              onChange: @_handleChangeTags
            React.DOM.span
              className: "help-block"
            ,
              "File will be assigned these tags"

      if @state.showDetails
        React.DOM.div className: 'form-group form-group-sm',
          React.DOM.div className: 'col-xs-10 col-xs-offset-2',
            Input
              standalone: true
              type: 'checkbox'
              label: React.DOM.small {}, 'Is public'
              checked: @props.value.get("is_public")
              onChange: @_handleChangeIsPublic
              disabled: @props.disabled
              help: React.DOM.small {},
                "File will be public (accessible outside Keboola Connection)"

      if @state.showDetails
        React.DOM.div className: 'form-group form-group-sm',
          React.DOM.div className: 'col-xs-10 col-xs-offset-2',
            Input
              standalone: true
              type: 'checkbox'
              label: React.DOM.small {}, 'Is permanent'
              checked: @props.value.get("is_permanent")
              onChange: @_handleChangeIsPermanent
              disabled: @props.disabled
              help: React.DOM.small {},
                "File will be stored permanently (otherwise will be deleted after 180 days)"
