import React, {PropTypes} from 'react';
import _ from 'underscore';
import Select from 'react-select';
import {fromJS} from 'immutable';

export default React.createClass({
  propTypes: {
    transformation: PropTypes.object.isRequired,
    transformations: PropTypes.object.isRequired,
    requires: PropTypes.object.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onEditChange: PropTypes.func.isRequired
  },

  render() {
    return (
      <div>
        <div className="row">
          <span className="col-xs-3">
            <h2 style={{lineHeight: '32px'}}>
              Requires
            </h2>
          </span>
          <span className="col-xs-9 section-help">
            These transformations are processed before this transformation starts.
          </span>
        </div>
        <div className="form-group">
          <Select
            name="packages"
            value={this.props.requires.toArray()}
            options={this.getSelectOptions(this.props.transformations, this.props.transformation)}
            multi="true"
            disabled={this.props.isSaving}
            allowCreate={false}
            delimiter=","
            onChange={this.handleValueChange}
            placeholder="Add required transformation..."
            isLoading={this.props.isSaving}
            noResultsText="No transformations found"
            />
        </div>
      </div>
    );
  },

  getSelectOptions: function(transformations, currentTransformation) {
    return _.sortBy(_.map(_.filter(transformations.toArray(), function(transformation) {
      return parseInt(transformation.get('phase'), 10) === parseInt(currentTransformation.get('phase'), 10) && transformation.get('backend') === currentTransformation.get('backend') && transformation.get('id') !== currentTransformation.get('id');
    }), function(transformation) {
      return {
        label: transformation.get('name'),
        value: transformation.get('id')
      };
    }), function(option) {
      return option.label.toLowerCase();
    });
  },

  handleValueChange(newValue, newArray) {
    const values = fromJS(newArray).map((item) => item.get('value'));
    this.props.onEditChange(values);
  }

});
