React = require('react')
Popover = React.createFactory(require('react-bootstrap').Popover)

{div, form, input,span, a} = React.DOM

QueryRow = React.createClass
  displayName: 'QueryRow'
  propTypes:
    onSearch: React.PropTypes.func.isRequired

  getInitialState: ->
    query: @props.query
    helpVisible: false

  _onQueryChange: (event) ->
    @setState
      query: event.target.value
  _doSearch: (event) ->
    @props.onSearch @state.query
    event.preventDefault()
  _helpClicked: (event) ->
    @setState
      helpVisible: !helpVisible
    event.preventDefault()
  render: ->
    form {onSubmit: @_doSearch},
      div {className: 'row kbc-search kbc-search-row'},
        span {className: 'kbc-icon-search'}
        input
          type: 'text'
          value: @state.query
          className: 'form-control'
          onChange: @_onQueryChange
          placeholder: 'search',
        a {target: '_blank', href: 'http://example.com', onClick: @_helpClicked}, 'Help'
        if (@state.helpVisible)
          Popover
            title: 'Help'
            div {className: 'some'},
              'XXXX'
        else

module.exports = QueryRow
