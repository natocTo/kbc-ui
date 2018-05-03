React = require 'react'
is3rdParty = require('../../../is3rdParty').default
ComponentBadge = React.createFactory(require('../../../../../react/common/ComponentBadge').default)


{div, label, ul, li, p, span, strong, address, a, br, em, table, tbody, tr, td, h2} = React.DOM

module.exports = React.createClass
  displayName: 'appUsageInfo'
  propTypes:
    component: React.PropTypes.object.isRequired

  renderFeatures: ->
    features = []

    if (is3rdParty(@props.component))
      features.push tr {key: "3rdParty"},
        td null,
          ComponentBadge
            flag: "3rdParty"
        td null,
          "This is a 3rd party #{@getAppType()} supported by its author"

    if (@props.component.get("flags").contains("appInfo.fullAccess"))
      features.push tr {key: "fullAccess"},
        ComponentBadge
          flag: "fullAccess"
        td null,
          'This ' + @getAppType() + ' will have full access to the project including all its data.'

    if (@props.component.get("flags").contains("appInfo.fee"))
      features.push tr {key: "fee"},
        ComponentBadge
          flag: "fee"
        td null,
          'There is an extra charge to use this ' + @getAppType()

    if (@props.component.get("flags").contains("appInfo.redshiftOnly"))
      features.push tr {key: "redshift"},
        ComponentBadge
          flag: "redshiftOnly"
        td null,
          'Redshift backend is required to use this ' + @getAppType()

    if (@props.component.get("flags").contains("appInfo.dataIn"))
      features.push tr {key: "dataIn"},
        td null,
          ComponentBadge
            flag: "dataIn"
        td null,
          "This #{@getAppType()} extracts data from outside sources"

    if (@props.component.get("flags").contains("appInfo.dataOut"))
      features.push tr {key: "dataOut"},
        ComponentBadge
          flag: "dataOut"
        td null,
          "This #{@getAppType()} sends data outside of Keboola Connection"

    if (!is3rdParty(@props.component))
      features.push tr {key: "responsibility"},
        td null,
          ComponentBadge
            flag: "responsibility"
        td null,
          "Support for this #{@getAppType()} is provided by Keboola"

    if (@props.component.getIn(['vendor', 'licenseUrl']))
      features.push tr {key: "license"},
        td null,
          ComponentBadge
            flag: "responsibility"
        td null,
          'You agree to '
          a {href: @props.component.getIn(['vendor', 'licenseUrl'])},
            'vendor\'s license agreement'

    return features

  render: ->
    table {className: "kbcLicenseTable"},
      tbody null,
        @renderFeatures()


  getAppType: ->
    switch @props.component.get("type")
      when "extractor"
        "extractor"
      when "writer"
        "writer"
      when "application"
        "application"
      else
        "component"
