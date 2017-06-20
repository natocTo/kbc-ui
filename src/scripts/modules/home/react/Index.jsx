import React from 'react';
import ApplicationStore from '../../../stores/ApplicationStore';
import filesize from 'filesize';
import string from 'underscore.string';
import LimitsOverQuota from './LimitsOverQuota';
import Expiration from './Expiration';
// import ComponentStore from '../../components/stores/ComponentsStore';
import InstalledComponentStore from '../../components/stores/InstalledComponentsStore';
import componentsActions from '../../components/InstalledComponentsActionCreators';
// import InstalledComponentsApi from '../../components/InstalledComponentsApi';
import Deprecation from './Deprecation';
import createStoreMixin from '../../../react/mixins/createStoreMixin';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentStore)],

  getStateFromStores() {
    return {
      installedComponents: InstalledComponentStore.getAll()
    };
  },

  componentDidMount() {
    componentsActions.loadComponents();
  },

  getInitialState() {
    const currentProject = ApplicationStore.getCurrentProject(),
      tokenStats = ApplicationStore.getTokenStats();
    const limits = ApplicationStore.getLimits().find(function(group) {
      return group.get('id') === 'connection';
    }).get('limits');
    const sizeBytes = limits.find(function(limit) {
      return limit.get('id') === 'storage.dataSizeBytes';
    }).get('metricValue');
    const rowsCount = limits.find(function(limit) {
      return limit.get('id') === 'storage.rowsCount';
    }).get('metricValue');
    return {
      data: {
        sizeBytes: sizeBytes,
        rowsCount: rowsCount
      },
      tokens: tokenStats,
      projectId: currentProject.get('id'),
      limitsOverQuota: ApplicationStore.getLimitsOverQuota(),
      expires: ApplicationStore.getCurrentProject().get('expires')
    };
  },

  render() {
    return (
      <div className="container-fluid kbc-main-content">
        <Expiration expires={this.state.expires} />
        <Deprecation components={this.state.installedComponents} />
        <LimitsOverQuota limits={this.state.limitsOverQuota}/>
        <div className="jumbotron">
          <div className="well">
            <h1>Welcome, new user</h1>
            <p><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto assumenda doloremque, expedita
              facere facilis modi molestiae provident quibusdam veritatis vero. Dolorum facere fuga illum incidunt
              nesciunt reiciendis saepe, sed sequi.</span><span>Ab asperiores consectetur cupiditate dicta dolore,
              eligendi magni modi quo. Alias aut consequatur culpa cumque dignissimos doloremque dolorum ea,
              laudantium minus natus nihil perferendis porro provident repellendus sapiente tempore voluptatum?</span>
              <span>Ab at culpa cumque deleniti distinctio ducimus earum eligendi facilis fuga harum id, impedit incidunt
                itaque, laboriosam magnam maxime modi mollitia necessitatibus optio perspiciatis quibusdam quod ratione
                rem sapiente totam.</span>
              <ul>
                <li>1. Lesson - Composing</li>
                <li>2. Lesson - Transformation</li>
                <li>3. Lesson - Orchestration</li>
                <button className="btn btn-link" onClick={this.openLessonModal} data-lesson="1">open 1</button>
                <button className="btn btn-link" onClick={this.openLessonModal} data-lesson="2">open 2</button>
                <button className="btn btn-link" onClick={this.openLessonModal} data-lesson="3">open 3</button>

              </ul>
            </p>
          </div>
        </div>
        <div className="table kbc-table-border-vertical kbc-layout-table kbc-overview">
          <div className="tbody">
            <div className="tr">
              <div className="td">
                <h2>Storage</h2>
                <h3 style={ {fontSize: '42px'} }>{filesize(this.state.data.sizeBytes)}</h3>
                <h3 style={ {fontSize: '24px'} }>{string.numberFormat(this.state.data.rowsCount)} <small>Rows</small></h3>
              </div>
              <div className="td">
                <h2>Access</h2>
                <h3 style={ {fontSize: '42px'} }>{this.state.tokens.get('adminCount')} <small style={ {fontSize: '16px'} }>Users</small></h3>
                <h3 style={ {fontSize: '24px'} }>{this.state.tokens.get('totalCount') - this.state.tokens.get('adminCount')} <small>API Tokens</small></h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
