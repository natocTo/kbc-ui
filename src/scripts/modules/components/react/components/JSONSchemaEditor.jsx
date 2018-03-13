import React, {PropTypes} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';

/* global require */
require('./configuration-json.less');
require('json-editor');

export default React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    isChanged: PropTypes.bool,
    disableProperties: PropTypes.bool,
    disableCollapse: PropTypes.bool
  },

  getInitialState() {
    return {
      isFirstChange: true
    };
  },

  getDefaultProps() {
    return {
      readOnly: false,
      schema: Immutable.Map(),
      disableProperties: false,
      disableCollapse: false
    };
  },

  jsoneditor: null,

  componentWillReceiveProps(nextProps) {
    // workaround to update editor internal value after reset of this.props.value
    const resetValue = this.props.isChanged && !nextProps.isChanged;
    const resetReadOnly = this.props.readOnly !== nextProps.readOnly;
    const nextReadOnly = resetReadOnly ? nextProps.readOnly : this.props.readOnly;
    const nextValue = resetValue ? nextProps.value || this.props.value : this.props.value;
    if (!this.props.schema.equals(nextProps.schema) || resetValue || resetReadOnly) {
      this.initJsonEditor(nextValue, nextReadOnly);
    }
  },

  initJsonEditor(nextValue, nextReadOnly) {
    if (this.jsoneditor) {
      this.jsoneditor.destroy();
    }
    var options =       {
      schema: this.props.schema.toJS(),
      startval: nextValue.toJS(),
      theme: 'bootstrap3',
      iconlib: 'fontawesome4',
      custom_validators: [],
      ajax: false,
      disable_array_add: false,
      disable_array_delete: false,
      disable_array_delete_last_row: true,
      disable_array_reorder: true,
      disable_collapse: this.props.disableCollapse,
      disable_edit_json: true,
      disable_properties: this.props.disableProperties,
      no_additional_properties: false,
      object_layout: 'normal',
      required_by_default: false,
      show_errors: 'interaction'
    };

    if (nextReadOnly) {
      options.disable_array_add = true;
      options.disable_collapse = true;
      options.disable_edit_json = true;
      options.disable_properties = true;
      options.disable_array_delete = true;
    }

    // Custom validators must return an array of errors or an empty array if valid
    options.custom_validators.push(function(schema, value, path) {
      var errors = [];
      if (schema.type === 'string' && schema.template) {
        if (schema.template !== value) {
          errors.push({
            path: path,
            property: 'value',
            message: 'Value does not match schema template'
          });
        }
      }
      return errors;
    });

    var jsoneditor = new window.JSONEditor(
      this.refs.jsoneditor,
      options
    );
    this.jsoneditor = jsoneditor;
    var props = this.props;
    const self = this;

    // When the value of the editor changes, update the JSON output and TODO validation message
    jsoneditor.on('change', function() {
      var json = jsoneditor.getValue();
      // editor calls onChange after its init causing isChanged = true without any user input. This will prevent calling onChange after editors init
      if (!self.state.isFirstChange) {
        props.onChange(Immutable.fromJS(json));
      } else {
        self.setState({isFirstChange: false});
      }
    });

    if (nextReadOnly) {
      jsoneditor.disable();
    }
  },

  componentDidMount() {
    this.initJsonEditor(this.props.value, this.props.readOnly);
  },

  getCurrentValue() {
    return Immutable.fromJS(this.jsoneditor.getValue());
  },

  render() {
    return (
      <form autoComplete="off">
        <div ref="jsoneditor" />
      </form>
    );
  }

});
