//@flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tone from 'tone';
import Trigger from './Trigger';
import PlayButton from './PlayButton';
import type { TriggerObject, DispatchObject } from './types';
import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
  SubMenu
} from 'react-contextmenu';
import './react-contextmenu.css';
import { Card } from 'material-ui/Card';

const CardStyle = {
  width: '100vw',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0 10px 0'
};

type Props = {
  triggers: TriggerObject[],
  dispatch: (obj: DispatchObject) => void
};

class Sequencer extends Component<Props> {
  synth: any;

  constructor(props) {
    super(props);

    //set up synth
    this.synth = new Tone.PluckSynth().toMaster();

    //set the transport to repeat
    Tone.Transport.loopEnd = '1m';
    Tone.Transport.loop = true;
  }

  playButtonClicked = () => {
    this.props.dispatch({ type: 'PLAY_BUTTON_CLICKED' });
  };

  triggerSynth = time => {
    this.synth.triggerAttackRelease('C2', '48i', time);
  };

  handleMenuItemClick = () => {};

  render() {
    return (
      <Card containerStyle={CardStyle}>
        <PlayButton onClick={this.playButtonClicked} />
        {this.props.triggers.map(elem => {
          return (
            <ContextMenuTrigger id="triggerMenu" holdToDisplay={1000}>
              <Trigger
                id={elem.id}
                key={elem.id}
                barStarter={elem.id % 4 === 0 ? true : false}
              />
            </ContextMenuTrigger>
          );
        })}

        <ContextMenu id="triggerMenu">
          <MenuItem onClick={this.handleMenuItemClick} data={{ item: 'note' }}>
            note
          </MenuItem>
          <MenuItem
            onClick={this.handleMenuItemClick}
            data={{ item: 'velocity' }}
          >
            velocity
          </MenuItem>
          <MenuItem
            onClick={this.handleMenuItemClick}
            data={{ item: 'duration' }}
          >
            duration
          </MenuItem>
        </ContextMenu>
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
