React = require('react')
Link = React.createFactory(require('react-router').Link)
Immutable = require('immutable')

createStoreMixin = require '../../../../react/mixins/createStoreMixin'
ComponentsStore = require('../../../components/stores/ComponentsStore')
MySqlSandboxCredentialsStore = require('../../../provisioning/stores/MySqlSandboxCredentialsStore')
CredentialsActionCreators = require('../../../provisioning/ActionCreators')
MySqlCredentials = React.createFactory(require('../../../provisioning/react/components/MySqlCredentials'))
ConfigureSandbox = React.createFactory(require '../components/ConfigureSandbox')
ConnectToMySqlSandbox = React.createFactory(require '../components/ConnectToMySqlSandbox')
RunComponentButton = React.createFactory(require '../../../components/react/components/RunComponentButton')
DeleteButton = React.createFactory(require '../../../../react/common/DeleteButton')
Loader = React.createFactory(require '../../../../react/common/Loader')

{div, span, input, strong, form, button, h3, h4, i, button, small, ul, li, a} = React.DOM
MySqlSandbox = React.createClass

  mixins: [createStoreMixin(MySqlSandboxCredentialsStore)]

  displayName: 'MySqlSandbox'

  getStateFromStores: ->
    credentials: MySqlSandboxCredentialsStore.getCredentials()
    pendingActions: MySqlSandboxCredentialsStore.getPendingActions()
    isLoading: MySqlSandboxCredentialsStore.getIsLoading()
    isLoaded: MySqlSandboxCredentialsStore.getIsLoaded()

  _renderCredentials: ->
    if @state.credentials.get "id"
      span {},
        MySqlCredentials {credentials: @state.credentials}
    else
      if @state.pendingActions.get "create"
        React.createElement Loader
      else
        button {className: 'btn btn-success', onClick: @_createCredentials},
        'Create MySql Credentials'

  _renderControlButtons: ->
    if @state.credentials.get "id"
      sandboxConfiguration = {}
      span {},
        RunComponentButton(
          title: "Load Tables in MySQL Sandbox"
          body: ConfigureSandbox
            backend: 'mysql'
            onChange: (params) ->
              sandboxConfiguration = params
          component: 'transformation'
          method: 'create-sandbox'
          mode: 'button'
          runParams: ->
            sandboxConfiguration
        )
        ConnectToMySqlSandbox {credentials: @state.credentials},
          button {className: "btn btn-link", title: 'Connect To Sandbox', type: 'submit'},
            span {className: 'fa fa-database'}
        React.createElement DeleteButton,
          tooltip: 'Delete MySQL Sandbox'
          isPending: @state.pendingActions.get 'drop'
          confirm:
            title: 'Delete MySQL Sandbox'
            text: 'Do you really want to delete MySQL sandbox?'
            onConfirm: @_dropCredentials

  render: ->
    div {className: 'table kbc-table-border-vertical kbc-detail-table'},
      div {className: 'tr'},
        div {className: 'td'},
          div {className: 'row'},
            h4 {}, 'MySQL'
            div {className: 'pull-right'},
              @_renderControlButtons()
        div {className: 'td'},
          @_renderCredentials()

  _createCredentials: ->
    CredentialsActionCreators.createMySqlSandboxCredentials()

  _dropCredentials: ->
    CredentialsActionCreators.dropMySqlSandboxCredentials()

module.exports = MySqlSandbox
