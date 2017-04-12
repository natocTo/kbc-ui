import React, {PropTypes} from 'react';
import Edit from './ScriptsEdit';
import Clipboard from '../../../../../react/common/Clipboard';
import SaveButtons from '../../../../../react/common/SaveButtons';
import {OverlayTrigger, Popover} from 'react-bootstrap';

/* global require */
require('codemirror/mode/r/r');
require('codemirror/mode/python/python');

export default React.createClass({
  propTypes: {
    bucketId: PropTypes.string.isRequired,
    transformation: PropTypes.object.isRequired,
    scripts: PropTypes.string.isRequired,
    isEditingValid: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    onEditChange: PropTypes.func.isRequired,
    onEditSubmit: PropTypes.func.isRequired,
    isChanged: PropTypes.bool.isRequired
  },

  render() {
    return (
      <div>
        <h2 style={{lineHeight: '32px'}}>
          Scripts
          <small>
            <OverlayTrigger trigger="click" rootClose placement="top" overlay={this.hint()}>
              <i className="fa fa-fw fa-question-circle"/>
            </OverlayTrigger>
            <Clipboard text={this.props.scripts}/>
          </small>
          {this.renderButtons()}
        </h2>
        {this.scripts()}
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

  scripts() {
    return (
      <Edit
        script={this.props.scripts}
        transformationType={this.props.transformation.get('type')}
        disabled={this.props.isSaving}
        onChange={this.props.onEditChange}
        />
    );
  },

  hint() {
    switch (this.props.transformation.get('type')) {
      case 'r':
        return (
          <Popover title="R" className="popover-wide">
            <ul>
              <li>Read on <a href="https://help.keboola.com/manipulation/transformations/r/">R limitations and best practices</a></li>
              <li>All source tables are stored in <code>/data/in/tables</code>
                (relative path <code>in/tables</code> , save all tables for output mapping to
                <code>/data/out/tables</code> (relative path <code>out/tables</code>)
              </li>
            </ul>
          </Popover>
        );
      case 'python':
        return (
          <Popover title="Python" className="popover-wide">
            <ul>
              <li>Read on <a href="https://help.keboola.com/manipulation/transformations/python/">Python limitations and best practices</a></li>
              <li>All source tables are stored in <code>/data/in/tables</code>
                (relative path <code>in/tables</code> , save all tables for output mapping to
                <code>/data/out/tables</code> (relative path <code>out/tables</code>)
              </li>
            </ul>
          </Popover>
        );
      case 'openrefine':
        return (
          <Popover title="OpenRefine" className="popover-wide">
            <ul>
              <li>Read on <a href="https://help.keboola.com/manipulation/transformations/openrefine/">OpenRefine limitations and best practices</a></li>
            </ul>
          </Popover>
        );
      default:
        return null;
    }
  }

});
