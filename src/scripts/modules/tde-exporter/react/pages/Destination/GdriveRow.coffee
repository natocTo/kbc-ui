React = require 'react'
_ = require 'underscore'
GdriveModal = React.createFactory require './AuthorizeGdriveModal'
{i, form, button, strong, div, h2, span, h4, section, p} = React.DOM
Button = React.createFactory(require('react-bootstrap').Button)
{Map} = require 'immutable'
Picker = require('../../../../google-utils/react/GooglePicker').default
ViewTemplates = require('../../../../google-utils/react/PickerViewTemplates').default

FormGroup = React.createFactory(require('react-bootstrap').FormGroup)
FormControlStatic = React.createFactory(require('react-bootstrap').FormControl.Static)
ControlLabel = React.createFactory(require('react-bootstrap').ControlLabel)

Confirm = require('../../../../../react/common/Confirm').default

module.exports = React.createClass
  displayName: 'GdriveRow'

  propTypes:
    updateLocalStateFn: React.PropTypes.func
    localState: React.PropTypes.object
    configId: React.PropTypes.string
    account: React.PropTypes.object
    saveTargetFolderFn: React.PropTypes.func
    renderEnableUpload: React.PropTypes.func
    resetUploadTask: React.PropTypes.func

  render: ->
    div {className: 'kbc-inner-content-padding-fix with-bottom-border'},
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
    return div null,
      if !@_isAuthorized()
        div null,
          @_renderAuthorizeButton()
      if @_isAuthorized()
        div null,
          @_renderPicker()
      if @_isAuthorized()
        div null,
          React.createElement Confirm,
            title: 'Reset Authorization'
            text: "Do you really want to reset the authorization for #{@props.account.get('email')}"
            buttonLabel: 'Reset'
            onConfirm: =>
              @props.resetUploadTask()
          ,
            Button
              bsStyle: 'link'
            ,
              span className: 'fa fa-trash'
              ' Reset Authorization'

  _accountName: ->
    @props.account?.get 'email'

  _renderAuthorization: ->
    if @_isAuthorized()
      div null,
        p null,
          'Authorized for '
          strong null,
            @_accountName()
        p null,
          'Folder: '
          strong null,
            @props.account.get('targetFolderName') || '/'
    else
      p null,
        'Not Authorized.'

  _renderAuthorizeButton: ->
    div null,
      Button
        bsStyle: 'success'
        onClick: =>
          @props.updateLocalStateFn(['gdrivemodal', 'show'], true)
      ,
        i className: 'fa fa-google'
        ' Authorize'
      GdriveModal
        configId: @props.configId
        localState: @props.localState.get('gdrivemodal', Map())
        updateLocalState: (data) =>
          @props.updateLocalStateFn(['gdrivemodal'], data)

  _renderPicker: ->
    file = @props.account
    folderId = file.get 'targetFolder'
    folderName = file.get('targetFolderName')

    React.createElement Picker,
      email: @props.account.get 'email'
      dialogTitle: 'Select a folder'
      buttonLabel: span null,
        span className: 'fa fa-fw fa-folder-o'
        ' Select a folder'
      onPickedFn: (data) =>
        data = _.filter data, (file) ->
          file.type == 'folder'
        folderId = data[0].id
        folderName = data[0].name
        data[0].title = folderName
        @props.saveTargetFolderFn(folderId, folderName)
      buttonProps:
        bsStyle: 'link'
      views: [
        ViewTemplates.rootFolder
        ViewTemplates.sharedFolders
        ViewTemplates.starredFolders
        ViewTemplates.recent
      ]


  _isAuthorized: ->
    @props.account and
      not _.isEmpty(@props.account.get('accessToken')) and
      not _.isEmpty(@props.account.get('refreshToken')) and
      not _.isEmpty(@props.account.get('email'))
