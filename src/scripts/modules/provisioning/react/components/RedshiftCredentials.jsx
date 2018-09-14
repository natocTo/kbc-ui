import React from 'react';
import { Protected, Loader } from '@keboola/indigo-ui';
import Clipboard from '../../../../react/common/Clipboard';
import { Input } from './../../../../react/common/KbcBootstrap';

const RedshiftCredentials = React.createClass({
  propTypes: {
    credentials: React.PropTypes.object,
    isCreating: React.PropTypes.bool
  },

  getInitialState() {
    return { showDetails: false };
  },

  render() {
    return <div>{this._renderSandbox()}</div>;
  },

  _renderSandbox() {
    if (this.props.isCreating) {
      return (
        <span>
          <Loader /> Creating sandbox
        </span>
      );
    }

    if (this.props.credentials.get('id')) {
      return this._renderCredentials();
    }

    return 'Sandbox not running';
  },

  _renderCredentials() {
    const { credentials } = this.props;
    const jdbcRedshift = `jdbc:redshift://${credentials.get('hostname')}:5439/${credentials.get('db')}`;
    const jdbcPgSql = `jdbc:postgresql://${credentials.get('hostname')}:5439/${credentials.get('db')}`;

    return (
      <span>
        <div className="row">
          <div className="col-md-12">
            <small className="help-text">
              {'Use these credentials to connect to the sandbox with your favourite Redshift client (we like '}
              <a href="http://dbeaver.jkiss.org/download/" target="_blank">
                DBeaver
              </a>
              ).
            </small>
          </div>
        </div>
        <div className="row">
          <span className="col-md-3">Host</span>
          <strong className="col-md-9">
            {this.props.credentials.get('hostname')}
            <Clipboard text={credentials.get('hostname')} />
          </strong>
        </div>
        <div className="row">
          <span className="col-md-3">Port</span>
          <strong className="col-md-9">
            5439
            <Clipboard text="5439" />
          </strong>
        </div>
        <div className="row">
          <span className="col-md-3">User</span>
          <strong className="col-md-9">
            {credentials.get('user')}
            <Clipboard text={credentials.get('user')} />
          </strong>
        </div>
        <div className="row">
          <span className="col-md-3">Password</span>
          <strong className="col-md-9">
            <Protected>{credentials.get('password')}</Protected>
            <Clipboard text={credentials.get('password')} />
          </strong>
        </div>
        <div className="row">
          <span className="col-md-3">Database</span>
          <strong className="col-md-9">
            {credentials.get('db')}
            <Clipboard text={credentials.get('db')} />
          </strong>
        </div>
        <div className="row">
          <span className="col-md-3">Schema</span>
          <strong className="col-md-9">
            {credentials.get('schema')}
            <Clipboard text={credentials.get('schema')} />
          </strong>
        </div>
        <div className="form-horizontal clearfix">
          <div className="row">
            <div className="form-group-sm">
              <span className="col-md-3">{''}</span>
              <div className="col-md-9">
                <Input
                  standalone={true}
                  type="checkbox"
                  label={<small>Show JDBC strings</small>}
                  checked={this.state.showDetails}
                  onChange={this._handleToggleShowDetails}
                />
              </div>
            </div>
          </div>
        </div>

        {this.state.showDetails && (
          <div className="row">
            <span className="col-md-3">Redshift driver</span>
            <strong className="col-md-9">
              {jdbcRedshift}
              <Clipboard text={jdbcRedshift} />
            </strong>
          </div>
        )}

        {this.state.showDetails && (
          <div className="row">
            <span className="col-md-3">PostgreSQL driver</span>
            <strong className="col-md-9">
              {jdbcPgSql}
              <Clipboard text={jdbcPgSql} />
            </strong>
          </div>
        )}
      </span>
    );
  },

  _handleToggleShowDetails(e) {
    return this.setState({
      showDetails: e.target.checked
    });
  }
});

export default RedshiftCredentials;
