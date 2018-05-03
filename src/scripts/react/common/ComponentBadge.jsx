import React, {PropTypes} from 'react';

export default React.createClass({
  propTypes: {
    flag: PropTypes.string.isRequired
  },

  render() {
    return (
      <div className={'badge badge-component-item' + ' badge-component-item-' + this.props.flag}>
        {this.renderBadge(this.props.flag)}
      </div>
    );
  },

  renderBadge(flag) {
    if (flag === '3rdParty') {
      return (<span>3<sup>rd</sup> party</span>);
    }
    if (flag === 'excludeFromNewList') {
      return 'Alpha';
    }
    if (flag === 'dataIn') {
      return (<span><i className="fa fa-cloud-download fa-fw"/> IN</span>);
    }
    if (flag === 'dataOut') {
      return (<span><i className="fa fa-cloud-upload fa-fw"/> OUT</span>);
    }
    if (flag === 'responsibility') {
      return ('KEBOOLA');
    }
    if (flag === 'fee') {
      return (<span><i className="fa fa-money fa-fw"/></span>);
    }
    if (flag === 'redshiftOnly') {
      return (<span><i className="fa fa-database fa-fw"/></span>);
    }
    if (flag === 'fullAccess') {
      return (<span><i className="fa fa-key fa-fw"/></span>);
    }
    if (flag === 'license') {
      return (<span><i className="fa fa-file-text-o fa-fw"/></span>);
    }
    if (flag === 'deprecated') {
      return (<span><i className="fa fa-exclamation-triangle fa-fw"/><i className="fa fa-clock-o fa-fw"/></span>);
    }
  }
});
