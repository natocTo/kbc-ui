import React from 'react';
import ApplicationStore from '../../../stores/ApplicationStore';
import filesize from 'filesize';
import string from 'underscore.string';
import LimitsOverQuota from './LimitsOverQuota';
import Expiration from './Expiration';
import StorageBucketsStore from '../../components/stores/StorageBucketsStore';
import InstalledComponentStore from '../../components/stores/InstalledComponentsStore';
import TransformationsStore from '../../transformations/stores/TransformationsStore';
import componentsActions from '../../components/InstalledComponentsActionCreators';
import storageActions from '../../components/StorageActionCreators';
import Deprecation from './Deprecation';
import createStoreMixin from '../../../react/mixins/createStoreMixin';
import { showWizardModalFn, getAchievedLesson } from '../../guide-mode/stores/ActionCreators.js';
import lessons from '../../guide-mode/WizardLessons';
import { List } from 'immutable';

export default React.createClass({
  mixins: [createStoreMixin(InstalledComponentStore, TransformationsStore, StorageBucketsStore)],

  getStateFromStores() {
    return {
      buckets: StorageBucketsStore.getAll(),
      installedComponents: InstalledComponentStore.getAll(),
      transformations: TransformationsStore.getAllTransformations()
    };
  },

  componentDidMount() {
    componentsActions.loadComponents();
    if (ApplicationStore.hasCurrentProjectFeature('transformation-mysql')) {
      componentsActions.loadComponentConfigsData('transformation');
    }
    storageActions.loadBuckets();
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
      projectHasGuideModeOn: ApplicationStore.getKbcVars().get('projectHasGuideModeOn')
    };
  },

  openLessonModal(lessonNumber) {
    showWizardModalFn(lessonNumber);
  },

  countOverviewComponent() {
    let componentCount = 0;
    if (this.state.projectHasGuideModeOn) {
      componentCount++;
    }
    componentCount += this.state.limitsOverQuota.count();
    componentCount += this.state.installedComponents.filter(function(component) {
      return !!component.get('flags', List()).contains('deprecated');
    }).count();
    if (ApplicationStore.hasCurrentProjectFeature('transformation-mysql')) {
      componentCount += this.state.transformations.filter(function(bucket) {
        return bucket.filter(function(transformation) {
          return transformation.get('backend') === 'mysql';
        }).count() > 0;
      }).count();
    }
    if (this.state.buckets.filter((bucket) => bucket.get('backend') === 'mysql').count() > 0) {
      componentCount++;
    }
    if (typeof this.state.expires !== 'undefined') {
      componentCount += 1;
    }
    return componentCount;
  },
  renderLessonList() {
    return (
      Object.keys(lessons).map((lesson, key) => {
        return (
          <li key={key}>
            <a
              className={'guide-lesson-link' + (getAchievedLesson() < key ? ' guide-lesson-link-locked' : '')}
              href="#" onClick={(e) => {
                e.preventDefault();
                this.openLessonModal(key + 1);
              }}
            >
              Lesson {key + 1} - {lessons[key + 1].title}
            </a>
            {getAchievedLesson() < key && <i className="guide-lock fa fa-lock"/>}
          </li>
        );
      })
    );
  },


  render() {
    return (
      <div className="container-fluid">
        {this.countOverviewComponent() > 0  &&
        <div className="kbc-overview-component-container">
          {this.state.projectHasGuideModeOn &&
          <div className="kbc-overview-component">
            <div className="guide-desk-container">
              <div className="guide-desk">
                <h2>Welcome to Keboola Connection</h2>
                <h1>Guide Mode</h1>
                <div className="row">
                  <div className="col-xs-4">
                    <ul>
                        {this.renderLessonList()}
                    </ul>
                  </div>
                  <div className="col-xs-5">
                    <p>
                      Learn all you need to know about Keboola Connection &ndash; our powerful and safe environment for working with data.
                      <br/>
                      <br/>
                      These lessons will walk you through the basic steps of creating a project: from loading and manipulating data to visualizing the results and automating the whole process.
                      <br/>
                      <br/>
                      Feel free to switch the Guide Mode off at any time. If needed, bring it back by going to <a
                        className="guide-link" href={ApplicationStore.getProjectPageUrl('settings')}>Settings
                      > Guide Mode.</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          }
          <Expiration expires={this.state.expires}/>
          <LimitsOverQuota limits={this.state.limitsOverQuota}/>
          <Deprecation
            buckets={this.state.buckets}
            components={this.state.installedComponents}
            transformations={this.state.transformations}
          />
        </div>
        }
        <div className="kbc-main-content">

          <div className="table kbc-table-border-vertical kbc-layout-table kbc-overview">
            <div className="tbody">
              <div className="tr">
                <div className="td">
                  <h2>Storage</h2>
                  <h3 style={ {fontSize: '42px'} }>{filesize(this.state.data.sizeBytes)}</h3>
                  <h3 style={ {fontSize: '24px'} }>{string.numberFormat(this.state.data.rowsCount)} <small>Rows</small>
                  </h3>
                </div>
                <div className="td">
                  <h2>Access</h2>
                  <h3 style={ {fontSize: '42px'} }>{this.state.tokens.get('adminCount')} <small style={ {fontSize: '16px'} }>Users</small>
                  </h3>
                  <h3 style={ {fontSize: '24px'} }>{this.state.tokens.get('totalCount') - this.state.tokens.get('adminCount')} <small>API Tokens</small>
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
