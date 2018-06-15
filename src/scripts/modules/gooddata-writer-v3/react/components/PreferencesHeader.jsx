import React, {PropTypes} from 'react';

export default React.createClass({
  propTypes: {
    headerState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  },

  render() {
    const {showIdentifiers} = this.props.headerState;
    return (
      <span>
        Preferences
        <div className="checkbox">
          <label>
            <input
              checked={showIdentifiers}
              onClick={() => this.props.onChange({showIdentifiers: !showIdentifiers})}
              type="checkbox"/>
              Show Identifiers
          </label>
        </div>
      </span>
    );
  }
});
