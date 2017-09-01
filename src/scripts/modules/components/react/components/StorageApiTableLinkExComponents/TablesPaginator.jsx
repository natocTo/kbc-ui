import React, {PropTypes} from 'react';

export default React.createClass({

  propTypes: {
    tables: PropTypes.array.isRequired,
    currentTable: PropTypes.string.isRequired,
    onChangeTable: PropTypes.func.isRequired
  },

  render() {
    const {tables} = this.props;
    const position = tables.indexOf(this.props.currentTable);
    const nextTable = position + 1 < tables.length ? tables[position + 1] : null;
    const previousTable = position - 1 >= 0 ? tables[position - 1] : null;
    return (
      <span>
        {previousTable &&
         <span className="btn btn-link pull-left" role="button"
           onClick={() => this.props.onChangeTable(previousTable)}>
           {'<<'} {previousTable}
         </span>
        }

        {nextTable &&
         <span className="btn btn-link pull-right" role="button"
           onClick={() => this.props.onChangeTable(nextTable)}>
           {nextTable} {'>>'}
         </span>
        }
      </span>
    );
  }
});
