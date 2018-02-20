import React, { Component } from 'react';
import { connect } from 'react-redux';
import Trigger from './Trigger';

import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import './react-contextmenu.css';
import { Card } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
import TriggerEditNote from './TriggerEditNote';
// import Synthesizer from './Synthesizer';

const CardStyle = {
  width: '100vw',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0 10px 0'
};

const slicedTriggerContainerStyle = {
  backgroundColor: '#A7C9DF',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between'
};

/*****************************/

class Sequencer extends Component {
  synth: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      isEditingTrigger: false,
      menuItemClicked: null
    };
  }

  handleMenuItemClick = (e, data) => {
    console.log('data from menuitemclick:  ', data);
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

  returnSlicedTrigger = trigger => {
    //get how many triggers we need
    let numOfSlicedTriggers =
      this.props.sequencers[this.props.sequencerId].triggers[trigger.id]
        .sliceAmount * 4;
    let arrayOfWidths = [];
    let heightStr = 100 / (numOfSlicedTriggers / 2) - 5 + '%';
    for (let i = 0; i < numOfSlicedTriggers; i++) {
      arrayOfWidths.push(Math.floor(100 / (numOfSlicedTriggers / 2)) - 5);
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
        <div style={slicedTriggerContainerStyle}>
          {arrayOfWidths.map((width, index) => {
            let widthStr = width + '%';
            let newId = 'slice-' + index;

            return (
              <Trigger
                sequencerId={this.props.sequencerId}
                id={newId}
                key={trigger.id}
                width={widthStr}
                height={heightStr}
                barStarter={trigger.id % 4 === 0 ? true : false}
              />
            );
          })}
        </div>
      </ContextMenuTrigger>
    );
  };

  render() {
    let sequencerToRender = this.props.sequencers[this.props.sequencerId];

    return (
      <Card containerStyle={CardStyle}>
        {sequencerToRender.triggers.map(trigger => {
          if (trigger.isSliced) {
            return this.returnSlicedTrigger(trigger);
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
                  key={trigger.id}
                  width={'100%'}
                  height={'100%'}
                  barStarter={trigger.id % 48 === 0 ? true : false}
                />
              </ContextMenuTrigger>
            );
          }
        })}

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
          <MenuItem onClick={this.handleSliceMenuItemClick} data={{ item: 3 }}>
            slice
          </MenuItem>
        </ContextMenu>

        <Dialog
          open={this.state.isEditingTrigger}
          onRequestClose={this.handleDialogClose}
        >
          <Tabs initialSelectedIndex={this.state.menuItemClicked}>
            <Tab label="note">
              <TriggerEditNote />
            </Tab>
            <Tab label="velocity">velocity stuff here</Tab>
            <Tab label="duration">duration stuff here</Tab>
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
