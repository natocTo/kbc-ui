import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {OverlayTrigger, Popover, Button} from 'react-bootstrap';
import { Icon } from '@keboola/indigo-ui';
import SearchRow from '../../../../../react/common/SearchRow';

export default React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    onSearch: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired
  },

  render() {
    return (
      <div className="kbc-inner-padding kbc-row">
        <div className="row-search">
          <div className="row-search-input">
            <SearchRow
              query={this.props.query}
              onSubmit={(query) => this.props.onSearch(query)}
              placeholder="Search by name or attributes"
            />
          </div>
          <div className="row-search-action">
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={this.renderQuickHelp()}
            >
              <Button bsStyle="link"  title="Show Quick help">
                <Icon.Help className={'icon-size-20'}/>
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    );
  },

  renderQuickHelp() {
    return (
      <Popover
        title="Quick help"
        id="job-search-popover"
        className="popover-wide"
        placement="bottom"
      >
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
        <p>You can <a href="https://help.keboola.com/management/jobs/#searching-the-jobs-log">find more complex examples in documentation</a></p>
      </Popover>
    );
  }

});
