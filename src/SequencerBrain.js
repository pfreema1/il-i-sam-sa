import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SequencerBrain.css';
import Slider from 'material-ui/Slider';

class SequencerBrain extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="sequencer-brain__container">
        <div className="sequencer-brain__icon-and-name-container">
          <div className="sequencer-brain__icon-container">ico</div>
          <div className="sequencer-brain__name-container">kicksky daisy</div>
        </div>
        <div className="sequencer-brain__controls-container">
          <div className="sequencer-brain__mute-solo-container">
            <div className="sequencer-brain__mute-button">M</div>
            <div className="sequencer-brain__solo-button">S</div>
          </div>
          <div className="sequencer-brain__sliders sequencer-brain__pan-slider-container">
            <Slider
              min={0}
              max={100}
              step={1}
              style={{ height: 40 }}
              axis="y"
              defaultValue={0.5}
            />
          </div>
          <div className="sequencer-brain__sliders sequencer-brain__pitch-slider-container">
            <Slider
              min={0}
              max={100}
              step={1}
              style={{ height: 40 }}
              axis="y"
              defaultValue={0.5}
            />
          </div>
          <div className="sequencer-brain__sliders sequencer-brain__vol-slider-container">
            <Slider
              min={0}
              max={100}
              step={1}
              style={{ height: 40 }}
              axis="y"
              defaultValue={0.5}
            />
          </div>
        </div>
      </div>
    );
  }
}

/*****************************/

export default SequencerBrain;
