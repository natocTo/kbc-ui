import React, {PropTypes} from 'react';
import {FormControl, Form, FormGroup, Col, ControlLabel} from 'react-bootstrap';
import makeColumnDefinition from '../../helpers/makeColumnDefinition';
import {Types} from '../../helpers/constants';

// import ReactSelect from 'react-select';

export default React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    column: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    showAdvanced: PropTypes.bool
  },

  render() {
    const {column} = this.props;
    const {fields} = makeColumnDefinition(column);

    return (
      <Form horizontal>
        {fields.dbName.show && this.renderInputGroup('BigQuery Column Name', 'dbName')}
        {fields.type.show && this.renderSelectGroup(
           'Data Type',
           'type',
           Object.keys(Types)
        )}

      </Form>
    );
  },

  renderControlGroup(label, control, extraControl) {
    return (
      <FormGroup  bsSize="small" className="col-sm-12">
        <Col sm={4} componentClass={ControlLabel}>
          <span className="pull-right">{label}</span>
        </Col>
        <Col sm={8}>
          {
            extraControl ?
            [
              <Col sm={8} key="control" style={{padding: '0'}}>
                {control}
              </Col>,
              <Col sm={4} key="extracontrol" style={{paddingRight: '0'}}>
                {extraControl}
              </Col>
            ]
            : control
          }
        </Col>
      </FormGroup>
    );
  },

  renderSelectGroup(label, fieldName, options, extraControl) {
    return this.renderControlGroup(
      label,
      this.renderSelectInput(fieldName, options),
      extraControl
    );
  },

  renderSelectInput(fieldName, options, settings = {}) {
    const {disabled, column} = this.props;
    return (
      <FormControl
        componentClass="select"
        type="select"
        autosize={false}
        clearable={false}
        value={column[fieldName]}
        options={options}
        onChange={e => this.onChangeColumn(fieldName, e.target.value)}
        disabled={disabled}>
        {!settings.strict && <option value=""/>}
        {options.map(op => <option value={op} key={op}>{op}</option>)}
      </FormControl>
    );
  },

  renderInput(fieldName) {
    const {disabled, column} = this.props;
    return (
      <FormControl
        type="text"
        disabled={disabled}
        onChange={e => this.onChangeColumn(fieldName, e.target.value)}
        value={column[fieldName]}
      />);
  },

  renderInputGroup(label, fieldName) {
    return this.renderControlGroup(
      label,
      this.renderInput(fieldName)
    );
  },

  onChangeColumn(property, value) {
    const newColumn = makeColumnDefinition(this.props.column)
      .updateColumn(property, value)
      .column;
    this.props.onChange(newColumn);
  }
});
