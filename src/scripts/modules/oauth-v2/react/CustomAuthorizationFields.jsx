import React from 'react';

export default React.createClass({

  propTypes: {
    authorizedFor: React.PropTypes.string,
    appKey: React.PropTypes.string,
    appSecret: React.PropTypes.string,
    componentId: React.PropTypes.string.isRequired,
    onChangeFn: React.PropTypes.func,
    disabled: React.PropTypes.bool
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <p>
            Provide your own OAuth 2.0 credentials from <a href="https://console.developers.google.com" target="_blank">Google API Console</a>.
            <br />
            Follow these <a href="https://help.keboola.com/extractors/marketing-sales/google-analytics/#custom-oauth-authorization" target="_blank">instructions</a> to set up an application and obtain a pair of credentials.
          </p>
        </div>
        <div className="row">
          <div className="form-group">
            <label className="control-label col-xs-2">
              Description
            </label>
            <div className="col-xs-10">
              <input
                className="form-control"
                type="text"
                name="authorizedFor"
                defaultValue={this.props.authorizedFor}
                onChange={(e) => this.props.onChangeFn('authorizedFor', e.target.value)}
                autoFocus={true}
                disabled={this.props.disabled}
              />
              <p className="help-block">
                Describe this authorization, e.g. by the account name.
              </p>
            </div>
            <label className="control-label col-xs-2">
              Client ID
            </label>
            <div className="col-xs-10">
              <input
                className="form-control"
                type="text"
                name="appKey"
                defaultValue={this.props.appKey}
                onChange={(e) => this.props.onChangeFn('appKey', e.target.value)}
                disabled={this.props.disabled}
              />
              <p className="help-block">
                Client ID of your app
              </p>
            </div>
            <label className="control-label col-xs-2">
              Client secret
            </label>
            <div className="col-xs-10">
              <input
                className="form-control"
                type="text"
                name="appSecret"
                defaultValue={this.props.appSecret}
                onChange={(e) => this.props.onChangeFn('appSecret', e.target.value)}
                disabled={this.props.disabled}
              />
              <p className="help-block">
                Client secret of your app
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
