React = require 'react'
is3rdParty = require('../../../is3rdParty').default
ComponentBadgeTable = React.createFactory(require('../../../../../react/common/ComponentBadgeTable').default)
getComponentBadges = require('../../../../../react/common/componentHelpers').getComponentBadges
require('../../components/NewComponentSelection.less')

{div, label, ul, li, p, span, strong, address, a, br, em, table, tbody, tr, td, h2} = React.DOM

module.exports = React.createClass
  displayName: 'appUsageInfo'
  propTypes:
    component: React.PropTypes.object.isRequired

  render: ->
    div {className: "kbcLicenseTable"},
      ComponentBadgeTable
        badges: getComponentBadges(@props.component)
