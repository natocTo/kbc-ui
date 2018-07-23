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
  getOddBucketList() {
    return (this.getFilteredBucketList(1));
  },
  getEvenBucketList() {
    return (this.getFilteredBucketList(0));
  },
  getFilteredBucketList(even) {
    let idx = 0;
    return (
      this.getDeprecatedTransformationsInBuckets().map(function(bucket, indexBucket) {
        idx++;
        if (idx % 2 === even) {
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
        }
      }).toSeq().toArray());
  },
  getDeprecatedTransformationsInBuckets() {
    var deprecatedTransformationsInBuckets = new Immutable.Map();
    this.props.transformations.forEach(function(bucket, index) {
      const deprecatedTransformations = bucket.filter(function(transformation) {
        return transformation.get('backend') === 'mysql';
      });
      if (deprecatedTransformations.count() > 0) {
        deprecatedTransformationsInBuckets = deprecatedTransformationsInBuckets.set(index, deprecatedTransformations);
      }
    });
    return deprecatedTransformationsInBuckets;
  },
  render() {
    if (!this.props.transformations) {
      return null;
    }
    if (this.getDeprecatedTransformationsInBuckets().isEmpty()) {
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
            {this.getOddBucketList()}
          </div>
          <div className="col-md-6">
            {this.getEvenBucketList()}
          </div>
        </div>
      </AlertBlock>
    );
  }
})
;
