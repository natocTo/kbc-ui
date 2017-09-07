import React, {PropTypes} from 'react';
import CodeMirror from 'react-code-mirror';

/* global require */
require('./processors.less');

export default React.createClass({
  propTypes: {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  componentWillUpdate(nextProps) {
    if (this.refs.CodeMirror) {
      if (nextProps.value === '') {
        this.refs.CodeMirror.editor.setOption('lint', false);
      } else {
        this.refs.CodeMirror.editor.setOption('lint', true);
      }
    }
  },

  render() {
    var codeMirrorParams = {
      ref: 'CodeMirror',
      value: this.props.value,
      theme: 'solarized',
      lineNumbers: true,
      mode: 'application/json',
      autofocus: true,
      lineWrapping: true,
      onChange: this.handleChange,
      readOnly: this.props.disabled,
      lint: false,
      gutters: ['CodeMirror-lint-markers'],
      placeholder: JSON.stringify({before: [], after: []}, null, 2)
    };
    return (
      <div className="kbc-processor-edit">
        <div>
          <div className="edit form-group kbc-processor-editor">
            <CodeMirror {...codeMirrorParams} />
          </div>
          <div className="help-block">
            <small>
              Learn more about <a href="https://developers.keboola.com/integrate/docker-runner/processors/" target="_blank">Processors</a>
            </small>
          </div>
        </div>
      </div>
    );
  },

  handleChange(e) {
    this.props.onChange(e.target.value);
  }
});
