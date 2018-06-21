import React, { PropTypes } from 'react';
import immutableMixin from 'react-immutable-render-mixin';
import { Input } from './../../../../react/common/KbcBootstrap';

export default React.createClass({
  mixins: [immutableMixin],

  propTypes: {
    value: PropTypes.shape({
      host: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      database: PropTypes.string.isRequired,
      warehouse: PropTypes.string.isRequired
    }),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  render() {
    const {onChange, value} = this.props;
    return (
      <div className="form-horizontal">
        <Input
          type="text"
          label="Host"
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8"
          value={value.host}
          onChange={e => onChange({host: e.target.value})}
          placeholder="https://example.com"
          disabled={this.props.disabled}
          help="help blablabla"/>
        <Input
          type="text"
          label="User"
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8"
          value={value.user}
          onChange={e => onChange({user: e.target.value})}
          placeholder=""
          disabled={this.props.disabled}
          help="help blablabla"/>
        <Input
          type="password"
          label="Password"
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8"
          value={value.password}
          onChange={e => onChange({password: e.target.value})}
          placeholder=""
          disabled={this.props.disabled}
          help="help blablabla"/>
        <Input
          type="text"
          label="Database"
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8"
          value={value.database}
          onChange={e => onChange({database: e.target.value})}
          placeholder="tba"
          disabled={this.props.disabled}
          help="help blablabla"/>
        <Input
          type="text"
          label="Warehouse"
          labelClassName="col-xs-4"
          wrapperClassName="col-xs-8"
          value={value.warehouse}
          onChange={e => onChange({warehouse: e.target.value})}
          placeholder="tba"
          disabled={this.props.disabled}
          help="help blablabla"/>
      </div>
    );
  }
});
