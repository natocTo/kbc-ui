import React, {PropTypes} from 'react';
import DeletedConfigurationRow from './DeletedConfigurationRow';
import ComponentIcon from '../../../../react/common/ComponentIcon';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    component: PropTypes.object.isRequired,
    configurations: PropTypes.object.isRequired,
    deletingConfigurations: PropTypes.object.isRequired,
    restoringConfigurations: PropTypes.object.isRequired
  },

  render() {
    return (
      <div>
        <div className="kbc-header">
          <div className="kbc-title">
            <h2>
              <ComponentIcon component={this.props.component} size="32" />
              {this.props.component.get('name')}{this.renderType()}
            </h2>
          </div>
        </div>
        <div className="table table-hover">
          <span className="tbody">
            {this.configurations()}
          </span>
        </div>
      </div>
    );
  },

  renderType() {
    if (this.props.component.get('type') === 'extractor' || this.props.component.get('type') === 'writer') {
      return (
        <span> {this.props.component.get('type')}</span>
      );
    }
  },

  configurations() {
    return this.props.configurations.map((configuration) => {
      return React.createElement(DeletedConfigurationRow, {
        component: this.props.component,
        config: configuration,
        componentId: this.props.component.get('id'),
        isDeleting: this.props.deletingConfigurations.has(configuration.get('id')),
        isRestoring: this.props.restoringConfigurations.has(configuration.get('id')),
        key: configuration.get('id')
      });
    }, this);
  }
});
