React = require 'react'

{div, span} = React.DOM

module.exports = React.createClass
  displayName: 'LoadingPage'

  render: ->
    div className: 'container-fluid',
      div className: 'kbc-main-content',
        div className: 'kbc-main-loader',
          span null, 'Loading ...'
