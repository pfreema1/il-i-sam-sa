import React, { Component } from 'react';
import Tone from 'tone';
import Button from './Button';
import PlayButton from './PlayButton';
import styled from 'styled-components';

const SequencerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

class Sequencer extends Component {
  constructor(props) {
    super(props);

    this.bars = 4;
    this.buttonsPerBar = 4;
    this.numButtons = this.bars * this.buttonsPerBar;
    this.buttonArray = [];
    this.buttonInfo = {
      isSelected: false
    };

    //create array of buttons
    for (let i = 0; i < this.numButtons; i++) {
      this.buttonArray.push(this.defaultButtonInfo);
    }

    //set up synth
    this.synth = new Tone.PluckSynth().toMaster();
    //schedule a few notes
    // Tone.Transport.schedule(this.triggerSynth, 0);
    // Tone.Transport.schedule(this.triggerSynth, '192i');
    // Tone.Transport.schedule(this.triggerSynth, '384i');
    // Tone.Transport.schedule(this.triggerSynth, '576i');

    //set the transport to repeat
    Tone.Transport.loopEnd = '1m';
    Tone.Transport.loop = true;

    this.state = { isPlaying: false };
  }

  playButtonClicked = () => {
    this.setState({ isPlaying: !this.state.isPlaying }, () => {
      if (this.state.isPlaying) {
        Tone.Transport.start('+0.1');
      } else {
        Tone.Transport.stop();
      }
    });
  };

  triggerSynth = time => {
    this.synth.triggerAttackRelease('C2', '8n', time);
  };

  handleTrigger = triggeredId => {
    let iValue = parseInt(triggeredId) * 48;
    Tone.Transport.schedule(this.triggerSynth, iValue + 'i');
  };

  render() {
    return (
      <SequencerWrapper>
        <PlayButton onClick={this.playButtonClicked} />
        {this.buttonArray.map((elem, index) => {
          return (
            <Button
              id={index}
              key={index}
              barStarter={index % 4 === 0 ? true : false}
              handleTrigger={this.handleTrigger}
            />
          );
        })}
      </SequencerWrapper>
    );
  }
}

Sequencer.propTypes = {};

export default Sequencer;
