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

  handleSliderChange = (id, e, newValue) => {
    if (id === 'panSlider') {
      this.setState({ panVal: newValue });
    } else if (id === 'pitchSlider') {
      this.setState({ pitchVal: newValue });
    } else if (id === 'volumeSlider') {
      this.setState({ volumeVal: newValue });
    }
  };

  handleDragStop = (id, e) => {
    // use state values to get current values when sliding stoppped
    if (id === 'panSlider') {
      this.props.dispatch({
        type: 'CHANGE_PAN_VALUE',
        newPanVal: this.state.panVal,
        sequencerId: this.props.sequencerId
      });
    } else if (id === 'pitchSlider') {
      this.props.dispatch({
        type: 'CHANGE_PITCH_VALUE',
        newPitchVal: this.state.pitchVal,
        sequencerId: this.props.sequencerId
      });
    } else if (id === 'volumeSlider') {
      this.props.dispatch({
        type: 'CHANGE_VOLUME_VALUE',
        newVolumeVal: this.state.volumeVal,
        sequencerId: this.props.sequencerId
      });
    }
  };

  handleMuteClick = e => {
    this.props.dispatch({
      type: 'CHANGE_MUTE_STATE',
      sequencerId: this.props.sequencerId
    });
    //maybe set state should be based on props instead of local state?
    this.setState(prevState => {
      return {
        isMuted: !prevState.isMuted
      };
    });
  };

  handleSoloClick = e => {
    this.props.dispatch({
      type: 'CHANGE_SOLO_STATE',
      sequencerId: this.props.sequencerId
    });

    this.setState(prevState => {
      return {
        isSoloed: !prevState.isSoloed
      };
    });
  };

  render() {
    let { panVal, volumeVal, pitchVal } = this.state;

    return (
      <div className="sequencer-brain__container">
        <div className="sequencer-brain__name-container">
          {this.props.sequencerId}
        </div>
        <div className="sequencer-brain__controls-container">
          <div className="sequencer-brain__mute-solo-container">
            <div
              onClick={this.handleMuteClick}
              className={
                'sequencer-brain__mute-button ' +
                (this.state.isMuted ? 'sequencer-brain__button--active' : '')
              }
            >
              M
            </div>
            <div
              onClick={this.handleSoloClick}
              className={
                'sequencer-brain__solo-button ' +
                (this.state.isSoloed ? 'sequencer-brain__button--active' : '')
              }
            >
              S
            </div>
          </div>
          <Tooltip title={'Pan:  ' + panVal} trigger="mouseenter">
            <div className="sequencer-brain__sliders sequencer-brain__pan-slider-container">
              <Slider
                id="panSlider"
                min={-1}
                max={1}
                step={0.1}
                style={{ height: 45 }}
                axis="y"
                defaultValue={0}
                onChange={this.handleSliderChange.bind(null, 'panSlider')}
                onDragStop={this.handleDragStop.bind(null, 'panSlider')}
                value={this.state.panVal}
              />
            </div>
          </Tooltip>
          <Tooltip title={'Pitch:  ' + pitchVal} trigger="mouseenter">
            <div className="sequencer-brain__sliders sequencer-brain__pitch-slider-container">
              <Slider
                id="pitchSlider"
                min={-12}
                max={12}
                step={1}
                style={{ height: 45 }}
                axis="y"
                defaultValue={0}
                onChange={this.handleSliderChange.bind(null, 'pitchSlider')}
                onDragStop={this.handleDragStop.bind(null, 'pitchSlider')}
                value={this.state.pitchVal}
              />
            </div>
          </Tooltip>
          <Tooltip title={'Volume:  ' + volumeVal} trigger="mouseenter">
            <div className="sequencer-brain__sliders sequencer-brain__vol-slider-container">
              <Slider
                id="volumeSlider"
                min={-80}
                max={0}
                step={1}
                style={{ height: 45 }}
                axis="y"
                defaultValue={0}
                onChange={this.handleSliderChange.bind(null, 'volumeSlider')}
                onDragStop={this.handleDragStop.bind(null, 'volumeSlider')}
                value={this.state.volumeVal}
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
