import React, { PropTypes } from 'react';
import storageApi from '../../../components/StorageApi';
import { fromJS } from 'immutable';
import ColumnDataPreview from './ColumnDataPreview';
import classnames from 'classnames';

export default React.createClass({
  propTypes: {
    value: PropTypes.shape({
      matchColumnKey: PropTypes.string,
      tableId: PropTypes.string,
      columns: PropTypes.any,
      columnsMappings: PropTypes.any,
      context: PropTypes.any,
      getInitialShowAdvanced: PropTypes.func,
      isColumnValidFn: PropTypes.func
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  componentDidMount() {
    if (this.props.value.tableId) this.fetchData();
  },

  getInitialState() {
    return {
      loadingPreview: false,
      dataPreview: null,
      dataPreviewError: null,
      showAdvanced: this.props.value.getInitialShowAdvanced(this.props.value.columns)
    };
  },

  fetchData() {
    this.setState({
      loadingPreview: true
    });
    return storageApi
      .tableDataPreview(this.props.value.tableId, { limit: 10 })
      .then(csv => {
        this.setState({
          loadingPreview: false,
          dataPreview: fromJS(csv)
        });
      })
      .catch(error => {
        let dataPreviewError = null;
        if (error.response && error.response.body) {
          if (error.response.body.code === 'storage.maxNumberOfColumnsExceed') {
            dataPreviewError = 'Data sample cannot be displayed. Too many columns.';
          } else {
            dataPreviewError = error.response.body.message;
          }
        } else {
          throw new Error(JSON.stringify(error));
        }
        this.setState({
          loadingPreview: false,
          dataPreview: null,
          dataPreviewError: dataPreviewError
        });
      });
  },

  renderHeaderCell(Element) {
    if (!Element) {
      return null;
    }
    return (
      <Element
        showAdvanced={this.state.showAdvanced}
        onChangeShowAdvanced={(newValue) => this.setState({showAdvanced: newValue})} />
    );
  },

  render() {
    let headers = this.props.value.columnsMappings.map(mapping => mapping.title);
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Column</th>
            {headers.map((title, index) => <th key={index}>{typeof title === 'string' ? title : this.renderHeaderCell(title)}</th>)}
            <th>Content Preview</th>
          </tr>
        </thead>
        {this.renderBody()}
      </table>
    );
  },

  onChangeColumn(newValue) {
    const {matchColumnKey} = this.props.value;
    const newColumns = this.props.value.columns.map(column => (column[matchColumnKey] === newValue[matchColumnKey] ? newValue : column));
    this.props.onChange({ columns: newColumns });
  },

  renderBody() {
    const {matchColumnKey} = this.props.value;
    return (
      <tbody>
        {this.props.value.columns.map((column, index) => (
          <tr key={index} className={classnames({danger: !this.props.value.isColumnValidFn(column)})}>
            <td>{column[matchColumnKey]}</td>
            {this.props.value.columnsMappings.map((Mapping, mappingIndex) => (
              <td key={mappingIndex}>
                <Mapping.render
                  context={this.props.value.context}
                  disabled={this.props.disabled}
                  showAdvanced={this.state.showAdvanced}
                  column={column} onChange={this.onChangeColumn} />
              </td>
            ))}
            <td>
              <ColumnDataPreview
                columnName={column[matchColumnKey]}
                tableData={this.state.dataPreview}
                error={this.state.dataPreviewError}
              />
            </td>
          </tr>
        ))}
      </tbody>
    );
  }
});
