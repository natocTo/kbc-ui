React = require 'react'
Modal = React.createFactory(require('react-bootstrap').Modal)
ModalHeader = React.createFactory(require('react-bootstrap').Modal.Header)
ModalTitle = React.createFactory(require('react-bootstrap').Modal.Title)
ModalBody = React.createFactory(require('react-bootstrap').Modal.Body)
ModalFooter = React.createFactory(require('react-bootstrap').Modal.Footer)
createStoreMixin = require '../../../../../react/mixins/createStoreMixin'
ButtonToolbar = React.createFactory(require('react-bootstrap').ButtonToolbar)
Button = React.createFactory(require('./../../../../../react/common/KbcBootstrap').Button)
fuzzy = require 'fuzzy'


AutoSuggestWrapperComponent = require('../../../../transformations/react/components/mapping/AutoSuggestWrapper').default
AutosuggestWrapper = React.createFactory(AutoSuggestWrapperComponent)

Loader = React.createFactory(require('kbc-react-components').Loader)
bucketsStore = require '../../../../components/stores/StorageBucketsStore'
storageActionCreators = require '../../../../components/StorageActionCreators'
analStore = require '../../../exGanalStore'
actionCreators = require '../../../exGanalActionCreators'

{span, div, p, i, form, input, label, div, a} = React.DOM

module.exports = React.createClass
  displayName: 'ExGanalOptionsModal'

  mixins: [createStoreMixin(analStore, bucketsStore)]

  propTypes:
    configId: React.PropTypes.string.isRequired
    outputBucket: React.PropTypes.string.isRequired

  getInitialState: ->
    outputBucket: @props.outputBucket
    showModal: false
    error: null

  componentDidMount: ->
    setTimeout ->
      storageActionCreators.loadBuckets()

  getStateFromStores: ->
    buckets = bucketsStore.getAll()
    buckets = buckets.filter( (bucket) ->
      bucket.get('stage') != 'sys').map( (value,key) ->
      return key)
    isLoadingBuckets: bucketsStore.getIsLoading()
    buckets: buckets
    optionsBuckets: buckets.map( (value, key) ->
      value: value
      label: value
      )
    isSavingBucket: analStore.isSavingBucket(@props.configId)

  close: ->
    @setState
      showModal: false

  open: ->
    @setState
      showModal: true

  render: ->
    helpBlock = span className: 'help-block',
      p className: 'text-danger',
        @state.error
    div null,
      @renderOpenButton()
      Modal
        show: @state.showModal
        onHide: @close
      ,
        ModalHeader closeButton: true,
          ModalTitle null,
            'Options'

        ModalBody null,
          div className: 'form-horizontal',
            div className: 'form-group',
              label className: 'control-label col-xs-2', 'Outbucket'
              div className: "col-xs-10 form-group",
                AutosuggestWrapper
                  suggestions: @_getBuckets()
                  placeholder: 'to get hint start typing'
                  value: @state.outputBucket
                  onChange: (newValue) =>
                    @_validate newValue
                    @setState
                      outputBucket: newValue
                helpBlock if @state.error

        ModalFooter null,
          ButtonToolbar null,
            Loader() if @state.isSavingBucket
            Button
              onClick: @close
              disabled: @state.isSavingBucket
              bsStyle: 'link'
            ,
              'Cancel'
            Button
              onClick: @_handleConfirm
              disabled: @state.isSavingBucket or @state.error
              bsStyle: 'success'
            ,
              'Save'


  _validate: (newValue) ->
    error = null
    if not newValue or newValue == ''
      error = 'Can not be empty.'
    else
      stage = newValue.split('.')[0]
      if stage not in ['out', 'in']
        error = "Stage must be of type 'in' or 'out'"
    @setState
      error: error

  _getBuckets: ->
    buckets = bucketsStore.getAll()
    buckets.filter( (bucket) ->
      bucket.get('stage') != 'sys').map( (value,key) ->
      return key)

  _handleConfirm: ->
    actionCreators.saveOutputBucket(@props.configId, @state.outputBucket).then  =>
      @close()

  renderOpenButton: ->
    Button
      bsStyle: 'link'
      onClick: @open
    ,
      i className: 'fa fa-fw fa-gear'
      ' Options'
