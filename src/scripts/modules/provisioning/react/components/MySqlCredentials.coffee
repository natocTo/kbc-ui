React = require 'react'

Protected = React.createFactory(require('kbc-react-components').Protected)
Clipboard = React.createFactory(require('../../../../react/common/Clipboard').default)
Loader = React.createFactory(require('kbc-react-components').Loader)
ValidUntilWithIcon = React.createFactory(require('../../../../react/common/ValidUntilWithIcon'))
Extend = React.createFactory(require('./ExtendMySqlCredentials'))
{span, div, strong, small, a, p} = React.DOM


MySqlCredentials = React.createClass
  displayName: 'MySqlCredentials'
  propTypes:
    credentials: React.PropTypes.object
    validUntil: React.PropTypes.string
    isCreating: React.PropTypes.bool
    hideClipboard: React.PropTypes.bool

  getDefaultProps: ->
    hideClipboard: false

  render: ->
    div {},
      if @props.isCreating
        span {},
          Loader()
          ' Creating sandbox'
      else
        if @props.credentials.get "id"
          @_renderCredentials()

        else
          'Sandbox not running'

  _renderCredentials: ->
    div {},
      p className: 'small',
        'Use these credentials to connect to the sandbox with your \
        favourite SQL client (we like '
        a {href: 'http://www.sequelpro.com/download', target: '_blank'},
          'Sequel Pro'
        '). You can also use the Adminer web application provided by Keboola (click on Connect).'
      p className: 'small',
        'If not used, the sandbox will be deleted after 14 days.'

      div {className: 'row'},
        span {className: 'col-md-3'}, 'Host'
        strong {className: 'col-md-9'},
          @props.credentials.get "hostname"
          @_renderClipboard Clipboard text: @props.credentials.get "hostname"
      div {className: 'row'},
        span {className: 'col-md-3'}, 'Port'
        strong {className: 'col-md-9'},
          '3306'
          @_renderClipboard Clipboard text: '3306'
      div {className: 'row'},
        span {className: 'col-md-3'}, 'User'
        strong {className: 'col-md-9'},
          @props.credentials.get "user"
          @_renderClipboard Clipboard text: @props.credentials.get "user"
      div {className: 'row'},
        span {className: 'col-md-3'}, 'Password'
        strong {className: 'col-md-9'},
          Protected {},
            @props.credentials.get "password"
          @_renderClipboard Clipboard text: @props.credentials.get "password"
      div {className: 'row'},
        span {className: 'col-md-3'}, 'Database'
        strong {className: 'col-md-9'},
          @props.credentials.get "db"
          @_renderClipboard Clipboard text: @props.credentials.get "db"
      div {className: 'row'},
        span {className: 'col-md-3'}, 'Expires'
        strong {className: 'col-md-9'},
          ValidUntilWithIcon validUntil: @props.validUntil

  _renderClipboard: (cpElement) ->
    if not @props.hideClipboard
      return cpElement
    else
      return null

module.exports = MySqlCredentials
