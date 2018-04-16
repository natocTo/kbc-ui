import React, {PropTypes} from 'react';
import Immutable from 'immutable';
import TransformationBucketsStore from '../../transformations/stores/TransformationBucketsStore';
import TransformationsStore from '../../transformations/stores/TransformationsStore';
import ComponentConfigurationRowLink from '../../components/react/components/ComponentConfigurationRowLink';

export default React.createClass({
  propTypes: {
    transformations: PropTypes.object
  },

  render() {
    if (!this.props.transformations) {
      return null;
    }
    var deprecatedTransformationsInBuckets = new Immutable.Map();
    this.props.transformations.forEach(function(bucket, index) {
      const deprecatedTransformations = bucket.filter(function(transformation) {
        return transformation.get('backend') === 'mysql';
      });
      if (deprecatedTransformations.count() > 0) {
        deprecatedTransformationsInBuckets = deprecatedTransformationsInBuckets.set(index, deprecatedTransformations);
      }
    });

    if (deprecatedTransformationsInBuckets.isEmpty()) {
      return null;
    }
    return (
        <div className="kbc-overview-component">
          <div className="row kbc-header kbc-expiration kbc-deprecation">
            <div className="alert alert-warning">
              <h3>
                Project contains deprecated MySQL transformations
              </h3>
              <div>
                Learn more about the deprecation <a href="http://status.keboola.com/deprecating-mysql-storage-and-transformations" target="_blank">timeline and reasons</a>.
              </div>
              <div className="row">
                {deprecatedTransformationsInBuckets.map(function(bucket, indexBucket) {
                  return (
                  <div className="col-md-6" key={indexBucket}>
                    <h4>
                      <span className={'kbc-transformation-icon'}/>
                        {TransformationBucketsStore.get(indexBucket).get('name', indexBucket)}
                    </h4>
                    <ul>
                    {bucket.map(function(transformation, indexTransformation) {
                      return (
                        <li key={indexTransformation}>
                          <ComponentConfigurationRowLink
                            componentId="transformation"
                            configId={indexBucket}
                            rowId={indexTransformation}
                          >
                            {TransformationsStore.getTransformation(indexBucket, indexTransformation).get('name', indexTransformation)}
                          </ComponentConfigurationRowLink>
                        </li>
                      );
                    }).toSeq().toArray()}
                    </ul>
               </div>
                  );
                }).toSeq().toArray()}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
