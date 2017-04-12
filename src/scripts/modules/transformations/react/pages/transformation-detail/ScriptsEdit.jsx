import React, {PropTypes} from 'react';
import CodeMirror from 'react-code-mirror';
import resolveHighlightMode from './resolveHighlightMode';

/* global require */
require('./queries.less');

export default React.createClass({
  propTypes: {
    script: PropTypes.string.isRequired,
    transformationType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    var codeMirrorParams = {
      value: this.props.script,
      theme: 'solarized',
      lineNumbers: true,
      mode: resolveHighlightMode('docker', this.props.transformationType),
      autofocus: true,
      lineWrapping: true,
      onChange: this.handleChange,
      readOnly: this.props.disabled
    };
    if (this.props.transformationType === 'openrefine') {
      codeMirrorParams.lint = true;
      codeMirrorParams.gutters = ['CodeMirror-lint-markers'];
    }
    return (
      <div className="kbc-queries-edit">
        <div>
          <div className="edit form-group kbc-queries-editor">
            <CodeMirror {...codeMirrorParams} />
          </div>
        </div>
      </div>
    );
  },

  handleChange(e) {
    this.props.onChange(e.target.value);
  }
});
