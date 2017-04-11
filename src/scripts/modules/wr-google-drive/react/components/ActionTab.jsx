import React, {PropTypes} from 'react';
import RadioGroup from 'react-radio-group';
import {Input} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    onChangeAction: PropTypes.func.isRequired,
    valueAction: PropTypes.string.isRequired
  },

  render() {
    return (
      <div className="form-horizontal">
        {this.renderActionRadio()}
      </div>
    );
  },

  renderActionRadio() {
    return (
      <div className="row">
        <div className="form-group">
          <label className="col-md-2 control-label">
            Action
          </label>
          <div className="col-md-10">
            <RadioGroup
              name="Action"
              value={this.props.valueAction}
              onChange={this.props.onChangeAction}
            >
              <div className="form-horizontal">
                <Input
                  type="radio"
                  label="Create new file"
                  help="Create new file each run"
                  wrapperClassName="col-sm-8"
                  value="create"
                />
                <Input
                  type="radio"
                  label="Update file"
                  help="Overwrite the same file"
                  wrapperClassName="col-sm-8"
                  value="update"
                />
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    );
  }
});