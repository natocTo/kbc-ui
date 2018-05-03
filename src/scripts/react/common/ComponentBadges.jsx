import React, {PropTypes} from 'react';

export default React.createClass({
  propTypes: {
    flags: PropTypes.object.isRequired
  },

  render() {
    return (
      <div className="badge-component-container">
        {this.getBadges()}
      </div>
    );
  },

  getBadges() {
    const badges = this.props.flags.map((flag) =>
      <div className={'badge badge-component-item' + ' badge-component-item-' + flag}>
          {this.renderBadge(flag)}
          </div>
    );
    return badges;
  },

  renderBadge(flag) {
    if (flag === '3rdParty') {
      return (<span>3<sup>rd</sup> party</span>);
    }
    if (flag === 'excludeFromNewList') {
      return 'Alpha';
    }
  }
});
