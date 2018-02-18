//@flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tone from 'tone';
import Trigger from './Trigger';
import PlayButton from './PlayButton';
import type { TriggerObject, DispatchObject } from './types';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import './react-contextmenu.css';
import { Card } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
import TriggerEditNote from './TriggerEditNote';

const CardStyle = {
  width: '100vw',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0 10px 0'
};

/*****************************/
type State = {
  isEditingTrigger: boolean,
  menuItemClicked: number
};

type Props = {
  triggers: TriggerObject[],
  dispatch: (obj: DispatchObject) => void
};

/*****************************/

class Sequencer extends Component<State, Props> {
  synth: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      isEditingTrigger: false,
      menuItemClicked: null
    };
  }

  playButtonClicked = () => {
    this.props.dispatch({ type: 'PLAY_BUTTON_CLICKED' });
  };

  handleMenuItemClick = (e, data) => {
    console.log('data from menuitemclick:  ', data);
    let triggerBeingEditedId = data.attributes.id;

    this.setState({ isEditingTrigger: true, menuItemClicked: data.item });

    this.props.dispatch({
      type: 'EDITING_TRIGGER',
      isEditingTrigger: true,
      triggerBeingEditedId: triggerBeingEditedId
    });
  };

  handleDialogClose = () => {
    this.setState({ isEditingTrigger: false });

    this.props.dispatch({
      type: 'EDITING_TRIGGER',
      isEditingTrigger: false,
      triggerBeingEditedId: null
    });
  };

  render() {
    return (
      <Card containerStyle={CardStyle}>
        <PlayButton onClick={this.playButtonClicked} />

        {this.props.triggers.map(elem => {
          return (
            <ContextMenuTrigger
              key={elem.id}
              id="triggerMenu"
              //this is passed in as data to MenuItem
              attributes={{ id: elem.id }}
              collect={props => props}
              holdToDisplay={1000}
            >
              <Trigger
                id={elem.id}
                key={elem.id}
                barStarter={elem.id % 4 === 0 ? true : false}
              />
            </ContextMenuTrigger>
          );
        })}

        <ContextMenu id="triggerMenu">
          <MenuItem onClick={this.handleMenuItemClick} data={{ item: 0 }}>
            note
          </MenuItem>
          <MenuItem onClick={this.handleMenuItemClick} data={{ item: 1 }}>
            velocity
          </MenuItem>
          <MenuItem onClick={this.handleMenuItemClick} data={{ item: 2 }}>
            duration
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
    triggers: state.triggers
  };
};

export default connect(mapStateToProps)(Sequencer);
