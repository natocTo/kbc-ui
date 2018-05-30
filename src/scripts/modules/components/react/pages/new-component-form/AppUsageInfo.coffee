React = require 'react'
is3rdParty = require('../../../is3rdParty').default
ComponentBadgeBlock = React.createFactory(require('../../../../../react/common/ComponentBadgeTable').default)
require('../../components/NewComponentSelection.less')

{div, label, ul, li, p, span, strong, address, a, br, em, table, tbody, tr, td, h2} = React.DOM

module.exports = React.createClass
  displayName: 'appUsageInfo'
  propTypes:
    component: React.PropTypes.object.isRequired

  render: ->
    div {className: "kbcLicenseTable"},
      ComponentBadgeBlock
        component: @props.component
