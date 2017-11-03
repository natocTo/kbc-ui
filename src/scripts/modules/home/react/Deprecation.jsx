import React, {PropTypes} from 'react';
import StringUtils from '../../../utils/string';
import ComponentDetailLink from '../../../react/common/ComponentDetailLink';
import Immutable from 'immutable';
import TransformationBucketsStore from '../../transformations/stores/TransformationBucketsStore';
import TransformationsStore from '../../transformations/stores/TransformationsStore';
import ComponentConfigurationRowLink from '../../components/react/components/ComponentConfigurationRowLink';

import './expiration.less';

export default React.createClass({
  propTypes: {
    components: PropTypes.object,
    transformations: PropTypes.object
  },

  render() {
    return (
      <span>
        {this.renderDeprecatedComponents()}
        {this.renderDeprecatedTransformations()}
      </span>
    );
  },

  renderDeprecatedTransformations() {
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

              <div className="row">
                {deprecatedTransformationsInBuckets.map(function(bucket, indexBucket) {
                  return (
                  <div className="col-md-4" key={indexBucket}>
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
                    })}
                    </ul>
               </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  },

  renderDeprecatedComponents() {
    const deprecatedComponents = this.props.components.filter(function(component) {
      return !!component.get('flags', Immutable.List()).contains('deprecated');
    });

    if (deprecatedComponents.isEmpty()) {
      return null;
    }

    const grouped = deprecatedComponents.groupBy(function(component) {
      return component.get('type');
    });

    return (
        <div className="kbc-overview-component">
          <div className="row kbc-header kbc-expiration kbc-deprecation">
            <div className="alert alert-warning">
              <h3>
                Project contains deprecated components
              </h3>

              <div className="row">
                {grouped.entrySeq().map(function([type, components]) {
                  return (
                  <div className="col-md-6" key={type}>
                    <h4>
                      <span className={'kbc-' + type + '-icon'}/>
                        {StringUtils.capitalize(type)}s
                    </h4>
                    <ul>
                    {components.entrySeq().map(function([index, component]) {
                      return (
                        <li key={index}>
                            <ComponentDetailLink
                            type={component.get('type')}
                            componentId={component.get('id')}
                            >
                            {component.get('name')}
                            </ComponentDetailLink>
                        </li>
                      );
                    })}
                    </ul>
               </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
