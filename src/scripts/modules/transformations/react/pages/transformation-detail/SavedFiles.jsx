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
        <h2 style={{lineHeight: '32px'}}>
          Stored Files
        </h2>
        <div className="form-group">
          <Select.Creatable
            name="tags"
            value={this.getValue()}
            multi="true"
            disabled={this.props.isSaving}
            onChange={this.handleValueChange}
            placeholder="Add tags..."
            isLoading={this.props.isSaving}
            />
          <span className="help-block">
            The latest file with a given tag will be saved to <code>/data/in/user/&#123;tag&#125;</code>.
          </span>
        </div>
      </div>
    );
  },

  handleValueChange(newArray) {
    const values = fromJS(newArray).map((item) => item.get('value'));
    this.props.onEditChange(values);
  },

  getValue() {
    return this.props.tags.map((item) => {
      return {label: item, value: item};
    }).toJS();
  }
});
