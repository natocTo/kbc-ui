import React from 'react';
import {Table} from 'react-bootstrap';
import {Input} from './../../../../../../react/common/KbcBootstrap';
import DatatypeFormRow from './DatatypeFormRow';

export default React.createClass({
  propTypes: {
    datatypes: React.PropTypes.object.isRequired,
    columns: React.PropTypes.array.isRequired,
    datatypesMap: React.PropTypes.object.isRequired,
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func
  },

  handleDatatypeChange(newType) {
    return this.props.onChange(this.props.datatypes.set(newType.get('column'), newType));
  },

  renderColumn(column) {
    const columnObject = this.props.datatypes.filter((type) => {
      return type.get('column') === column;
    });
    return (
      <DatatypeFormRow
        datatype={columnObject.get(column)}
        datatypesMap={this.props.datatypesMap}
        onChange={this.handleDatatypeChange}
        disabled={this.props.disabled}
      />
    );
  },

  render() {
    if (this.props.disabled) {
      return null;
    }
    const renderedColumns = this.props.columns.map((column) => {
      return this.renderColumn(column);
    });
    return (
      <Table responsive className="table table-striped">
        <thead>
          <tr>
            <th>
              Column
            </th>
            <th>
              Type
            </th>
            <th>
              Length
            </th>
            <th>
              <Input
                name="convertAll"
                type="checkbox"
                checked={false}
                onChange={this.handleNullableChange}
                label={
                  <span>Convert <strong>all</strong> empty values to <code>null</code></span>
                }
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {renderedColumns}
        </tbody>
      </Table>
    );
  }
});
