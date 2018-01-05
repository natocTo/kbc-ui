import React from 'react';
import createStoreMixin from '../../../../react/mixins/createStoreMixin';
import immutableMixin from '../../../../react/mixins/ImmutableRendererMixin';
import ConfigurationsStore  from '../../stores/ConfigurationsStore';
import RowsStore  from '../../stores/ConfigurationRowsStore';
import date from '../../../../utils/date';

module.exports = React.createClass({
  displayName: 'ConfigurationRowMetadata',
  mixins: [createStoreMixin(RowsStore, ConfigurationsStore), immutableMixin],
  propTypes: {
    componentId: React.PropTypes.string.isRequired,
    configurationId: React.PropTypes.string.isRequired,
    rowId: React.PropTypes.string.isRequired
  },
  getStateFromStores: function() {
    return {
      configuration: ConfigurationsStore.get(this.props.componentId, this.props.configurationId),
      row: RowsStore.get(this.props.componentId, this.props.configurationId, this.props.rowId)
    };
  },
  render: function() {
    return (
      <div>
        <div>
          Configuration created by
          {' '}
          <strong>{this.state.configuration.getIn(['creatorToken', 'description'])}</strong>
          {' '}
          <small>on <strong>{date.format(this.state.configuration.get('created'))}</strong></small>
        </div>
        <div>
          Row created by
          {' '}
          <strong>{this.state.row.getIn(['creatorToken', 'description'])}</strong>
          {' '}
          <small>on <strong>{date.format(this.state.row.get('created'))}</strong></small>
        </div>

      </div>
    );
  }
});
