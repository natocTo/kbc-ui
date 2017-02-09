import React, {PropTypes} from 'react';
import _ from 'underscore';

import EmptyState from '../../../../components/react/components/ComponentEmptyState';
import immutableMixin from '../../../../../react/mixins/ImmutableRendererMixin';

import {Accordion} from 'react-bootstrap';
import {Panel} from 'react-bootstrap';
import {Grid} from 'react-bootstrap';
import {Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    tableExists: PropTypes.bool.isRequired,
    table: PropTypes.object,
    dataPreview: PropTypes.object,
    dataPreviewError: PropTypes.string
  },

  mixins: [immutableMixin],

  render() {
    if (this.props.dataPreviewError) {
      return (
        <EmptyState>
          {this.props.dataPreviewError}
        </EmptyState>
      );
    }

    if (!this.props.tableExists || !this.isDataPreview()) {
      return (
        <EmptyState>
          No Data.
        </EmptyState>
      );
    }
    const {table} = this.props;
    const columnMetadata = table.get('columnMetadata');
    const parsedColumnMetadata = this.parseColumnMetadata(columnMetadata);
    const renderedMetadata = this.renderParsedMetadata(parsedColumnMetadata);

    return (
      <div>
        {renderedMetadata}
      </div>
    );
  },

  renderParsedMetadata(parsedMetadata) {
    return parsedMetadata.map((dat, datkey) => {
      const formatKeys = Object.keys(dat.formats);
      const colData = formatKeys.map((formatKey) => {
        return (
          <Col md={Math.ceil(12 / formatKeys.length)}>
            {
              this.renderFormatOutput(formatKey, dat.formats[formatKey])
            }
          </Col>
        );
      });
      return (
        <Accordion>
          <Panel header={datkey}>
            <Grid>
              <Row className="show-grid">
                {colData}
              </Row>
            </Grid>
          </Panel>
        </Accordion>
      );
    });
  },

  renderFormatOutput(formatKey, formatData) {
    const formats = formatData.map((keyValue) => {
      return this.renderKeyValue(keyValue);
    });
    return (
        <div>
          <h4>{formatKey}</h4>
          {formats}
        </div>
    );
  },

  renderKeyValue(keyValue) {
    return (
      <div>
        <label>{keyValue.key}</label>
        <span>{keyValue.value}</span>
      </div>
    );
  },

  parseColumnMetadata(columnMetadata) {
    return columnMetadata.map((cmd, cmdkey) => {
      var curFormat = 'general';
      var output = {};
      output.name = cmdkey;
      output.formats = {};
      cmd.forEach(function(cmdrow) {
        var splitKey = cmdrow.get('key').split('.');
        var formatsIndex = splitKey.indexOf('formats');
        var remainingKey = null;
        var newFormat = null;
        if (formatsIndex > 0) {
          newFormat = splitKey[formatsIndex + 1];
          if (newFormat !== curFormat) {
            curFormat = newFormat;
          }
          remainingKey = _.tail(splitKey, formatsIndex + 2).join('.');
        } else {
          curFormat = 'general';
          remainingKey = _.tail(splitKey, 1).join('.');
        }
        if (!_.has(output.formats, curFormat)) {
          output.formats[curFormat] = [];
        }
        output.formats[curFormat].push(
          {
            key: remainingKey,
            value: cmdrow.get('value')
          }
        );
      });
      return output;
    });
  },

  isDataPreview() {
    return !_.isEmpty(this.props.dataPreview.toJS());
  }
});
