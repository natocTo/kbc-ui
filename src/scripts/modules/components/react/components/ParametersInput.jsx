import React, {PropTypes} from 'react';
import CodeMirror from 'react-code-mirror';

/* global require */
require('./ParametersInput.less');

export default React.createClass({
  propTypes: {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    var codeMirrorParams = {
      value: this.props.value,
      theme: 'solarized',
      lineNumbers: true,
      mode: 'application/json',
      autofocus: true,
      lineWrapping: true,
      onChange: this.handleChange,
      readOnly: this.props.disabled,
      lint: true,
      gutters: ['CodeMirror-lint-markers'],
      placeholder: 'Your JSON config goes here...'

    };
    return (
      <div className="kbc-json-edit">
        <div>
          <div className="edit form-group kbc-json-editor">
            <CodeMirror {...codeMirrorParams} />
          </div>
          <div className="small help-block">
            {this.help()}
          </div>
        </div>
      </div>
    );
  },

  help() {
    return null;
  },

  handleChange(e) {
    this.props.onChange(e.target.value);
  }
});
