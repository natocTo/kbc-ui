import React from 'react';
import Sortable from 'sortablejs';

export default React.createClass({
  componentDidMount() {
    Sortable.create(this.refs.list);
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="col-md-9 kbc-main-content">
          <ul ref="list">
            <li>a</li>
            <li>b</li>
            <li>c</li>
          </ul>
        </div>
        <div className="col-md-3 kbc-main-sidebar" />
      </div>
    );
  }
});
