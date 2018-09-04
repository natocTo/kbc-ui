import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default React.createClass({
  propTypes: {
    query: PropTypes.object.isRequired,
    configurationId: PropTypes.string.isRequired,
    componentId: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired
  },
  render() {
    return (
      <Link
        className="list-group-item"
        to={'ex-mongodb-query'}
        params={this.linkParams()}
      >
        {(this.props.isEditing) ? (
          <strong>
            {this.renderName()} *
          </strong>
        ) : (
          <span>
            {this.renderName()}
          </span>
        )
        }
      </Link>
    );
  },

  renderName() {
    if (this.props.query.get('name') === '') {
      return <span className="text-muted">[Untitled]</span>;
    } else {
      return this.props.query.get('name');
    }
  },

  linkParams() {
    return {
      config: this.props.configurationId,
      query: this.props.query.get('id')
    };
  }
});
