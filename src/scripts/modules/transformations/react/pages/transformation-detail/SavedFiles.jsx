import React, {PropTypes} from 'react';
import Select from '../../../../../react/common/Select';

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
            value={this.props.value}
            multi={true}
            disabled={this.props.isSaving}
            onChange={this.props.onEditChange}
            placeholder="Add tags..."
            isLoading={this.props.isSaving}
            allowCreate={true}
            trimMultiCreatedValues={true}
            />
          <span className="help-block">
            The latest file with a given tag will be saved to <code>/data/in/user/&#123;tag&#125;</code>.
          </span>
        </div>
      </div>
    );
  }
});
