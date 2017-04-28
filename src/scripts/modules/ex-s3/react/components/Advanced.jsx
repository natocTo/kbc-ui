import React, {PropTypes} from 'react';
import immutableMixin from '../../../../react/mixins/ImmutableRendererMixin';
import {Input} from './../../../../react/common/KbcBootstrap';

export default React.createClass({
  mixins: [immutableMixin],

  propTypes: {
    delimiter: PropTypes.string.isRequired,
    enclosure: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  onChangeDelimiter(e) {
    this.props.onChange('delimiter', e.target.value);
  },

  onChangeEnclosure(e) {
    this.props.onChange('enclosure', e.target.value);
  },

  render() {
    return (
      <div className="form-horizontal">
        <Input
          type="text"
          label="Delimiter"
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8"
          value={this.props.delimiter}
          onChange={this.onChangeDelimiter}
          help={(<span>Field delimiter used in CSV file. Default value is <code>,</code>. Use <code>\t</code> for tabulator.</span>)}
          disabled={this.props.disabled}
          />
        <Input
          type="text"
          label="Enclosure"
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8"
          value={this.props.enclosure}
          onChange={this.onChangeEnclosure}
          help={(<span>Field enclosure used in CSV file. Default value is <code>"</code>.</span>)}
          disabled={this.props.disabled}
          />
      </div>
    );
  }
});
