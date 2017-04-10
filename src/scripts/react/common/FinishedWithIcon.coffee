React = require 'react'
moment = require 'moment'
Finished = React.createFactory(require('./common').Finished)

{span, i} = React.DOM

FinishedWithIcon = React.createClass
  displayName: 'FinishedWithIcon'
  propTypes:
    endTime: React.PropTypes.string
  render: ->
    span title: @props.endTime,
      i {className: 'fa fa-calendar'}
      ' '
      Finished
        endTime: @props.endTime


module.exports = FinishedWithIcon
