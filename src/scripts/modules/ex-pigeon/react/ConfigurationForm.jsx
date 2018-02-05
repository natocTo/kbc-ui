import React, {PropTypes} from 'react';

import {FormGroup, FormControl, Form, ControlLabel, Col, Checkbox, HelpBlock, Accordion, Panel} from 'react-bootstrap';
import CsvDelimiterInput from '../../../react/common/CsvDelimiterInput';
import SaveButtons from '../../../react/common/SaveButtons';

export default React.createClass({

  propTypes: {
    requestedEmail: PropTypes.string.isRequired,
    incremental: PropTypes.bool.isRequired,
    delimiter: PropTypes.string.isRequired,
    enclosure: PropTypes.string.isRequired,
    primaryKey: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired,
    localState: PropTypes.object.isRequired
  },

  onChangeDelimiter(value) {
    this.props.onChange('delimiter', value);
  },

  onChangeEnclosure(e) {
    this.props.onChange('enclosure', e.target.value);
  },

  onChangeIncremental() {
    this.props.onChange('incremental', !this.props.incremental);
  },

  renderButtons() {
    if (this.props.requestedEmail) {
      return (
        <div className="text-right">
          <SaveButtons
            isSaving={this.props.localState.get('isSaving', false)}
            isChanged={this.props.localState.get('isChanged', false)}
            onSave={this.props.actions.editSave}
            onReset={this.props.actions.editReset}
          />
        </div>
      );
    }
  },

  render()  {
    return (
      <Accordion className="kbc-accordion">
          <Panel header="Import Settings" eventKey="1">
            <Form horizontal>
                {this.renderButtons()}
              <br/>
              <CsvDelimiterInput
                  placeholder="Field delimeter used in CSV files"
                  label="Delimiter"
                  labelClassName="col-sm-4"
                  wrapperClassName="col-sm-8"
                  value={this.props.delimiter}
                  onChange={this.onChangeDelimiter}
                  help={(
                      <span>Field delimiter used in CSV file. Default value is <code>,</code>. Use <code>\t</code> for tabulator.</span>)}
                  disabled={false}
              />
              <FormGroup>
                <Col componentClass={ControlLabel} sm={4}>
                  Enclosure
                </Col>
                <Col sm={8}>
                  <FormControl
                      type="text"
                      placeholder="Field enclosure used in CSV files"
                      value={this.props.enclosure}
                      onChange={this.onChangeEnclosure}
                  />
                  <HelpBlock>Field enclosure used in CSV file. Default value is <code>"</code>.</HelpBlock>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={4}>
                  Primary Key
                </Col>
                <Col sm={8}>
                  <FormControl
                      type="text"
                      placeholder="Primary key"
                      value={this.props.primaryKey}
                      onChange={this.onChangePrimaryKey}
                  />
                  <HelpBlock>Primary key</HelpBlock>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={4}>
                  Incremental
                </Col>
                <Col sm={8}>
                  <Checkbox
                      checked={this.props.incremental}
                      onChange={this.onChangeIncremental}>
                    Incremental load
                  </Checkbox>
                  <HelpBlock>If incremental load is turned on, table will be updated instead of rewritten. Tables with
                    primary key will update rows, tables without primary key will append rows.</HelpBlock>
                </Col>
              </FormGroup>
            </Form>
          </Panel>
        </Accordion>
    );
  }
});
