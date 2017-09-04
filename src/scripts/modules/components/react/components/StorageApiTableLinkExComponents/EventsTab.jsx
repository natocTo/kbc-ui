import React, {PropTypes} from 'react';
import moment from 'moment';
import date from '../../../../../utils/date';
import string from 'underscore.string';
import {Table} from 'react-bootstrap';
import EmptyState from '../../../../components/react/components/ComponentEmptyState';
import immutableMixin from '../../../../../react/mixins/ImmutableRendererMixin';

export default React.createClass({

  propTypes: {
    tableExists: PropTypes.bool.isRequired,
    tableId: PropTypes.string.isRequired,
    events: PropTypes.object.isRequired,
    omitFetches: PropTypes.bool,
    omitExports: PropTypes.bool,
    filterIOEvents: PropTypes.bool,
    onShowEventDetail: PropTypes.func,
    detailEventId: PropTypes.number,
    onFilterIOEvents: PropTypes.func,
    onOmitFetchesFn: PropTypes.func,
    onOmitExportsFn: PropTypes.func

  },

  mixins: [immutableMixin],

  render() {
    if (!this.props.tableExists) {
      return (
        <EmptyState>
          No Data.
        </EmptyState>
      );
    }
    const events = this.props.events;
    const rows = events.map( (e) => {
      const event = e.get('event');
      let info = this.eventsTemplates[event];
      if (!info) {
        info = {
          className: '',
          message: e.get('message')
        };
      }
      const cl = `tr ${info.className}`;
      const agoTime = moment(e.get('created')).fromNow();
      const incElement = <p><small><strong>incremental</strong></small></p>;
      info.message = string.replaceAll(info.message, this.props.tableId, '');
      const incremental = e.getIn(['params', 'incremental']) ? incElement : <span />;
      const isDetail = e.get('id') === this.props.detailEventId;
      if (isDetail) {
        return this.renderDetail(e);
      } else {
        return (
          <tr className={cl} role="button" onClick={() => this.setDetailEventId(e.get('id'))}>
            <td className="td">
              {e.get('id')}
            </td>
            <td className="td">
              {date.format(e.get('created'))}
              <small> {agoTime} </small>
            </td>
            <td className="td">
              {info.message}
              {incremental}
            </td>
            <td className="td">
              {e.getIn(['token', 'name'])}
            </td>
          </tr>
        );
      }
    }
    );

    return (
      <div>
        <div>
          <div className="row">
            <div className="col-xs-3">
              <div className="checkbox">
                <label>
                  <input
                    disabled={this.props.filterIOEvents}
                    checked={this.props.omitFetches}
                    onClick={this.props.onOmitFetchesFn}
                    type="checkbox"/>
                  <span className={this.props.filterIOEvents ? 'text-muted' : ''}>
                    Ignore table fetches
                  </span>
                </label>
              </div>
            </div>
            <div className="col-xs-3">
              <div className="checkbox">
                <label>
                  <input
                    disabled={this.props.filterIOEvents}
                    checked={this.props.omitExports}
                    onClick={this.props.onOmitExportsFn}
                    type="checkbox"/>
                  <span className={this.props.filterIOEvents ? 'text-muted' : ''}>
                    Ignore table exports
                  </span>
                </label>
              </div>
            </div>
            <div className="col-xs-3">
              <div className="checkbox">
                <label>
                  <input
                    checked={this.props.filterIOEvents}
                    onClick={this.props.onFilterIOEvents}
                    type="checkbox"/> Import/Exports only
                </label>
              </div>
            </div>
          </div>
        </div>
        <Table responsive className="table">
          <thead className="thead">
            <tr className="tr">
              <th className="th">
                Id
              </th>
              <th className="th">
                Created
              </th>
              <th className="th">
                Event
              </th>
              <th className="th">
                Creator
              </th>

            </tr>
          </thead>
          <tbody className="tbody">
            {rows}
          </tbody>
        </Table>
      </div>
    );
  },

  setDetailEventId(eventId) {
    this.props.onShowEventDetail(eventId);
  },

  renderDetail(event) {
    return (
      <tr role="button" onClick={() => this.setDetailEventId(null)}>
        <td colSpan="3">
          detail {event.get('id')}
        </td>
      </tr>
    );
  },

  eventsTemplates: {
    'storage.tableImportStarted': {
      'message': 'Import started',
      'className': ''
    },

    'storage.tableImportDone': {
      'message': 'Successfully imported ',
      'className': 'success'
    },

    'storage.tableImportError': {
      'message': 'Error on table import',
      'className': 'error'
    },

    'storage.tableExported': {
      'message': 'Exported to a csv file',
      'className': 'info'
    }

  }

});
