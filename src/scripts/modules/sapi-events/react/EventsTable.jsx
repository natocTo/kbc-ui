
import React from 'react';
import TableRow from './EventsTableRow';
import {Loader} from 'kbc-react-components';
import PureRendererMixin from '../../../react/mixins/ImmutableRendererMixin';

const {div} = React.DOM;

export default React.createClass({
  mixins: [PureRendererMixin],
  propTypes: {
    events: React.PropTypes.object.isRequired,
    link: React.PropTypes.object.isRequired,
    isLoading: React.PropTypes.bool.isRequired,
    onEventSelect: React.PropTypes.func
  },

  render() {
    return (
      <div className="table table-striped table-hover">
        <div className="thead">
          <div className="tr">
            <div className="th">
              Created
            </div>
            <div className="th">
              Event {this.props.isLoading ? React.createElement(Loader) : null}
            </div>
          </div>
        </div>
        <div className="tbody">
          {this._body()}
        </div>
      </div>
    );
  },

  _body() {
    return this.props.events.map( function(event) {
      return React.createElement(TableRow, {
        onClick: this._handleEventSelect.bind(this, event),
        event,
        link: this.props.link,
        key: event.get('id')
      });
    }, this).toArray();
  },

  _handleEventSelect(selectedEvent) {
    return this.props.onEventSelect(selectedEvent);
  }
});

