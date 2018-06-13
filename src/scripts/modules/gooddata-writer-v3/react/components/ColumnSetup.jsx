import React, {PropTypes} from 'react';
import {FormControl, Form, FormGroup, Col, ControlLabel} from 'react-bootstrap';
import ColumnDefinition, {DataTypes, Types} from '../../helpers/ColumnDefinition';
// import ReactSelect from 'react-select';

export default React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    column: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired
  },

  render() {
    const {column} = this.props;
    const {fields} = ColumnDefinition(column);

    return (
      <Form horizontal>
        {fields.type.show && this.renderSelectGroup(
           'Type',
           'type',
           Object.keys(Types)
        )}

        {fields.title.show && this.renderInputGroup('Title', 'title')}

        {fields.dataType.show && this.renderSelectGroup(
           'Data Type',
           'dataType',
           Object.keys(DataTypes),
           fields.dataTypeSize.show && this.renderInput('dataTypeSize')
        )}
        {fields.schemaReference.show && this.renderSelectGroup(
           'Reference',
           'schemaReference',
           this.props.context.referencableTables
        )}
        {fields.reference.show && this.renderSelectGroup(
           'Reference',
           'reference',
           this.props.context.referencableColumns
        )}
        {fields.sortLabel.show && this.props.context.sortLabelsColumns[column.id] &&
         this.renderSelectGroup(
           'Sort Label',
           'sortLabel',
           this.props.context.sortLabelsColumns[column.id]
         )}
      </Form>
    );
  },

  renderControlGroup(label, control) {
    return (
      <FormGroup  bsSize="small" className="col-sm-12">
        <Col sm={4} componentClass={ControlLabel}>{label}</Col>
        <Col sm={8}>
          {control}
        </Col>
      </FormGroup>
    );
  },

  renderSelectGroup(label, fieldName, options, extraControl) {
    const {disabled, column} = this.props;
    return this.renderControlGroup(
      label,
      <FormControl
        componentClass="select"
        type="select"
        autosize={false}
        clearable={false}
        value={column[fieldName]}
        options={options}
        onChange={e => this.onChangeColumn(fieldName, e.target.value)}
        disabled={disabled}>
        <option value=""/>
        {options.map(op => <option value={op} key={op}>{op}</option>)}
      </FormControl>,
      extraControl
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
    const newColumn = ColumnDefinition(this.props.column)
      .updateColumn(property, value)
      .column;
    this.props.onChange(newColumn);
  }
});
