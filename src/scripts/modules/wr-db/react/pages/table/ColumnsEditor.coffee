React = require 'react'
{label, input, table, tr, th, tbody, thead, div, td, code} = React.DOM
Hint = require('../../../../../react/common/Hint').default

module.exports = React.createClass

  displayName: 'ColumnsEditor'
  propTypes:
    staticColumns: React.PropTypes.object
    renderRowFn: React.PropTypes.func
    editingColumns: React.PropTypes.object
    editColumnFn: React.PropTypes.func
    dataTypes: React.PropTypes.array
    isSaving: React.PropTypes.bool
    allColumns: React.PropTypes.object
    filterColumnFn: React.PropTypes.func
    onToggleHideIgnored: React.PropTypes.func
    dataPreview: React.PropTypes.array
    columnsValidation: React.PropTypes.object
    editButtons: React.PropTypes.object
    setAllColumnsType: React.PropTypes.object
    setTableTypes: React.PropTypes.object



  render: ->
    columns = @props.columns.filter( (c) =>
      if @props.editingColumns
        c = @props.editingColumns.get(c.get('name'))
      @props.filterColumnFn(c)
      )
    rows = columns.map((column) =>
      cname = column.get('name')
      editingColumn = null
      isValid = true
      if @props.editingColumns
        editingColumn = @props.editingColumns.get(cname)
        isValid = @props.columnsValidation.get(cname, true)

      @props.renderRowFn
        isValid: isValid
        isSaving: @props.isSaving
        column: column
        editingColumn: editingColumn
        dataTypes: @props.dataTypes
        editColumnFn: @props.editColumnFn
        dataPreview: @props.dataPreview
      )


    div style: {overflow: 'scroll'},
      table className: 'table table-striped kbc-table-editor',
        thead null,
          tr null,
            th null, 'Column'
            th null, 'Database Column Name'
            th null,
              'Data Type'
              div
                style: {'margin': 0}
                className: 'checkbox',
                label className: '',
                  input
                    type: 'checkbox'
                    label: 'Hide IGNORED'
                    onChange: this.props.onToggleHideIgnored
                  ' Hide Ignored'
              if @props.editingColumns
                div null,
                  @props.setTableTypes
              if @props.editingColumns
                div null,
                  @props.setAllColumnsType

            th null,
              'Null'
              ' '
              React.createElement Hint,
                title: 'Nullable Column'
              ,
                'Empty strings in the source data will be replaced with SQL '
                code null, 'NULL'
                '.'
            th null, 'Default Value'
            th null, @props.editButtons
        tbody null,
          if rows.count() > 0
            rows
          else
            tr null,
              td colSpan: "6",
                div className: 'text-center',
                  'No Columns.'
