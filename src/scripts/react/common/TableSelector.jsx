/*
   TableSelector
 */
import React from 'react';
import Immutable from 'immutable';
import TableLink from '../../modules/components/react/components/StorageApiTableLinkEx';
import TableSelectorInput from './TableSelectorInput';
import StorageTablesStore from '../../modules/components/stores/StorageTablesStore';
import Tooltip from './Tooltip';

// css
require('./TableSelector.less');

export default React.createClass({

  propTypes: {
    value: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired,
    bucket: React.PropTypes.string,
    help: React.PropTypes.string,
    onEdit: React.PropTypes.func.isRequired,
    editing: React.PropTypes.bool.isRequired
  },

  getDefaultProps() {
    return {
      value: '',
      disabled: false
    };
  },

  getInitialState() {
    return {
      tables: StorageTablesStore.getAll().map(function(table) {
        return Immutable.fromJS({
          id: table.get('id'),
          name: table.get('id')
        });
      }).toList()
    };
  },

  onChange(value) {
    this.props.onChange(value);
  },

  renderPencil() {
    if (this.props.disabled) {
      return null;
    }
    return (
      <Tooltip tooltip="Edit" placement="top">
        <span className="kbc-icon-pencil"
          onClick={this.props.onEdit}
        />
      </Tooltip>
    );
  },

  render() {
    if (this.props.editing) {
      return (
        <span className="kbc-table-selector kbc-table-selector-edit">
          <TableSelectorInput
            options={this.state.tables}
            onChange={this.onChange}
            value={this.props.value}
            bucket={this.props.bucket}
            help={this.props.help}
            disabled={this.props.disabled}
          />

        </span>
      );
    } else {
      return (
        <span className="kbc-table-selector kbc-table-selector-static">
          <TableLink tableId={this.props.value}>
            {this.props.value}
          </TableLink>
          {this.renderPencil()}
          <span className="help-block">{this.props.help}</span>
        </span>
      );
    }
  }
});
