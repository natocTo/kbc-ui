import { first, isEmpty } from 'underscore';
import React from 'react';
import ConfirmButtons from '../../../react/common/ConfirmButtons';
import {TabbedArea, TabPane} from '../../../react/common/KbcBootstrap';
import {Modal} from 'react-bootstrap';
import DropboxChooser from 'react-dropbox-chooser';
import { Button } from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    onHide: React.PropTypes.func.isRequired,
    show: React.PropTypes.bool.isRequired,
    canSaveConfig: React.PropTypes.func,
    saveConfig: React.PropTypes.func,
    cancelConfig: React.PropTypes.func,
    isSaving: React.PropTypes.bool,
    handleCsvSelectChange: React.PropTypes.func,
    selectedDropboxFiles: React.PropTypes.array
  },

  getInitialState() {
    return {
      activeTab: 'instant',
      name: '',
      link: ''
    };
  },

  handleCancelFunction() {
    this.props.cancelConfig();
    this.props.onHide();
  },

  handleSaveFunction() {
    if (this.state.activeTab === 'external') {
      const forceData = [{
        link: this.state.link,
        name: this.state.name + '.csv'
      }];
      this.props.saveConfig(forceData).then(() => this.props.onHide());
    }
    return this.props.saveConfig().then(() => this.props.onHide());
  },

  goToTab(tab) {
    this.setState({
      activeTab: tab
    });
  },

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Dropbox file selector</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TabbedArea activeKey={this.state.activeTab} onSelect={this.goToTab} animation={false}>
            <TabPane eventKey="instant" title="Choose From Dropbox">
              <div className="section well">
                <h3 className="section-heading">Please specify CSV file you want to upload to Keboola Storage.</h3>
                <div className="dropbox-button">
                  <DropboxChooser
                    appKey={'2is8jmvnwbchcyr'}
                    cancel={() => {}}
                    success={files => this.onSelectFiles(files)}
                    multiselect={false}
                    extensions={['.csv']} >
                    <Button bsStyle="success">
                      <i className={Array.isArray(this.props.selectedDropboxFiles) && this.props.selectedDropboxFiles.length > 0 ? 'fa fa-fw fa-check-circle-o' : 'fa fa-fw fa-dropbox' } /> Choose from Dropbox
                    </Button>

                  </DropboxChooser>
                </div>
                {Array.isArray(this.props.selectedDropboxFiles) && this.props.selectedDropboxFiles.length > 0 && <div><br /><div>Selected: {first(this.props.selectedDropboxFiles).name}</div></div>}
              </div>
            </TabPane>
            <TabPane eventKey="external" title="Manually Insert Link">
              {this.renderManualInsert()}
            </TabPane>
          </TabbedArea>
        </Modal.Body>
        <Modal.Footer>
          <ConfirmButtons
            saveLabel="Save"
            isSaving={this.props.isSaving}
            onCancel={this.handleCancelFunction}
            onSave={this.handleSaveFunction}
            isDisabled={this.canSave()}
          />
        </Modal.Footer>
      </Modal>
    );
  },

  canSave() {
    if (this.state.activeTab === 'external') {
      return isEmpty(this.state.name) || isEmpty(this.state.link);
    }
    return this.props.canSaveConfig();
  },

  renderManualInsert() {
    return (
      <div className="form form-horizontal">
        <div style={{'padding-top': '20px'}} className="form-group">
          <div className="col-xs-12">
            <label className="control-label col-xs-2">
              Link
            </label>
            <div className="col-xs-9">
              <input
                className="form-control"
                type="text"
                name="link"
                value={this.state.link}
                onChange={(e) => this.setState({link: e.target.value})}
                autoFocus={true}
              />
              <span className="help-block">
                Link to a csv file shared by a dropbox account
              </span>
            </div>
          </div>
          <div className="col-xs-12">
            <label className="control-label col-xs-2">
              Name
            </label>
            <div className="col-xs-9">
              <input
                className="form-control"
                type="text"
                name="name"
                value={this.state.name}
                onChange={(e) => this.setState({name: e.target.value})}
                autoFocus={true}
              />
              <span className="help-block">
                Name of the csv file and output table
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },

  onSelectFiles(values = []) {
    this.props.handleCsvSelectChange(values);
  }

});
