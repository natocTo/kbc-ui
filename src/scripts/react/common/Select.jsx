import React, {PropTypes} from 'react';
import Select from 'react-select';
import Immutable from 'immutable';

export default React.createClass({
  propTypes: {
    value: PropTypes.any,
    emptyStrings: PropTypes.bool,
    allowCreate: PropTypes.bool,
    ignoreCase: PropTypes.bool,
    multi: PropTypes.bool,
    matchProp: PropTypes.string,
    labelKey: PropTypes.string,
    valueKey: PropTypes.string,
    matchPos: PropTypes.string,
    help: PropTypes.any,
    delimiter: PropTypes.string,
    trimMultiCreatedValues: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    optionRenderer: PropTypes.func,
    options: PropTypes.array,
    filterOption: PropTypes.func
  },

  getDefaultProps() {
    return {
      trimMultiCreatedValues: false,
      value: '',
      emptyStrings: false,
      allowCreate: false,
      multi: false,
      ignoreCase: true,
      matchProp: 'any',
      labelKey: 'label',
      valueKey: 'value',
      delimiter: ','
    };
  },

  isOptionUnique({ option, options, labelKey, valueKey }) {
    const {trimMultiCreatedValues} = this.props;
    return options
      .filter((existingOption) => {
        const la = existingOption[labelKey];
        const lb = option[labelKey];
        const va = existingOption[valueKey];
        const vb = option[valueKey];

        if (trimMultiCreatedValues) {
          return la.trim() === lb.trim() || va.trim() === vb.trim();
        } else {
          return la === lb || va === vb;
        }
      })
      .length === 0;
  },

  valueRenderer(value) {
    if (this.props.emptyStrings) {
      if (value[this.props.valueKey] === '%_EMPTY_STRING_%') {
        return (<small><code>[empty string]</code></small>);
      }
      if (value[this.props.valueKey] === '%_SPACE_CHARACTER_%') {
        return (<small><code>[space character]</code></small>);
      }
    }
    // display spaces
    return value[this.props.labelKey].replace(/\s/g, '\xa0');
  },

  filterOptions(options, filterString, values) {
    var exclude = values;
    var opts;
    if (!options) {
      opts = [];
    } else {
      opts = options;
    }
    if (this.props.emptyStrings) {
      var emptyString = {};
      emptyString[this.props.valueKey] = '%_EMPTY_STRING_%';
      emptyString[this.props.labelKey] = (<code>[empty string]</code>);
      if (!opts.find(o => o[this.props.valueKey] === '%_EMPTY_STRING_%')) {
        opts.push(emptyString);
      }

      var spaceCharacter = {};
      spaceCharacter[this.props.valueKey] = '%_SPACE_CHARACTER_%';
      spaceCharacter[this.props.labelKey] = (<code>[space character]</code>);
      if (!opts.find(o => o[this.props.valueKey] === '%_SPACE_CHARACTER_%')) {
        opts.push(spaceCharacter);
      }
    }

    var filterOption = function(op) {
      if (this.props.multi && exclude && Immutable.fromJS(exclude).toMap().find(function(item) {
        return item.get('value') === op.value;
      }, op)) {
        return false;
      }
      if (this.props.filterOption) {
        return this.props.filterOption.call(this, op, filterString);
      }
      var valueTest = String(op.value);
      var labelTest = String(op.label);
      var filterStr = filterString;
      if (this.props.ignoreCase) {
        valueTest = valueTest.toLowerCase();
        labelTest = labelTest.toLowerCase();
        filterStr = filterString.toLowerCase();
      }
      return !filterStr || (this.props.matchPos === 'start') ? (
        (this.props.matchProp !== 'label' && valueTest.substr(0, filterStr.length) === filterStr) ||
        (this.props.matchProp !== 'value' && labelTest.substr(0, filterStr.length) === filterStr)
      ) : (
        (this.props.matchProp !== 'label' && valueTest.indexOf(filterStr) >= 0) ||
        (this.props.matchProp !== 'value' && labelTest.indexOf(filterStr) >= 0)
      );
    };
    return (opts || []).filter(filterOption, this);
  },

  render() {
    if (this.props.allowCreate) {
      return (
        <span>
          <Select.Creatable
            isOptionUnique={this.isOptionUnique}
            {...this.props}
            value={this.props.value.toJS ? this.mapValues(this.props.value.toJS()) : this.mapValues(this.props.value)}
            valueRenderer={this.valueRenderer}
            filterOptions={this.filterOptions}
            onChange={this.onChange}
            options={this.props.options || []}
          />
          {this.props.help ? (<span className="help-block">{this.props.help}</span>) : null}
        </span>
      );
    } else {
      return (
        <span>
          <Select
            {...this.props}
            value={this.props.value.toJS ? this.mapValues(this.props.value.toJS()) : this.mapValues(this.props.value)}
            valueRenderer={this.valueRenderer}
            filterOptions={this.filterOptions}
            onChange={this.onChange}
          />
          {this.props.help ? (<span className="help-block">{this.props.help}</span>) : null}
        </span>
      );
    }
  },

  onChange(selected) {
    const {trimMultiCreatedValues} = this.props;
    if (this.props.multi) {
      this.props.onChange(Immutable.fromJS(selected.map(function(value) {
        if (value.value === '%_EMPTY_STRING_%') {
          return '';
        }
        if (value.value === '%_SPACE_CHARACTER_%') {
          return ' ';
        }
        if (trimMultiCreatedValues) {
          return value.value.trim();
        }
        return value.value;
      })));
    } else {
      selected ? this.props.onChange(selected.value) : this.props.onChange('');
    }
  },

  mapValues(value) {
    return this.props.multi
      ? this.mapValuesMulti(value)
      : this.mapValuesSingle(value);
  },

  mapValuesSingle(value) {
    const props = this.props;
    if (value) {
      let selectedOption = null;
      if (this.props.options) {
        selectedOption = this.props.options.find(function(option) {
          return option[props.valueKey] === value;
        });
      }
      if (selectedOption) {
        return selectedOption;
      }
      return {
        label: value,
        value: value
      };
    } else {
      return null;
    }
  },

  mapValuesMulti(values) {
    const props = this.props;
    if (values) {
      return values.map(function(value) {
        if (value === '') {
          return {
            label: '%_EMPTY_STRING_%',
            value: '%_EMPTY_STRING_%'
          };
        } else if (value === ' ') {
          return {
            label: '%_SPACE_CHARACTER_%',
            value: '%_SPACE_CHARACTER_%'
          };
        } else {
          let selectedOption = null;
          if (props.options) {
            selectedOption = props.options.find(function(option) {
              return option[props.valueKey] === value;
            });
          }
          if (selectedOption) {
            return selectedOption;
          }
          return {
            label: value,
            value: value
          };
        }
      });
    } else {
      return [];
    }
  }

});
