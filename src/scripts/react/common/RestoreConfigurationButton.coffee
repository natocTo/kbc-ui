###
  Delete button with confirm and loading state
###

React = require 'react'
classnames = require 'classnames'

Tooltip = React.createFactory(require('./Tooltip').default)
Loader = React.createFactory(require('kbc-react-components').Loader)
Confirm = React.createFactory(require('./Confirm').default)

assign = require 'object-assign'

{button, span, i} = React.DOM

module.exports = React.createClass
  displayName: 'RestoreConfigurationButton'
  propTypes:
    tooltip: React.PropTypes.string
    confirm: React.PropTypes.object # Confirm props
    onRestore: React.PropTypes.func.isRequired,
    isPending: React.PropTypes.bool
    isEnabled: React.PropTypes.bool
    label: React.PropTypes.string
    fixedWidth: React.PropTypes.bool

  getDefaultProps: ->
    tooltip: 'Restore'
    isPending: false
    isEnabled: true
    label: ''
    fixedWidth: false

  render: ->
    if @props.isPending
      React.DOM.span className: 'btn btn-link',
        Loader()
    else if !@props.isEnabled
      React.DOM.span className: 'btn btn-link disabled',
        React.DOM.em className: 'fa-reply'
    else
      Confirm assign({}, buttonLabel: 'Restore', @props.confirm),
        Tooltip
          tooltip: @props.tooltip
          id: 'delete'
          placement: 'top'
        ,
          button className: 'btn btn-link',
            i className: classnames('fa', 'fa-reply', 'fa-fw': @props.fixedWidth)
            if @props.label then ' ' + @props.label
