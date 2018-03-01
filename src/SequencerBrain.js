import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SequencerBrain.css';
import Slider from 'material-ui/Slider';
import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';

class SequencerBrain extends Component {
  constructor(props) {
    super(props);

    let sequencerRef = this.props.sequencers[this.props.sequencerId];

    this.state = {
      panVal: sequencerRef.panRef.pan.value,
      volumeVal: sequencerRef.volumeRef.volume.value,
      pitchVal: sequencerRef.pitchRef._pitch,
      isMuted: sequencerRef.isMuted,
      isSoloed: sequencerRef.isSoloed
    };

    debugger;
  }

  //get the values from the store
  /*
      default volume = 0
      -volumeRef.mute = true
      default pan = 0
      -pan range: -1 hard left, 1 hard right
      default pitch = 0
      -pitch range: -12 to 12
    */

  componentWillReceiveProps(nextProps) {}

  handleSliderChange = (e, newValue) => {
    if (e.target.id === 'panSlider') {
    } else if (e.target.id === 'pitchSlider') {
    } else if (e.target.id === 'volumeSlider') {
    }
  };

  handleDragStop = e => {
    // use state values to get current values when sliding stoppped
    if (e.target.id === 'panSlider') {
    } else if (e.target.id === 'pitchSlider') {
    } else if (e.target.id === 'volumeSlider') {
    }
  };

  render() {
    let { panVal, volumeVal, pitchVal } = this.state;

    return (
      <div className="sequencer-brain__container">
        <div className="sequencer-brain__icon-and-name-container">
          <div className="sequencer-brain__name-container">
            {this.props.sequencerId}
          </div>
        </div>
        <div className="sequencer-brain__controls-container">
          <div className="sequencer-brain__mute-solo-container">
            <div className="sequencer-brain__mute-button">M</div>
            <div className="sequencer-brain__solo-button">S</div>
          </div>
          <Tooltip
            title={'Pan:  ' + panVal}
            trigger="mouseenter"
            followCursor="true"
          >
            <div className="sequencer-brain__sliders sequencer-brain__pan-slider-container">
              <Slider
                id="panSlider"
                min={-1}
                max={1}
                step={0.1}
                style={{ height: 45 }}
                axis="y"
                defaultValue={0}
                onChange={this.handleSliderChange}
              />
            </div>
          </Tooltip>
          <Tooltip
            title={'Pitch:  ' + pitchVal}
            trigger="mouseenter"
            followCursor="true"
          >
            <div className="sequencer-brain__sliders sequencer-brain__pitch-slider-container">
              <Slider
                id="pitchSlider"
                min={-12}
                max={12}
                step={1}
                style={{ height: 45 }}
                axis="y"
                defaultValue={0}
                onChange={this.handleSliderChange}
              />
            </div>
          </Tooltip>
          <Tooltip
            title={'Volume:  ' + volumeVal}
            trigger="mouseenter"
            followCursor="true"
          >
            <div className="sequencer-brain__sliders sequencer-brain__vol-slider-container">
              <Slider
                id="volumeSlider"
                min={-100}
                max={0}
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

const mapStateToProps = state => {
  return {
    sequencers: state.sequencers
  };
};

export default connect(mapStateToProps)(SequencerBrain);
