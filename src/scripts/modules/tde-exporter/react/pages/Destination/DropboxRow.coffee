React = require 'react'
_ = require 'underscore'
oauthActions = require '../../../../components/OAuthActionCreators'

DropboxModal = React.createFactory require '../../../../components/react/components/DropboxAuthorizeModal'
{i, button, strong, div, h2, span, form, h4, section, p} = React.DOM
Button = React.createFactory(require('react-bootstrap').Button)
FormGroup = React.createFactory(require('react-bootstrap').FormGroup)
FormControlStatic = React.createFactory(require('react-bootstrap').FormControl.Static)
ControlLabel = React.createFactory(require('react-bootstrap').ControlLabel)
Confirm = require('../../../../../react/common/Confirm').default

module.exports = React.createClass
  displayName: 'DropboxRow'

  propTypes:
    updateLocalStateFn: React.PropTypes.func
    localState: React.PropTypes.object
    configId: React.PropTypes.string
    account: React.PropTypes.object
    renderEnableUpload: React.PropTypes.func
    resetUploadTask: React.PropTypes.func

  render: ->
    div {className: 'row'},
      form {className: 'form form-horizontal'},
        FormGroup null,
          ControlLabel className: 'col-sm-2',
            'Destination'
          FormControlStatic
            className: 'col-sm-10'
            componentClass: 'div',
              @props.renderComponent()

        FormGroup null,
          ControlLabel className: 'col-sm-2',
            'Authorization status'
          FormControlStatic
            className: 'col-sm-10'
            componentClass: 'div',
              @_renderAuthorization()
              @_renderAuthorizedInfo()

        if @_isAuthorized()
          FormGroup null,
            ControlLabel className: 'col-sm-2',
              'Instant upload'
            FormControlStatic
              className: 'col-sm-10'
              componentClass: 'div',
                @props.renderEnableUpload(@_accountName())

  _renderAuthorizedInfo: ->
    div null,
      if !@_isAuthorized()
        @_renderAuthorizeButton()
      else
        React.createElement Confirm,
          title: 'Reset Authorization'
          text: "Do you really want to reset the authorization for #{@props.account.get('description')}"
          buttonLabel: 'Reset'
          onConfirm: =>
            @props.resetUploadTask()
            #@props.setConfigDataFn(['parameters', 'dropbox'], null)
            oauthActions.deleteCredentials('wr-dropbox', @props.account.get('id'))
        ,
          Button
            bsStyle: 'link'
          ,
            span className: 'fa fa-trash'
            ' Reset Authorization'


  _accountName: ->
    @props.account?.get 'description'


  _renderAuthorization: ->
    if @_isAuthorized()
      p null,
        'Authorized for '
        strong null,
          @_accountName()
    else
      p null,
        'Not Authorized.'

  _renderAuthorizeButton: ->
    DropboxModal
      configId: @props.configId
      redirectRouterPath: 'tde-exporter-dropbox-redirect'
      credentialsId: "tde-exporter-#{@props.configId}"

  _isAuthorized: ->
    @props.account and
      @props.account.has('description') and
      @props.account.has('id')
