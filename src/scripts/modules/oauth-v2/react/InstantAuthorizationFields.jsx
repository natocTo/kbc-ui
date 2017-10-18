import React, {PropTypes} from 'react';

export default React.createClass({

  propTypes: {
    authorizedFor: PropTypes.string,
    componentId: PropTypes.string.isRequired,
    onChangeFn: PropTypes.func,
    infoText: PropTypes.string
  },

  render() {
    return (
      <div className="container-fluid">
        {!!this.props.infoText ?
          <div className="row">
            <div className="col-md-12">
              <div className="alert alert-warning">{this.props.infoText}</div>
            </div>
          </div>
          : null
        }
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
              />
              <p className="help-block">
                Describe this authorization, e.g. by the account name.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
