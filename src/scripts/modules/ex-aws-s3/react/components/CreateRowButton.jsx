import React, {PropTypes} from 'react';
import immutableMixin from '../../../../react/mixins/ImmutableRendererMixin';

export default React.createClass({
  mixins: [immutableMixin],

  propTypes: {
    onClick: PropTypes.func.isRequired
  },

  render() {
    return (
      <button className="btn btn-default" onClick={this.onClick}>
        Add table
      </button>
    );
  }
});
