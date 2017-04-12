import React, {PropTypes} from 'react';
import CodeMirror from 'react-code-mirror';
import resolveHighlightMode from './resolveHighlightMode';

/* global require */
require('./queries.less');

export default React.createClass({
  propTypes: {
    queries: PropTypes.string.isRequired,
    backend: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  },

  render() {
    return (
      <div className="kbc-queries-edit">
        <div>
          <div className="edit form-group kbc-queries-editor">
            <CodeMirror
              ref="CodeMirror"
              value={this.props.queries}
              theme="solarized"
              lineNumbers={true}
              mode={resolveHighlightMode(this.props.backend, null)}
              lineWrapping={true}
              autofocus={true}
              onChange={this.handleChange}
              readOnly={this.props.disabled ? 'nocursor' : false}
              placeholder="CREATE VIEW `sample-transformed` AS SELECT `id` FROM `in.c-main.sample`;"
              />
          </div>
        </div>
      </div>
    );
  },

  handleChange(e) {
    this.props.onChange(e.target.value);
  }

});
