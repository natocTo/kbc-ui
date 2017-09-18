React = require 'react'
InlineEditTextArea = require '../../../../react/common/InlineEditArea'
ConfigurationRowEditField = require './ConfigurationRowEditField'

module.exports = React.createClass
  displayName: 'ConfiurationRowDescription'
  propTypes:
    componentId: React.PropTypes.string.isRequired
    configId: React.PropTypes.string.isRequired
    rowId: React.PropTypes.string.isRequired
    fallbackValue: React.PropTypes.string
    placeholder: React.PropTypes.string

  getDefaultProps: ->
    placeholder: 'Description'

  render: ->
    React.createElement ConfigurationRowEditField,
      componentId: @props.componentId
      configId: @props.configId
      rowId: @props.rowId
      fieldName: 'description'
      editElement: InlineEditTextArea
      placeholder: @props.placeholder
      fallbackValue: @props.fallbackValue


