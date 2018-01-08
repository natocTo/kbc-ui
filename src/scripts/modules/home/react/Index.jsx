import React from 'react';
import ApplicationStore from '../../../stores/ApplicationStore';
import filesize from 'filesize';
import underscoreString from 'underscore.string';
import LimitsOverQuota from './LimitsOverQuota';
import Expiration from './Expiration';
import StorageBucketsStore from '../../components/stores/StorageBucketsStore';
import InstalledComponentStore from '../../components/stores/InstalledComponentsStore';
import TransformationsStore from '../../transformations/stores/TransformationsStore';
import componentsActions from '../../components/InstalledComponentsActionCreators';
import storageActions from '../../components/StorageActionCreators';
import DeprecatedComponents from './DeprecatedComponents';
import DeprecatedTransformations from './DeprecatedTransformations';
import DeprecatedStorage from './DeprecatedStorage';
import createStoreMixin from '../../../react/mixins/createStoreMixin';
import { showGuideModalFn } from '../../guide-mode/stores/ActionCreators.js';
import GuideStore from '../../guide-mode/stores/GuideStore';
import GuideDesk from '../../guide-mode/react/GuideDesk';
import lessons from '../../guide-mode/GuideLessons';
import { List } from 'immutable';

export default React.createClass({
  mixins: [
    createStoreMixin(InstalledComponentStore, TransformationsStore, StorageBucketsStore, GuideStore)
  ],

  getStateFromStores() {
    const currentProject = ApplicationStore.getCurrentProject();
    const tokenStats = ApplicationStore.getTokenStats();
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
      tokens: tokenStats,
      projectId: currentProject.get('id'),
      data: {
        sizeBytes: sizeBytes,
        rowsCount: rowsCount
      },
      limitsOverQuota: ApplicationStore.getLimitsOverQuota(),
      expires: ApplicationStore.getCurrentProject().get('expires'),
      buckets: StorageBucketsStore.getAll(),
      installedComponents: InstalledComponentStore.getAll(),
      transformations: TransformationsStore.getAllTransformations(),
      projectHasGuideModeOn: ApplicationStore.getKbcVars().get('projectHasGuideModeOn'),
      guideModeAchievedLessonId: GuideStore.getAchievedLessonId()
    };
  },

  componentDidMount() {
    componentsActions.loadComponents();
    if (ApplicationStore.hasCurrentProjectFeature('transformation-mysql')) {
      componentsActions.loadComponentConfigsData('transformation');
    }
    storageActions.loadBuckets();
  },

  openLessonModal(lessonNumber) {
    showGuideModalFn(lessonNumber);
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

  render() {
    return (
      <div className="container-fluid">
        {this.countOverviewComponent() > 0  &&
        <div className="kbc-overview-component-container">
          {this.state.projectHasGuideModeOn && (
            <GuideDesk
              linkToSettings={ApplicationStore.getProjectPageUrl('settings')}
              lessons={lessons}
              achievedLessonId={this.state.guideModeAchievedLessonId}
              openLessonModalFn={this.openLessonModal}
            />
          )}
          <Expiration expires={this.state.expires}/>
          <LimitsOverQuota limits={this.state.limitsOverQuota}/>

          <DeprecatedStorage
            buckets={this.state.buckets}
          />
          <DeprecatedComponents
            components={this.state.installedComponents}
          />
          <DeprecatedTransformations
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
                  <h3 style={ {fontSize: '24px'} }>{underscoreString.numberFormat(this.state.data.rowsCount)} <small>Rows</small>
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

