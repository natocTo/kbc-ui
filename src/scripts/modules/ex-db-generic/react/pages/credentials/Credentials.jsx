import React, {PropTypes} from 'react';
import CredentialsForm from './CredentialsForm';
import SSLForm from './SSLForm';
import FixedIP from './FixedIP';
import {TabbedArea, TabPane} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    credentials: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    componentId: PropTypes.string.isRequired
  },

  render() {
    return (
      <div className="container-fluid kbc-main-content">
        <TabbedArea defaultActiveKey="db" animation={false}>
          <TabPane eventKey="db" tab="Database Credentials">
            <CredentialsForm
              credentials={this.props.credentials}
              enabled={this.props.isEditing}
              onChange={this.props.onChange}
              componentId={this.props.componentId}
            />
          </TabPane>
          {/* {this.renderSSLForm()} */}
          <TabPane eventKey="fixedIp" tab="Fixed IP">
            <FixedIP
              credentials={this.props.credentials}
            />
          </TabPane>
        </TabbedArea>
      </div>
    );
  },

  renderSSLForm() {
    return (
      <TabPane eventKey="ssl" tab="SSL">
        <SSLForm
          credentials={this.props.credentials}
          enabled={this.props.isEditing}
          onChange={this.props.onChange}
          componentId={this.props.componentId}
        />
      </TabPane>
    );
  }

});