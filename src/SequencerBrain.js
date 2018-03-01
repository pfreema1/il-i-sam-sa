import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SequencerBrain.css';
import Slider from 'material-ui/Slider';
import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';

class SequencerBrain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sliderValArr: []
    };
  }

  componentDidMount() {
    //get the values from the store
  }

  handleSliderChange = (e, newValue) => {};

  render() {
    return (
      <div className="sequencer-brain__container">
        <div className="sequencer-brain__icon-and-name-container">
          <div className="sequencer-brain__name-container">
            {this.props.sampleName}
          </div>
        </div>
        <div className="sequencer-brain__controls-container">
          <div className="sequencer-brain__mute-solo-container">
            <div className="sequencer-brain__mute-button">M</div>
            <div className="sequencer-brain__solo-button">S</div>
          </div>
          <Tooltip title="Pan" trigger="mouseenter" followCursor="true">
            <div className="sequencer-brain__sliders sequencer-brain__pan-slider-container">
              <Slider
                id="panSlider"
                min={-100}
                max={100}
                step={1}
                style={{ height: 45 }}
                axis="y"
                defaultValue={0}
                onChange={this.handleSliderChange}
              />
            </div>
          </Tooltip>
          <Tooltip title="Pitch" trigger="mouseenter" followCursor="true">
            <div className="sequencer-brain__sliders sequencer-brain__pitch-slider-container">
              <Slider
                id="pitchSlider"
                min={-100}
                max={100}
                step={1}
                style={{ height: 45 }}
                axis="y"
                defaultValue={0}
                onChange={this.handleSliderChange}
              />
            </div>
          </Tooltip>
          <Tooltip title="Volume" trigger="mouseenter" followCursor="true">
            <div className="sequencer-brain__sliders sequencer-brain__vol-slider-container">
              <Slider
                id="volumeSlider"
                min={0}
                max={100}
                step={1}
                style={{ height: 45 }}
                axis="y"
                defaultValue={100}
                onChange={this.handleSliderChange}
              />
            </div>
          </Tooltip>
        </div>
      </div>
    );
  }
}

/*****************************/

export default SequencerBrain;
