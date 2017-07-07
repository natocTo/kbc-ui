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
import { showWizardModalFn } from '../../try-mode/WizardStore';
import lessons from '../../try-mode/WizardLessons.json';

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

  openLessonModal(lessonNumber) {
    showWizardModalFn(lessonNumber);
  },

  render() {
    return (
      <div className="container-fluid kbc-main-content">
        <Expiration expires={this.state.expires} />
        <Deprecation components={this.state.installedComponents} />
        <LimitsOverQuota limits={this.state.limitsOverQuota}/>
        <div className="jumbotron">
          <div className="well">
            <h1>Welcome to Keboola Connection Try Mode!</h1>
            <div>
              <p>
                Here you can learn everything you need to know about Keboola Connection before you actually start using
                it. The following lessons are designed to walk you through the basic steps of creating a project.
                <br/>
                Feel free to switch Try Mode off at any time. You can always bring it back by going to <a href="#">Settings > Try Mode.</a>
              </p>
              <ul>
              {Object.keys(lessons).map((lesson, key) => {
                return (
                  <li>
                    <button className="btn btn-link" onClick={
                      (e) => {
                        e.preventDefault();
                        this.openLessonModal(key + 1);
                      }
                  }>{key + 1}. Lesson - {lessons[key + 1].title}</button>
                  </li>
                );
              })}
              </ul>
            </div>
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
