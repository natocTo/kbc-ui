import React from 'react';

import {Check} from 'kbc-react-components';

import ImmutableRenderMixin from '../../../../react/mixins/ImmutableRendererMixin';

import SapiTableLinkEx from '../../../components/react/components/StorageApiTableLinkEx';

export default React.createClass({

  mixins: [ImmutableRenderMixin],

  propTypes: {
    tableExists: React.PropTypes.bool.isRequired,
    isTableExported: React.PropTypes.bool.isRequired,
    table: React.PropTypes.object.isRequired,
    tableDbName: React.PropTypes.string.isRequired
  },

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
  },

  render() {
    console.log('render table row');
    console.log(this.props.table.toJS());
    return (
      <div className="tr">
        <div className="td">
          <SapiTableLinkEx
            tableId={this.props.table.get('id')}
          >{this.props.table.get('name')}</SapiTableLinkEx>
        </div>
        <div className="td">
          {this.props.tableDbName}
        </div>
        <div className="td">
          <Check isChecked={this.props.table.get('incremental')}/>
        </div>
      </div>
    );
  }

});

