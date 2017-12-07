import React, {PropTypes} from 'react';
import CredentialsForm from './CredentialsForm';
import SSLForm from './SSLForm';
import FixedIP from './FixedIP';
import {Tabs, Tab} from 'react-bootstrap';

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
            <Tabs defaultActiveKey="db" animation={false} id="odlexdbcredentialstab">
              <Tab eventKey="db" title="Database Credentials">
                <CredentialsForm
                    credentials={this.props.credentials}
                    enabled={this.props.isEditing}
                    onChange={this.props.onChange}
                />
              </Tab>
              <Tab eventKey="ssl" title="SSL">
                <SSLForm
                    credentials={this.props.credentials}
                    enabled={this.props.isEditing}
                    onChange={this.props.onChange}
                />
              </Tab>
              <Tab eventKey="fixedIp" title="Fixed IP">
                <FixedIP
                    credentials={this.props.credentials}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
    );
  }

});
