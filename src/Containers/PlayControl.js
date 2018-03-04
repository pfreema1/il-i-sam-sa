import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlayControlView from '../Components/Toolbar/PlayControlView';
import './PlayControl.css';

class PlayControl extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handlePlayButtonClick = () => {
    this.props.dispatch({ type: 'PLAY_BUTTON_CLICKED' });
  };

  handleStopButtonClick = () => {
    this.props.dispatch({ type: 'STOP_BUTTON_CLICKED' });
  };

  handlePlayBackModeClick = playBackMode => {
    this.props.dispatch({
      type: 'PLAYBACK_MODE_CLICKED',
      playBackMode: playBackMode
    });
  };

  render() {
    return (
      <PlayControlView
        handlePlayButtonClick={this.handlePlayButtonClick}
        handleStopButtonClick={this.handleStopButtonClick}
        handlePlayBackModeClick={this.handlePlayBackModeClick}
        isPlaying={this.props.isPlaying}
        playBackMode={this.props.playBackMode}
      />
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    isPlaying: state.isPlaying,
    playBackMode: state.playBackMode
  };
};

export default connect(mapStateToProps)(PlayControl);
