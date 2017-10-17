import React, {PropTypes} from 'react';

export default React.createClass({

  propTypes: {
    componentId: PropTypes.string.isRequired,
    setFormValidFn: PropTypes.func
  },

  getInitialState() {
    return {
      authorizedFor: ''
    };
  },

  componentDidMount() {
    this.revalidateForm();
  },

  revalidateForm() {
    this.props.setFormValidFn(this.isValid());
  },

  isValid() {
    return !!this.state.authorizedFor;
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
      </div>
    );
  }
});
