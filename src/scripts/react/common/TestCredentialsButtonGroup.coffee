React = require 'react'
classnames = require 'classnames'
Button = React.createFactory(require('react-bootstrap').Button)

Loader = React.createFactory(require('kbc-react-components').Loader)
Link = React.createFactory(require('react-router').Link)
RoutesStore = require('../../stores/RoutesStore')

{small, div, span} = React.DOM

module.exports = React.createClass
  displayName: 'TestCredentialsButtonGroup'
  propTypes:
    hasOffset: React.PropTypes.bool.isRequired
    testCredentialsFn: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool

  getDefaultProps: ->
    disabled: false
    hasOffset: true

  getInitialState: ->
    isTesting: false
    isError: false
    result: null

  _startTesting: ->
    @setState
      isTesting: true
      isError: false
      result: null

    @props.testCredentialsFn()
    .then(@_onTestingDone, @_onTestingError)

  _onTestingDone: (result) ->
    @setState
      isTesting: false
      isError: false
      result: result

  _onTestingError: (result) ->
    @setState
      isTesting: false
      isError: true
      result: result

  render: ->
    div className: 'form-group',
      div className: classnames('col-xs-4', 'col-xs-offset-4': @props.hasOffset),
        if @state.result or @state.isError
          if @state.result.status in ['success', 'ok'] and not @state.isError
            @_testSuccess @state.result
          else
            @_testError @state.result
        else
          Button
            bsStyle: 'primary'
            disabled: @state.isTesting || @props.disabled
            onClick: @_startTesting
            ,
            'Test Credentials'
        span className: null, ' '
        Link
          to: 'keboola.wr-db-snowflake'
          params:
            config: RoutesStore.getCurrentRouteParam('config')
        ,
            Button
              bsStyle: 'success'
              disabled: @state.isTesting || @props.disabled
              onClick: @_startTesting
            ,
              'Continue setup'
            ' '
        Loader() if @state.isTesting

  _testSuccess: (result) ->
    span className: 'text-success',
      span className: 'fa fa-fw fa-check'
      ' Connected! '

  _testError: (result) ->
    span className: 'text-danger',
      span className: 'fa fa-fw fa-meh-o'
      ' Failed to connect! '
      div null,
        small null,
          result?.message
          ' '
          result?.exceptionId
