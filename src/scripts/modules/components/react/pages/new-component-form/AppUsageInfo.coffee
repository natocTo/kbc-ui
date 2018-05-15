React = require 'react'
is3rdParty = require('../../../is3rdParty').default
ComponentBadge = React.createFactory(require('../../../../../react/common/ComponentBadge').default)


{div, label, ul, li, p, span, strong, address, a, br, em, table, tbody, tr, td, h2} = React.DOM

module.exports = React.createClass
  displayName: 'appUsageInfo'
  propTypes:
    component: React.PropTypes.object.isRequired

  render: ->
    div {className: "kbcLicenseTable"},
      ComponentBadge
        component: @props.component
        type: 'inline'