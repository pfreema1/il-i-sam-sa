import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tone from 'tone';
import Trigger from './Trigger';
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

    //set up synth
    this.synth = new Tone.PluckSynth().toMaster();

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
    this.synth.triggerAttackRelease('C2', '48i', time);
  };

  render() {
    return (
      <SequencerWrapper>
        <PlayButton onClick={this.playButtonClicked} />
        {this.props.triggers.map((elem, index) => {
          return (
            <Trigger
              id={index}
              key={index}
              barStarter={index % 4 === 0 ? true : false}
            />
          );
        })}
      </SequencerWrapper>
    );
  }
}

/*****************************/

Sequencer.propTypes = {};

const mapStateToProps = state => {
  return {
    triggers: state.triggers
  };
};

export default connect(mapStateToProps)(Sequencer);
