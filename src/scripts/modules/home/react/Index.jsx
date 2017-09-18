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
import { showWizardModalFn } from '../../try-mode/stores/ActionCreators.js';
import lessons from '../../try-mode/WizardLessons';

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
      expires: ApplicationStore.getCurrentProject().get('expires'),
      projectHasTryModeOn: ApplicationStore.getKbcVars().get('projectHasTryModeOn')
    };
  },

  openLessonModal(lessonNumber) {
    showWizardModalFn(lessonNumber);
  },

  render() {
    return (
        <div>
          <div className="kbc-overview-component">
            {this.state.projectHasTryModeOn === 1 &&
            <div className="try-desk-container">
              <div className="try-desk">
                <h2>Welcome to Keboola Connection</h2>
                <h1>Try Mode</h1>
                <div className="row">
                  <div className="col-xs-4">
                    <ul>
                      {Object.keys(lessons).map((lesson, key) => {
                        return (
                            <li>
                              <a className="try-lesson-link" href="#" onClick={
                      (e) => {
                        e.preventDefault();
                        this.openLessonModal(key + 1);
                      }
                  }>{key + 1}. Lesson - {lessons[key + 1].title}</a>
                            </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="col-xs-5">
                    <p>
                      Here you can learn everything you need to know about Keboola Connection before you actually start
                      using
                      it.
                      <br/>
                      <br/>
                      The following lessons are designed to walk you through the basic steps of creating a project.
                      <br/>
                      <br/>
                      Feel free to switch Try Mode off at any time. You can always bring it back by going to <a
                        className="try-link" href={ApplicationStore.getProjectPageUrl('settings-users')}>Settings
                      > Try Mode.</a>
                    </p>
                  </div>

                </div>
              </div>
            </div>
            }
          </div>

          <Expiration expires={this.state.expires}/>
          <LimitsOverQuota limits={this.state.limitsOverQuota}/>
          <Deprecation components={this.state.installedComponents}/>

          <div className="kbc-main-content">
            <div className="table kbc-table-border-vertical kbc-layout-table kbc-overview">
              <div className="tbody">
                <div className="tr">
                  <div className="td">
                    <h2>Storage</h2>
                    <h3 style={ {fontSize: '42px'} }>{filesize(this.state.data.sizeBytes)}</h3>
                    <h3 style={ {fontSize: '24px'} }>{string.numberFormat(this.state.data.rowsCount)}
                      <small>Rows</small>
                    </h3>
                  </div>
                  <div className="td">
                    <h2>Access</h2>
                    <h3 style={ {fontSize: '42px'} }>{this.state.tokens.get('adminCount')}
                      <small style={ {fontSize: '16px'} }>Users</small>
                    </h3>
                    <h3 style={ {fontSize: '24px'} }>{this.state.tokens.get('totalCount') - this.state.tokens.get('adminCount')}
                      <small>API Tokens</small>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
});
