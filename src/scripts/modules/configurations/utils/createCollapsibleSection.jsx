import React, {PropTypes} from 'react';
import SaveButtons from '../../../react/common/SaveButtons';
import { PanelGroup, Panel } from 'react-bootstrap';

export default (TitleComponent, InnerComponent, options = {}) => {
  return React.createClass({

    displayName: 'CollapsibleSection',

    propTypes: {
      disabled: PropTypes.bool,
      isComplete: PropTypes.bool,
      onSave: PropTypes.func,
      onChange: PropTypes.func,
      value: PropTypes.any
    },

    getInitialState() {
      return {
        isChanged: false,
        value: this.props.value,
        contentManuallyOpen: null
      };
    },

    isAccordionOpen() {
      if (this.state.contentManuallyOpen !== null) {
        return this.state.contentManuallyOpen;
      }

      if (this.state.isChanged) {
        return true;
      }

      return !this.props.isComplete;
    },

    accordionArrow() {
      if (this.isAccordionOpen()) {
        return (<span className="fa fa-fw fa-angle-down" />);
      }
      return (<span className="fa fa-fw fa-angle-right" />);
    },

    accordionHeader() {
      return (
        <span>
          <span className="table">
            <span className="tbody">
              <span className="tr">
                <span className="td">
                  <h4>
                    {this.accordionArrow()}
                    <TitleComponent value={options.includeSaveButtons ? this.state.value : this.props.value}/>
                  </h4>
                </span>
              </span>
            </span>
          </span>
        </span>
      );
    },

    renderButtons() {
      return (
        <div className="form-group">
          <div className="text-right">
            <SaveButtons
              isSaving={this.props.disabled}
              isChanged={this.state.isChanged}
              onSave={this.handleSave}
              onReset={() => this.setState({value: this.props.value, isChanged: false})}
            />
            <br />
          </div>
        </div>
      );
    },

    handleSave() {
      this.props.onSave(this.state.value).then(
        () => this.setState({isChanged: false})
      );
    },

    handleChange(diff) {
      const newValue = {...this.state.value, ...diff};
      this.setState({isChanged: true, value: newValue});
    },

    renderContent() {
      return (
        <InnerComponent
          disabled={this.props.disabled}
          onChange={options.includeSaveButtons ? this.handleChange : this.props.onChange}
          value={options.includeSaveButtons ? this.state.value : this.props.value}
        />);
    },

    render() {
      return (
        <PanelGroup
          accordion={true}
          className="kbc-accordion kbc-panel-heading-with-table"
          activeKey={this.isAccordionOpen() ? 'content' : ''}
          onSelect={activeTab => activeTab === 'content' && this.setState({contentManuallyOpen: !this.isAccordionOpen()})}
        >
          <Panel
            header={this.accordionHeader()}
            eventKey="content"
          >
            {options.includeSaveButtons && this.renderButtons()}
            {this.renderContent()}
          </Panel>
        </PanelGroup>
      );
    }

  });
};
