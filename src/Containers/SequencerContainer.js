import React, { Component } from 'react';
import { connect } from 'react-redux';
import Trigger from '../Trigger';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import '../react-contextmenu.css';
import { Card } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
import TriggerEditNote from '../TriggerEditNote';
import DurationContainer from './DurationContainer';
import './SequencerContainer.css';
import Velocity from '../Velocity';
import NudgeContainer from './NudgeContainer';
import { VelocityComponent } from 'velocity-react';
import SequencerContextMenuComponent from '../Components/SequencerContextMenuComponent';
import TriggerEditDialogComponent from '../Components/TriggerEditDialogComponent';
import SequencerComponent from '../Components/SequencerComponent';
import TriggerWrapperComponent from '../Components/TriggerWrapperComponent';

/*****************************/

class SequencerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditingTrigger: false,
      menuItemClicked: null
    };
  }

  handleMenuItemClick = (e, data) => {
    let triggerBeingEditedId = data.attributes.id;

    this.setState({ isEditingTrigger: true, menuItemClicked: data.item });

    this.props.dispatch({
      type: 'EDITING_TRIGGER',
      isEditingTrigger: true,
      triggerBeingEditedId: triggerBeingEditedId,
      sequencerBeingEditedId: this.props.sequencerId
    });
  };

  handleDialogClose = () => {
    this.setState({ isEditingTrigger: false });

    this.props.dispatch({
      type: 'EDITING_TRIGGER',
      isEditingTrigger: false,
      triggerBeingEditedId: null,
      sequencerBeingEditedId: null
    });
  };

  handleSliceMenuItemClick = (e, data) => {
    console.log('sliced!');

    let triggerBeingEditedId = data.attributes.id;

    this.props.dispatch({
      type: 'TRIGGER_SLICED',
      isEditingTrigger: false,
      triggerBeingEditedId: triggerBeingEditedId,
      sequencerBeingEditedId: this.props.sequencerId
    });
  };

  handleUnSliceMenuItemClick = (e, data) => {
    let triggerBeingEditedId = data.attributes.id;

    this.props.dispatch({
      type: 'TRIGGER_UNSLICED',
      triggerBeingEditedId: triggerBeingEditedId,
      sequencerBeingEditedId: this.props.sequencerId
    });
  };

  returnSlicedTriggers = trigger => {
    //get how many triggers we need
    let numOfSlicedTriggers =
      this.props.sequencers[this.props.sequencerId].triggers[trigger.id]
        .sliceAmount * 4;
    let arrayOfWidths = [];
    let heightStr = 100 / (numOfSlicedTriggers / 2) + '%';

    for (let i = 0; i < numOfSlicedTriggers; i++) {
      arrayOfWidths.push(Math.floor(100 / (numOfSlicedTriggers / 2)));
    }

    return (
      <ContextMenuTrigger
        key={trigger.id}
        id={'triggerMenu' + this.props.sequencerId}
        //this is passed in as data to MenuItem
        attributes={{ id: trigger.id }}
        collect={props => props}
        holdToDisplay={1000}
      >
        <div className="sequencer__sliced-trigger-container">
          {arrayOfWidths.map((width, index) => {
            let widthStr = width + '%';

            return (
              <Trigger
                sequencerId={this.props.sequencerId}
                parentTriggerId={trigger.id}
                id={index}
                key={index}
                width={widthStr}
                height={heightStr}
                isSlicee={true}
                barStarter={index % 4 === 0 ? true : false}
              />
            );
          })}
        </div>
      </ContextMenuTrigger>
    );
  };

  render() {
    let sequencerToRender = this.props.sequencers[this.props.sequencerId];

    if (!sequencerToRender) {
      return null;
    }

    return (
      <SequencerComponent
        sequencerId={this.props.sequencerId}
        sequencerToRender={sequencerToRender}
        handleMenuItemClick={this.handleMenuItemClick}
        handleSliceMenuItemClick={this.handleSliceMenuItemClick}
        handleUnSliceMenuItemClick={this.handleUnSliceMenuItemClick}
        isEditingTrigger={this.state.isEditingTrigger}
        handleDialogClose={this.handleDialogClose}
        menuItemClicked={this.state.menuItemClicked}
        returnSlicedTriggers={this.returnSlicedTriggers}
      />
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    sequencers: state.sequencers
  };
};

export default connect(mapStateToProps)(SequencerContainer);
