import React from 'react';
import {Loader} from 'kbc-react-components';
// import {Link} from 'react-router';

export default React.createClass({
  propTypes: {
    isLoadingSourceTables: React.PropTypes.bool.isRequired,
    tableSelectorElement: React.PropTypes.object.isRequired,
    onRefresh: React.PropTypes.func.isRequired
  },

  render() {
    const {isLoadingSourceTables, tableSelectorElement } = this.props;
    if (isLoadingSourceTables) {
      return (
        <div>
          <Loader/> Fetching table list from storage ...
        </div>
      );
    }
    if (!isLoadingSourceTables) {
      return (
        <div>
          {tableSelectorElement}
          <div className="help-block">
            Not seeing your newest tables?
            {' '}
            <a
              onClick={(e) => {
                e.preventDefault();
                this.props.onRefresh();
              }}
            >
              Reload
            </a>
            {' '}
            the tables list.
          </div>
        </div>
      );
    }
    return tableSelectorElement;
  }
});
