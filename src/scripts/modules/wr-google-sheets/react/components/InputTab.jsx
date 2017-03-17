import React, {PropTypes} from 'react';
import SapiTableSelector from '../../../components/react/components/SapiTableSelector';

export default React.createClass({
  propTypes: {
    onSelect: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired
  },

  render() {
    return (
      <div className="form-horizontal">
        <div className="row">
          <div className="form-group">
            <label className="col-md-2 control-label">
              Input Table
            </label>
            <div className="col-md-10">
              <SapiTableSelector
                onSelectTableFn={this.props.onSelect}
                placeholder="Select..."
                value={this.props.value}
                allowCreate={false}
              />
              <span className="help-block">
              Select source table from Storage
            </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
});