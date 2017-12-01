import React from 'react';
import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';
import ConfigRowItem from './ConfigRowItem';

export default React.createClass({
  displayName: 'ConfigRowTable',

  mixins: [ImmutableRenderMixin],

  propTypes: {
    rows: React.PropTypes.object.isRequired,
    configId: React.PropTypes.string.isRequired,
    componentId: React.PropTypes.string.isRequired,
    headers: React.PropTypes.array,
    configRowItemElement: React.PropTypes.function
  },

  getDefaultProps: function() {
    return {
      headers: ['Name'],
      configRowItemElement: ConfigRowItem
    };
  },


  renderHeaders() {
    return this.props.headers.map(function(header) {
      return (
        <span className="th">
          <strong>{header}</strong>
        </span>
      );
    });
  },

  render() {
    const children = this.props.rows.map(function(row) {
      const props = {
        row: row,
        componentId: this.props.componentId,
        configId: this.props.configId,
        key: row.get('id')
      };
      return React.createElement(this.props.configRowItemElement, props);
    }, this).toArray();

    return (
      <div className="table table-striped table-hover">
        <div className="thead" key="table-header">
          <div className="tr">
            {this.renderHeaders()}
          </div>
        </div>
        <div className="tbody">
          {children}
        </div>
      </div>
    );
  }
});
