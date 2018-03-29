import React from 'react';
import { Map } from 'immutable';

import QueryRow from './QueryRow';
import LinkToBucket from './../../components/LinkToBucket';
import CreateQueryElement from '../../components/CreateQueryElement';

export default React.createClass({
  propTypes: {
    queries: React.PropTypes.object,
    configurationId: React.PropTypes.string,
    componentId: React.PropTypes.string,
    pendingActions: React.PropTypes.object,
    actionCreators: React.PropTypes.object
  },
  render() {
    return (
      <div>
        <div className="kbc-header">
          <div className="text-right">
            <CreateQueryElement
              actionCreators={this.props.actionCreators}
              componentId={this.props.componentId}
              configurationId={this.props.configurationId}
              isNav={false}
            />
          </div>
          <p>
            Output bucket: <LinkToBucket configurationId={this.props.configurationId} />
          </p>
        </div>
        <div className="table table-striped table-hover">
          <div className="thead">
            <div className="tr">
              <span className="th">
                <strong>Name</strong>
              </span>
              <span className="th">
                <strong>Incremental</strong>
              </span>
              <span className="th" />
            </div>
          </div>
          <div className="tbody">
            {this.props.queries.map(query => {
              return (
                <QueryRow
                  componentId={this.props.componentId}
                  configurationId={this.props.configurationId}
                  pendingActions={this.props.pendingActions.get(query.get('id'), Map())}
                  query={query}
                  key={query.get('id')}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
});
