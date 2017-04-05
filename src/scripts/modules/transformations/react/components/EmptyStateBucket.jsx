import React from 'react';
import NewTransformation from '../modals/NewTransformation';
import TransformationBucketEmptyImage from '../../../../../images/transformation-bucket-empty.png';
require('./EmptyStateBucket.less');

export default React.createClass({
  propTypes: {
    bucket: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <div className="row transformation-bucket-empty-state">
        <span className="col-md-4 text-center"><img src={TransformationBucketEmptyImage} /></span>
        <span className="col-md-8">
          <h2>This transformation bucket is empty.</h2>
          <p className="add-button"><NewTransformation type="button" label="Add Transformation" bucket={this.props.bucket}/></p>
          <p className="help"><small><strong>What is a transformation?</strong><br />Transformations pick data from Storage, manipulate it and then store it back. They can be written in SQL (MySQL, Redshift, Snowflake), Python, R or OpenRefine.</small></p>
        </span>
      </div>
    );
  }
});
