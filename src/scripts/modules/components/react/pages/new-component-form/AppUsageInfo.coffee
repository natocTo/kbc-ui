React = require 'react'
is3rdParty = require('../../../is3rdParty').default
ComponentOverviewBadges = React.createFactory(require('../../../../../react/common/ComponentOverviewBadges').default)


{div, label, ul, li, p, span, strong, address, a, br, em, table, tbody, tr, td, h2} = React.DOM

module.exports = React.createClass
  displayName: 'appUsageInfo'
  propTypes:
    component: React.PropTypes.object.isRequired

  render: ->
    table {className: "kbcLicenseTable"},
      tbody null,
        ComponentOverviewBadges
          component: @props.component
          type: "inline"

