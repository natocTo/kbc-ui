import React, {PropTypes} from 'react';
import Select from 'react-select';
import {fromJS} from 'immutable';

export default React.createClass({
  propTypes: {
    tags: PropTypes.object.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onEditChange: PropTypes.func.isRequired
  },

  render() {
    return (
      <div>
        <div className="row">
          <span className="col-xs-3">
            <h2 style={{lineHeight: '32px'}}>
              Stored Files
            </h2>
          </span>
          <span className="col-xs-9 section-help">
            The latest file with a given tag will be saved to <code>/data/in/user/&#123;tag&#125;</code>.
          </span>
        </div>
        <div className="form-group">
          <Select
            name="tags"
            value={this.props.tags.toArray()}
            multi="true"
            disabled={this.props.isSaving}
            allowCreate="true"
            delimiter=","
            onChange={this.handleValueChange}
            placeholder="Add tags..."
            isLoading={this.props.isSaving}
            />
        </div>
      </div>
    );
  },

  handleValueChange(newValue, newArray) {
    const values = fromJS(newArray).map((item) => item.get('value'));
    this.props.onEditChange(values);
  }
});
