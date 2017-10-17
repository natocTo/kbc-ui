import React from 'react';

export default React.createClass({

  propTypes: {
    componentId: React.PropTypes.string.isRequired,
    setFormValidFn: React.PropTypes.func
  },

  getInitialState() {
    return {
      authorizedFor: '',
      appKey: '',
      appSecret: ''
    };
  },

  componentDidMount() {
    this.revalidateForm();
  },

  revalidateForm() {
    this.props.setFormValidFn(this.isValid());
  },

  isValid() {
    return !!this.state.appKey && !!this.state.appSecret;
  },

  makeSetStatePropertyFn(prop) {
    return (e) => {
      const val = e.target.value;
      let result = {};
      result[prop] = val;
      this.setState(result);
      this.revalidateForm();
    };
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
                defaultValue={this.state.authorizedFor}
                onChange={this.makeSetStatePropertyFn('authorizedFor')}
                autoFocus={true}
              />
              <p className="help-block">
                Describe this authorization, e.g. by the account name.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label className="control-label col-xs-2">
              Client ID
            </label>
            <div className="col-xs-10">
              <input
                className="form-control"
                type="text"
                name="appKey"
                defaultValue={this.state.appKey}
                onChange={this.makeSetStatePropertyFn('appKey')}
              />
              <p className="help-block">
                Client ID of your app
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="form-group">
            <label className="control-label col-xs-2">
              Client secret
            </label>
            <div className="col-xs-10">
              <input
                className="form-control"
                type="text"
                name="appSecret"
                defaultValue={this.state.appSecret}
                onChange={this.makeSetStatePropertyFn('appSecret')}
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
