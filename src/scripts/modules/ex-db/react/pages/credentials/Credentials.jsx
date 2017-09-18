import React, {PropTypes} from 'react';
import CredentialsForm from './CredentialsForm';
import SSLForm from './SSLForm';
import FixedIP from './FixedIP';
import {TabbedArea, TabPane} from './../../../../../react/common/KbcBootstrap';

export default React.createClass({
  propTypes: {
    credentials: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  },

  render() {
    return (
        <div className="container-fluid">
          <div className="kbc-main-content">
            <TabbedArea defaultActiveKey="db" animation={false} id="odlexdbcredentialstab">
              <TabPane eventKey="db" title="Database Credentials">
                <CredentialsForm
                    credentials={this.props.credentials}
                    enabled={this.props.isEditing}
                    onChange={this.props.onChange}
                />
              </TabPane>
              <TabPane eventKey="ssl" title="SSL">
                <SSLForm
                    credentials={this.props.credentials}
                    enabled={this.props.isEditing}
                    onChange={this.props.onChange}
                />
              </TabPane>
              <TabPane eventKey="fixedIp" title="Fixed IP">
                <FixedIP
                    credentials={this.props.credentials}
                />
              </TabPane>
            </TabbedArea>
          </div>
        </div>
    );
  }

});
