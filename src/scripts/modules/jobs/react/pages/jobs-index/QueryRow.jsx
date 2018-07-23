import React, {PropTypes} from 'react';
import immutableMixin from 'react-immutable-render-mixin';
import {OverlayTrigger, Popover} from 'react-bootstrap';

export default React.createClass({
  mixins: [immutableMixin],

  propTypes: {
    onSearch: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      query: this.props.query
    };
  },

  onQueryChange(event) {
    this.setState({
      query: event.target.value
    });
  },
  doSearch(event) {
    this.props.onSearch(this.state.query);
    event.preventDefault();
  },
  render() {
    return (
      <form onSubmit={this.doSearch}>
        <div className="row kbc-search kbc-search-row">
          <span className="kbc-icon-search" />
          <input
            type="text"
            value={this.state.query}
            className="form-control"
            onChange={this.onQueryChange}
            placeholder="search"
          />
            <OverlayTrigger
              placement="bottom"
              overlay={this.renderPopover()}
            >
              <i className={'btn btn-link fa fa-question'} />
            </OverlayTrigger>
        </div>
      </form>
    );
  },

  renderPopover() {
    return ( <Popover title="Quick help" id="job-search-popover" placement="bottom">

    </Popover> );
  }

});
