import React, { Component } from 'react';
import Tone from 'tone';
import Button from './Button';
import PlayButton from './PlayButton';

class Synth extends Component {
  constructor(props) {
    super(props);

    this.synth = new Tone.FMSynth().toMaster();

    this.state = { isPlaying: false };
  }

  componentDidMount() {
    //schedule a few notes
    Tone.Transport.schedule(this.triggerSynth, 0);
    Tone.Transport.schedule(this.triggerSynth, '0:4');
    Tone.Transport.schedule(this.triggerSynth, '0:2:2.5');

    //set the transport to repeat
    Tone.Transport.loopEnd = '1m';
    Tone.Transport.loop = false;
  }

  handleMouseDown = e => {
    this.synth.triggerAttack(e.target.id);
  };

  handleMouseRelease = e => {
    this.synth.triggerRelease();
  };

  triggerSynth = time => {
    console.log('running triggerSynth with time:  ', time);

    this.synth.triggerAttackRelease('C2', '8n', time);
  };

  handlePlayButton = e => {
    this.setState({ isPlaying: !this.state.isPlaying }, () => {
      if (this.state.isPlaying) {
        Tone.Transport.start('+0.1');
      } else {
        Tone.Transport.stop();
      }
    });
  };

  render() {
    return (
      <div>
        <Button
          id="A3"
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseRelease}
        >
          A
        </Button>
        <Button
          id="B3"
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseRelease}
        >
          B
        </Button>
        <Button
          id="C3"
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseRelease}
        >
          C
        </Button>
        <Button
          id="D3"
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseRelease}
        >
          D
        </Button>
        <Button
          id="E3"
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseRelease}
        >
          E
        </Button>

        <PlayButton id="Play" onMouseDown={this.handlePlayButton} />
      </div>
    );
  }
}

export default Synth;
