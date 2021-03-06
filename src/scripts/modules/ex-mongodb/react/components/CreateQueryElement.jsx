import React from 'react';
import { Navigation } from 'react-router';

export default React.createClass({
  displayName: 'CreateQueryElement',
  mixins: [Navigation],
  propTypes: {
    isNav: React.PropTypes.bool.isRequired,
    configurationId: React.PropTypes.string.isRequired,
    componentId: React.PropTypes.string,
    actionCreators: React.PropTypes.object.isRequired
  },

  createQuery() {
    let query = this.props.actionCreators.createNewQuery(this.props.configurationId);
    this.transitionTo(
      'ex-mongodb-query',
      {
        config: this.props.configurationId,
        query: query.get('id')
      }
    );
  },

  render() {
    if (this.props.isNav) {
      return (
        <a className="list-group-item" onClick={this.createQuery}>
          <strong><i className="kbc-icon-plus"/>
            Create a new entry
          </strong>
        </a>
      );
    } else {
      return (
        <button
          className="btn btn-success"
          onClick={this.createQuery}
        >
          <i className="kbc-icon-plus"/> New Export
        </button>
      );
    }
  }
});
