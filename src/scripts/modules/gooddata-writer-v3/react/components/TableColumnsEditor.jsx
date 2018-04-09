import React, {PropTypes} from 'react';
import {FormControl} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    value: PropTypes.shape({
      columns: PropTypes.any
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>
              Column
            </th>
            <th>
              GoodData Title
            </th>
            <th>
              Type
            </th>
            <th>
              Content Preview
            </th>
          </tr>
        </thead>
        {this.renderBody()}
      </table>
    );
  },

  onChangeColumn(column) {
    const newColumns = this.props.value.columns.map( c => c.id === column.id ? column : c);
    this.props.onChange({columns: newColumns});
  },

  renderBody() {
    return (
      <tbody>
        {this.props.value.columns.map(column =>
          <tr>
            <td>
              {column.id}
            </td>
            <td>
              <FormControl
                type="text"
                disabled={this.props.disabled}
                onChange={e => this.onChangeColumn({...column, title: e.target.value})}
                value={column.title}
              />
            </td>
            <td>
              <FormControl
                type="text"
                disabled={this.props.disabled}
                onChange={e => this.onChangeColumn({...column, type: e.target.value})}
                value={column.type}
              />
            </td>
            <td>
              TODO
            </td>
          </tr>
        )}
      </tbody>
    );
  }
});
