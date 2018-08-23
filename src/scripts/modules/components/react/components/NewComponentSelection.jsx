import React from 'react';
import ComponentsActionCreators from '../../ComponentsActionCreators';
import {SearchBar} from '@keboola/indigo-ui';
import ComponentBox from '../../../../react/common/ComponentBox';

export default React.createClass({
  propTypes: {
    components: React.PropTypes.object.isRequired,
    filter: React.PropTypes.string,
    componentType: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    children: React.PropTypes.any
  },

  render() {
    return (
      <div className={this.props.className}>
        {this.props.children}
        <div className="row">
          <div className="col-xs-12">
            <SearchBar
              onChange={this.handleFilterChange}
              query={this.props.filter}
            />
            </div>
          </div>
        <div className="table kbc-table-border-vertical kbc-components-overview kbc-layout-table">
          <div className="tbody">
            {this.renderComponents()}
          </div>
        </div>
        <div className="row">
          <div className="text-center">
            <h2>Haven't found what you're looking for?</h2>
            <a className="btn btn-primary" href="mailto:support@keboola.com">Let us know</a>
          </div>
        </div>
      </div>
    );
  },

  handleFilterChange(query) {
    ComponentsActionCreators
      .setComponentsFilter(query, this.props.componentType);
  },

  renderComponents() {
    return this.props.components
      .toIndexedSeq()
      .sortBy((component) => component.get('name').toLowerCase())
      .groupBy((component, i) => Math.floor(i / 3))
      .map(this.renderComponentsRow)
      .toArray();
  },

  renderComponentsRow(components, index) {
    return (
      <div className="tr" key={index}>
        {components.map((component) => {
          return (
            <ComponentBox component={component} key={component.get('id')} />
          );
        })}
      </div>
    );
  }
});
