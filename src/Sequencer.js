import React, { Component } from 'react';
import { connect } from 'react-redux';
import Trigger from './Trigger';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import './react-contextmenu.css';
import { Card } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
import TriggerEditNote from './TriggerEditNote';
import Duration from './Duration';
import './Sequencer.css';
import Velocity from './Velocity';
import Nudge from './Nudge';
import SequencerBrain from './SequencerBrain';
import { VelocityComponent } from 'velocity-react';

const CardParentStyle = {
  width: '100vw',
  minWidth: '950px'
};

const CardContainerStyle = {
  width: '100vw',
  minWidth: '950px',

  padding: '10px 0 10px 0'
};

/*****************************/

class Sequencer extends Component {
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
      <Card containerStyle={CardContainerStyle} style={CardParentStyle}>
        <VelocityComponent
          runOnMount={true}
          animation={'transition.slideLeftIn'}
          duration={1000}
        >
          <div>
            <SequencerBrain />

            <div className="sequencer__trigger-wrapper">
              {sequencerToRender.triggers.map(trigger => {
                if (trigger.isSliced) {
                  return this.returnSlicedTriggers(trigger);
                } else {
                  return (
                    <ContextMenuTrigger
                      key={trigger.id}
                      id={'triggerMenu' + this.props.sequencerId}
                      //this is passed in as data to MenuItem
                      attributes={{ id: trigger.id }}
                      collect={props => props}
                      holdToDisplay={1000}
                    >
                      <Trigger
                        sequencerId={this.props.sequencerId}
                        id={trigger.id}
                        parentTriggerId={null}
                        key={trigger.id}
                        width={'100%'}
                        height={'100%'}
                        isSlicee={false}
                        barStarter={trigger.id % 4 === 0 ? true : false}
                      />
                    </ContextMenuTrigger>
                  );
                }
              })}
            </div>
          </div>
        </VelocityComponent>

        <ContextMenu id={'triggerMenu' + this.props.sequencerId}>
          <MenuItem onClick={this.handleMenuItemClick} data={{ item: 0 }}>
            note
          </MenuItem>
          <MenuItem onClick={this.handleMenuItemClick} data={{ item: 1 }}>
            velocity
          </MenuItem>
          <MenuItem onClick={this.handleMenuItemClick} data={{ item: 2 }}>
            duration
          </MenuItem>
          <MenuItem onClick={this.handleMenuItemClick} data={{ item: 3 }}>
            nudge
          </MenuItem>
          <MenuItem onClick={this.handleSliceMenuItemClick} data={{ item: 4 }}>
            slice
          </MenuItem>
          <MenuItem
            onClick={this.handleUnSliceMenuItemClick}
            data={{ item: 5 }}
          >
            un-slice
          </MenuItem>
        </ContextMenu>

        <Dialog
          open={this.state.isEditingTrigger}
          onRequestClose={this.handleDialogClose}
          autoScrollBodyContent={true}
          className="dialog-root"
        >
          <Tabs initialSelectedIndex={this.state.menuItemClicked}>
            <Tab label="note">
              <TriggerEditNote />
            </Tab>
            <Tab label="velocity">
              <Velocity />
            </Tab>
            <Tab label="duration">
              <Duration />
            </Tab>
            <Tab label="Nudge">
              <Nudge />
            </Tab>
          </Tabs>
        </Dialog>
      </Card>
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    sequencers: state.sequencers
  };
};

export default connect(mapStateToProps)(Sequencer);
