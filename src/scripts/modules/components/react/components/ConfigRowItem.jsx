import React from 'react';
import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';

export default React.createClass({
  displayName: 'ConfigRowItem',
  mixins: [ImmutableRenderMixin],
  propTypes: {
    row: React.PropTypes.object.isRequired,
    configId: React.PropTypes.string.isRequired,
    componentId: React.PropTypes.string.isRequired
  },

  renderRowName() {
    if (this.props.row.get('name')) {
      return this.props.row.get('name');
    } else {
      return (
        <span className="text-muted">Untitled</span>
      );
    }
  },

  render() {
    return (
      <div className="tr">
        <span className="td kbc-break-all">{this.renderRowName()}</span>
      </div>
    );
  }
});
