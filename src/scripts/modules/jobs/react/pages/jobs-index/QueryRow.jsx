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
        <div className="kbc-inner-padding">
        <div className="row-search">
          <div className="row-search-input">
            <input
              type="text"
              value={this.state.query}
              className="form-control"
              onChange={this.onQueryChange}
              placeholder="search"
            />
          </div>
          <div className="row-search-action">
             <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={this.renderPopover()}
            >
             <i className={'btn btn-link fa fa-question'} />
            </OverlayTrigger>
          </div>
          </div>
        </div>
      </form>
    );
  },

  renderPopover() {
    return ( <Popover title="Quick help" id="job-search-popover" className="popover-wide" placement="bottom">
      <h3>Search attributes</h3>
      <dl>
        <dt>
          Job status
        </dt>
        <dd>
          <code>status:success</code>
        </dd>
        <dt>
          User who created the job
        </dt>
        <dd>
          <code>token.description:john.doe@company.com</code>
        </dd>
        <dt>
          Component name
        </dt>
        <dd>
          <code>params.component:keboola.ex-http</code>
        </dd>
        <dt>
          Config ID
        </dt>
        <dd>
          <code>params.config:351711187</code>
        </dd>
        <dt>
          Duration
        </dt>
        <dd>
          <code>durationSeconds:>120</code>
        </dd>
        <dt>
          Time started
        </dt>
        <dd>
          <code>startTime:[2018-06-21 TO 2018-07-01]</code>
        </dd>
        <dt>
          Time finished
        </dt>
        <dd>
          <code>endTime:[2018-06-21 TO 2018-07-01]</code>
        </dd>
        <h3>Modifiers and combining queries</h3>

        <dt>
          Exclude some results
        </dt>
        <dd>
          <code>-status:success</code><br /> Note the minus sign before the query
        </dd>

        <dt>
          Combine queries
        </dt>
        <dd>
          <code>+params.component:keboola.ex-http +status:error</code>
        </dd>
        <dt>
          Combine queries with more possible values
        </dt>
        <dd>
          <code>+params.component:(keboola.ex-http OR keboola.wr-google-sheets)</code><br />
          Jobs from either HTTP or Google Sheets extractor
        </dd>
        <dt>
          Complex query
        </dt>
        <dd>
          <code>+params.component:(keboola.ex-http OR keboola.wr-google-sheets) AND -status:success</code>
        </dd>
        <dt>
          Open ended time query
        </dt>
        <dd>
          <code>endTime:[2018-06-21 TO *]</code>
        </dd>
      </dl>
    </Popover> );
  }

});
