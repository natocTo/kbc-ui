import React, {PropTypes} from 'react';
import {DropdownButton, MenuItem} from 'react-bootstrap';
// import {Map} from 'immutable';

const TEMPLATES = [
  {
    'name': 'today',
    'since': 'today',
    'until': 'now'
  },
  {
    'name': 'Yesterday',
    'since': 'yesterday',
    'until': 'today'
  },
  {
    'name': 'Last 7 days',
    'since': 'today',
    'until': '7 days ago'
  },
  {
    'name': 'Last 30 days',
    'since': 'today',
    'until': '30 days ago'
  },
  {
    'name': 'This Month',
    'since': 'midnight first day of this month',
    'until': 'midnight last day of this month'
  },
  {
    'name': 'Last Month',
    'since': 'midnight first day of last month',
    'until': 'midnight last day of last month'
  },
  {
    'name': 'This Week',
    'since': 'monday this week',
    'until': 'today'
  },
  {
    'name': 'Last Week',
    'since': 'monday last week',
    'until': 'sunday last week'

  }

];

export default React.createClass({
  propTypes: {
    query: PropTypes.object.isRequired,
    updateQueryFn: PropTypes.func.isRequired
  },

  getInitialState() {
    return {text: 'Sample Date Ranges'};
  },

  render() {
    return (
      <DropdownButton
        pullRight={true}
        onSelect={this.selectTemplate}
        bsStyle="default"
        title={this.state.text}>
        {TEMPLATES.map((t) =>
          <MenuItem eventKey={t.name}>
              {t.name}
          </MenuItem>
         )}
      </DropdownButton>
    );
  },

  selectTemplate(id) {
    // const id = e.target.value;
    const template = TEMPLATES.find((t) => t.name === id);
    const newQuery = this.props.query
                         .setIn(['query', 'since'], template.since)
                         .setIn(['query', 'until'], template.until);
    this.props.updateQueryFn(newQuery);
    const newText = template.name + ' date range';
    this.setState({text: newText});
  }
});
