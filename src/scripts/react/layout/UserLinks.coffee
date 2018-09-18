React = require 'react'
ImmutableRendererMixin = require 'react-immutable-render-mixin'
ApplicationStore = require '../../stores/ApplicationStore'
contactSupport = require('../../utils/contactSupport').default
ExternalLink = React.createFactory(require('@keboola/indigo-ui').ExternalLink)

{div, ul, li, a, span} = React.DOM

module.exports = React.createClass
  displayName: 'UserLinks'
  mixins: [ImmutableRendererMixin]

  _openSupportModal: (e) ->
    contactSupport(type: 'project')
    e.preventDefault()
    e.stopPropagation()

  render: ->
    div className: 'kbc-user-links',
      ul className: 'nav',
        li null,
          a
            href: ''
            onClick: @_openSupportModal
          ,
            span className: 'fa fa-comment'
            ' Support '

        li null,
          ExternalLink
            href: 'https://help.keboola.com',
            span className: 'fa fa-question-circle'
            ' Help '

        li null,
          a href: ApplicationStore.getProjectPageUrl('settings-users'),
            span className: 'fa fa-user'
            ' Users & Settings '

        li null,
          ExternalLink
            href: 'https://portal.productboard.com/ltulbdlwnurf2accjn3ukkww',
            span className: 'fa fa-tasks'
            ' Keboola Wishlist '
