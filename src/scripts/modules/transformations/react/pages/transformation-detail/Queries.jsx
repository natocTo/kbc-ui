import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Edit from './QueriesEdit';
import Clipboard from '../../../../../react/common/Clipboard';
import {OverlayTrigger, Popover} from 'react-bootstrap';
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
    isEditingValid: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    onEditChange: PropTypes.func.isRequired,
    onEditSubmit: PropTypes.func.isRequired,
    isChanged: PropTypes.bool.isRequired,
    highlightQueryNumber: PropTypes.number
  },

  render() {
    return (
      <div>
        <h2 style={{lineHeight: '32px'}}>
          Queries
          <small>
            <OverlayTrigger trigger="click" rootClose placement="top" overlay={this.hint()}>
              <i className="fa fa-fw fa-question-circle" />
            </OverlayTrigger>
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
          disabled={!this.props.isEditingValid}
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
        queries={this.props.queries}
        splitQueries={this.props.splitQueries}
        backend={this.props.transformation.get('backend')}
        disabled={this.props.isSaving}
        onChange={this.props.onEditChange}
        highlightQueryNumber={this.props.highlightQueryNumber}
        />
    );
  },

  hint() {
    switch (this.props.transformation.get('backend')) {
      case 'redshift':
        return (
          <Popover title="Redshift queries" className="popover-wide">
            <ul>
              <li>Comments after the last query or comments longer than 8000 characters will fail execution.</li>
              <li>Do not use plain SELECT queries as they do not modify data and may exhaust memory on the cluster or in our component; use appropriate CREATE, UPDATE, INSERT or DELETE.</li>
              <li>Redshift does not support functions or stored procedures.</li>
            </ul>
          </Popover>);
      case 'snowflake':
        return (
          <Popover title="Snowflake queries" className="popover-wide">
            <ul>
              <li>Comments after the last query or comments longer than 8000 characters will fail execution.</li>
              <li>Do not use plain SELECT queries as they do not modify data and may exhaust memory on the cluster or in our component; use appropriate CREATE, UPDATE, INSERT or DELETE.</li>
              <li>Working with timestamps? Please read the <a href="https://help.keboola.com/manipulation/transformations/snowflake/#timestamp-columns">documentation</a>.</li>
              <li>Constraints (like PRIMARY KEY or UNIQUE) are defined, but <a href="https://docs.snowflake.net/manuals/sql-reference/constraints-overview.html">not enforced</a>.</li>
            </ul>
          </Popover>);
      default:
        return (
          <Popover title="Mysql queries" className="popover-wide">
            <ul>
              <li>Comments after the last query or comments longer than 8000 characters will fail execution.</li>
              <li>Do not use plain SELECT queries as they do not modify data and may exhaust memory on the cluster or in our component; use appropriate CREATE, UPDATE, INSERT or DELETE.</li>
              <li>MySQL functions or stored procedures are not officially supported. Use at your own risk.</li>
            </ul>
          </Popover>);
    }
  }


});
