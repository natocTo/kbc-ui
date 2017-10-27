import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Edit from './QueriesEdit';
import Clipboard from '../../../../../react/common/Clipboard';
import SaveButtons from '../../../../../react/common/SaveButtons';

/* global require */
require('codemirror/mode/sql/sql');
require('./queries.less');

export default React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    bucketId: PropTypes.string.isRequired,
    transformation: PropTypes.object.isRequired,
    queries: PropTypes.string.isRequired,
    splitQueries: PropTypes.object.isRequired,
    isSaving: PropTypes.bool.isRequired,
    isQueriesProcessing: PropTypes.bool.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    onEditChange: PropTypes.func.isRequired,
    onEditSubmit: PropTypes.func.isRequired,
    isChanged: PropTypes.bool.isRequired,
    highlightQueryNumber: PropTypes.number
  },

  getQueries() {
    if (this.props.isChanged === false && this.props.queries === '') {
      const comment = '-- This is a sample query. ' +
        '\n-- Adjust accordingly to your input mapping, output mapping ' +
        '\n-- and desired functionality.\n\n';
      if (this.props.transformation.get('backend') === 'mysql') {
        return comment + 'CREATE VIEW `out_table` AS SELECT * FROM `in_table`;';
      }
      if (this.props.transformation.get('backend') === 'redshift') {
        return comment + 'CREATE TABLE "out_table" AS SELECT * FROM "in_table";';
      }
      return comment + 'CREATE TABLE "out_table" AS SELECT * FROM "in_table";';
    }
    return this.props.queries;
  },

  render() {
    return (
      <div>
        <h2 style={{lineHeight: '32px'}}>
          Queries
          <small>
            <Clipboard text={this.props.queries}/>
          </small>
          {this.renderButtons()}
        </h2>

        {this.queries()}
      </div>
    );
  },

  renderButtons() {
    return (
      <span className="pull-right">
        <SaveButtons
          isSaving={this.props.isSaving}
          disabled={this.props.isQueriesProcessing}
          isChanged={this.props.isChanged}
          onSave={this.props.onEditSubmit}
          onReset={this.props.onEditCancel}
            />
      </span>
    );
  },

  queries() {
    return (
      <Edit
        queries={this.getQueries()}
        splitQueries={this.props.splitQueries}
        backend={this.props.transformation.get('backend')}
        disabled={this.props.isSaving}
        onChange={this.props.onEditChange}
        highlightQueryNumber={this.props.highlightQueryNumber}
        />
    );
  }
});
