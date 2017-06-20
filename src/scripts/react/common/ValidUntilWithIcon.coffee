React = require 'react'
ValidUntil = React.createFactory(require('./common').ValidUntil)
date = require '../../utils/date'

{span, i} = React.DOM

ValidUntilWithIcon = React.createClass
  displayName: 'ValidUntilWithIcon'
  propTypes:
    validUntil: React.PropTypes.string
  render: ->
    span title: date.format(@props.validUntil),
      i {className: 'fa fa-calendar'}
      ' '
      ValidUntil
        validUntil: @props.validUntil


module.exports = ValidUntilWithIcon
