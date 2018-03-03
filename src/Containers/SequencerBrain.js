import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SequencerBrain.css';
import 'react-tippy/dist/tippy.css';
import SequencerBrainView from '../Components/SequencerBrain/SequencerBrainView';

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
    let { panVal, volumeVal, pitchVal, isMuted, isSoloed } = this.state;

    return (
      <SequencerBrainView
        sequencerId={this.props.sequencerId}
        handleMuteClick={this.handleMuteClick}
        isMuted={isMuted}
        handleSoloClick={this.handleSoloClick}
        isSoloed={isSoloed}
        panVal={panVal}
        handleSliderChange={this.handleSliderChange}
        handleDragStop={this.handleDragStop}
        pitchVal={pitchVal}
        volumeVal={volumeVal}
      />
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
