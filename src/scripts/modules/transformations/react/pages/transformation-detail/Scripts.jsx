import React, {PropTypes} from 'react';
import Edit from './ScriptsEdit';
import Clipboard from '../../../../../react/common/Clipboard';
import SaveButtons from '../../../../../react/common/SaveButtons';

/* global require */
require('codemirror/mode/r/r');
require('codemirror/mode/python/python');

export default React.createClass({
  propTypes: {
    bucketId: PropTypes.string.isRequired,
    transformation: PropTypes.object.isRequired,
    scripts: PropTypes.string.isRequired,
    isEditingValid: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    onEditChange: PropTypes.func.isRequired,
    onEditSubmit: PropTypes.func.isRequired,
    isChanged: PropTypes.bool.isRequired
  },

  getScripts() {
    if (this.props.isChanged === false && this.props.scripts === '') {
      if (this.props.transformation.get('type') === 'r') {
        return '# This is a sample script.\n' +
          '# Adjust accordingly to your input mapping, output mapping\n' +
          '# and desired functionality.\n\n' +
          'input_data <- read.csv(file = "in/tables/input.csv");\n' +
          'result <- input_data\n' +
          'write.csv(result, file = "out/tables/output.csv", row.names = FALSE)';
      }
      if (this.props.transformation.get('type') === 'python') {
        return '# This is a sample script.\n' +
          '# Adjust accordingly to your input mapping, output mapping\n' +
          '# and desired functionality.\n\n' +
          'import csv\n' +
          '\n' +
          'with open(\'in/tables/input.csv\', mode=\'rt\', encoding=\'utf-8\') as in_file, open(\'out/tables/output.csv\', mode=\'wt\', encoding=\'utf-8\') as out_file:\n' +
          '    lazy_lines = (line.replace(\'\\0\', \'\') for line in in_file)\n' +
          '    reader = csv.DictReader(lazy_lines, lineterminator=\'\\n\')\n' +
          '    writer = csv.DictWriter(out_file, fieldnames=reader.fieldnames, lineterminator=\'\\n\')\n' +
          '    writer.writeheader()\n' +
          '\n' +
          '    for row in reader:\n' +
          '        # do something and write row\n' +
          '        writer.writerow(row)';
      }
      if (this.props.transformation.get('type') === 'openrefine') {
        return JSON.stringify([], null, 2);
      }
    }
    return this.props.scripts;
  },

  render() {
    return (
      <div>
        <h2 style={{lineHeight: '32px'}}>
          Scripts
          <small>
            <Clipboard text={this.props.scripts}/>
          </small>
          {this.renderButtons()}
        </h2>
        {this.scripts()}
      </div>
    );
  },

  renderButtons() {
    return (
      <span className="pull-right">
        <SaveButtons
          isSaving={this.props.isSaving}
          disabled={!this.props.isEditingValid}
          isChanged={this.props.isChanged}
          onSave={this.props.onEditSubmit}
          onReset={this.props.onEditCancel}
        />
      </span>
    );
  },

  scripts() {
    return (
      <Edit
        script={this.getScripts()}
        backend={this.props.transformation.get('type')}
        disabled={this.props.isSaving}
        onChange={this.props.onEditChange}
        />
    );
  }
});
