import React, {PropTypes} from 'react';
import Immutable from 'immutable';
import TransformationBucketsStore from '../../transformations/stores/TransformationBucketsStore';
import TransformationsStore from '../../transformations/stores/TransformationsStore';
import ComponentConfigurationRowLink from '../../components/react/components/ComponentConfigurationRowLink';
import {AlertBlock, Icon} from '@keboola/indigo-ui';


export default React.createClass({
  propTypes: {
    transformations: PropTypes.object
  },
  render() {
    var getOddBucketList = function() {
      return (getFilteredBucketList(1));
    };
    var getEvenBucketList = function() {
      return (getFilteredBucketList(0));
    };
    var getFilteredBucketList = function(even) {
      let idx = 0;
      return (deprecatedTransformationsInBuckets.map(function(bucket, indexBucket) {
        idx++;
        if (idx % 2 === even) {
          return (getBucketList(bucket, indexBucket)
          );
        }
      }).toSeq().toArray());
    };
    var getBucketList = function(bucket, indexBucket) {
      return (
        <div key={indexBucket}>
          <h4>
            <Icon.Transformation className="icon-category"/>
            {TransformationBucketsStore.get(indexBucket).get('name', indexBucket)}
          </h4>
          <ul className="list-unstyled">
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
    };
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
      <AlertBlock type="warning" title="Please migrate these MySQL transformations to Snowflake">
        <p>
          Learn more about the MySQL transformation deprecation <a
          href="http://status.keboola.com/deprecating-mysql-storage-and-transformations" target="_blank">timeline and
          reasons</a>.
        </p>
        <div className="row">
          <div className="col-md-6">
            {getOddBucketList()}
          </div>
          <div className="col-md-6">
            {getEvenBucketList()}
          </div>
        </div>
      </AlertBlock>
    );
  }
});
