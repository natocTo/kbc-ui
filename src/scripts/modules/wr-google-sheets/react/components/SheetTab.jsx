import React, {PropTypes} from 'react';
import {RadioGroup} from 'react-radio-group';
import {Input} from '../../../../react/common/KbcBootstrap';

export default React.createClass({
  propTypes: {
    onChangeSheetTitle: PropTypes.func.isRequired,
    onChangeAction: PropTypes.func.isRequired,
    valueSheetTitle: PropTypes.string.isRequired,
    valueAction: PropTypes.string.isRequired
  },

  render() {
    return (
      <div className="form-horizontal">
        {this.renderSheetTitle()}
        {this.renderActionRadio()}
      </div>
    );
  },

  renderSheetTitle() {
    return (
      <div className="form-group">
        <label className="col-md-2 control-label">
          Sheet title
        </label>
        <div className="col-md-10">
          <Input
            placeholder="Sheet1"
            type="text"
            value={this.props.valueSheetTitle}
            onChange={this.props.onChangeSheetTitle}
            className="form-control"
          />
          <span className="help-block">
            Type a name of existing Sheet to import into it or type a unique name to add new Sheet into the Spreadsheet.
          </span>
        </div>
      </div>
    );
  },

  renderActionRadio() {
    return (
      <div className="form-group">
        <label className="col-md-2 control-label">
          Action
        </label>
        <div className="col-md-10">
          <RadioGroup
            name="Action"
            selectedValue={this.props.valueAction}
            onChange={this.props.onChangeAction}
          >
            <div className="form-horizontal">
              <Input
                type="radio"
                label="Update rows"
                help="Overwrites data in the Sheet"
                wrapperClassName="col-sm-8"
                value="update"
                useRadioGroup={true}
              />
              <Input
                type="radio"
                label="Append rows"
                help="Add new data to the end of the Sheet"
                wrapperClassName="col-sm-8"
                value="append"
                useRadioGroup={true}
              />
            </div>
          </RadioGroup>
        </div>
      </div>
    );
  }
});
