React = require 'react'
_ = require 'underscore'
#DropboxModal = React.createFactory require './DropboxModal'
{form, label, input, button, strong, div, h2, span, h4, section, p, ul, li, i} = React.DOM
Button = React.createFactory(require('react-bootstrap').Button)
{Map} = require 'immutable'
Confirm = require('../../../../../react/common/Confirm').default
TableauServerCredentialsModal = React.createFactory require './TableauServerCredentialsModal'

FormGroup = React.createFactory(require('react-bootstrap').FormGroup)
FormControlStatic = React.createFactory(require('react-bootstrap').FormControl.Static)
ControlLabel = React.createFactory(require('react-bootstrap').ControlLabel)

module.exports = React.createClass
  displayName: 'TableauServerRow'

  propTypes:
    updateLocalStateFn: React.PropTypes.func
    localState: React.PropTypes.object
    configId: React.PropTypes.string
    account: React.PropTypes.object
    setConfigDataFn: React.PropTypes.func
    renderEnableUpload: React.PropTypes.func
    resetUploadTask: React.PropTypes.func

  render: ->
    div className: 'kbc-inner-content-padding-fix with-bottom-border',
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
            'Credentials'
          FormControlStatic
            className: 'col-sm-10'
            componentClass: 'div',
              @_renderAuthorized()
              @_renderCredentialsSetup()

        if @_isAuthorized()
          FormGroup null,
            ControlLabel className: 'col-sm-2',
              'Instand upload'
            FormControlStatic
              className: 'col-sm-10'
              componentClass: 'div',
                @props.renderEnableUpload(@_accountName())

  _renderCredentialsSetup: ->
    div null,
      if !@_isAuthorized()
        @_renderAuthorizeButton('setup')
      if @_isAuthorized()
        @_renderAuthorizeButton('edit')
      if @_isAuthorized()
        React.createElement Confirm,
          title: 'Delete Credentials'
          text: "Do you really want to delete the credentials for #{@props.account.get('server_url')}"
          buttonLabel: 'Delete'
          onConfirm: =>
            @props.resetUploadTask()
        ,
          Button
            bsStyle: 'link'
          ,
            i className: 'fa fa-trash'
            ' Disconnect Destination'


  _accountName: ->
    if @props.account
      return "#{@props.account.get('username')}@#{@props.account.get('server_url')}"
    else
      return ''

  _renderAuthorized: ->
    if @_isAuthorized()
      p null,
        'Authorized for '
        strong null,
          @_accountName()
    else
      p null,
        'No Credentials.'

  _renderAuthorizeButton: (caption) ->
    Button
      bsStyle: 'success'
      onClick: =>
        @props.updateLocalStateFn(['tableauServerModal', 'show'], true)
    ,
      if caption == 'setup'
        span null,
          i className: 'fa fa-user'
          ' Setup credentials'
      else
        span null,
          i className: 'fa fa-pencil'
          ' Edit credentials'
      TableauServerCredentialsModal
        configId: @props.configId
        localState: @props.localState.get('tableauServerModal', Map())
        updateLocalState: (data) =>
          @props.updateLocalStateFn(['tableauServerModal'], data)
        credentials: @props.account
        saveCredentialsFn: (credentials) =>
          path = ['parameters', 'tableauServer']
          @props.setConfigDataFn(path, credentials)

  _isAuthorized: ->
    passwordEmpty = true
    if @props.account
      password = @props.account.get('password')
      hashPassword = @props.account.get('#password')
      passwordEmpty =  _.isEmpty(password) && _.isEmpty(hashPassword)
    @props.account and
      not _.isEmpty(@props.account.get('server_url')) and
      not _.isEmpty(@props.account.get('username')) and
      not _.isEmpty(@props.account.get('project_name')) and
      not passwordEmpty
