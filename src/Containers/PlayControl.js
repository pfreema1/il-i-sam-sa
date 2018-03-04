import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlayControlView from '../Components/PlayControlView';
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

  handlePlayModeClick = playMode => {
    this.props.dispatch({ type: 'PLAY_MODE_CLICKED', playMode: playMode });
  };

  render() {
    return (
      <PlayControlView
        handlePlayButtonClick={this.handlePlayButtonClick}
        handleStopButtonClick={this.handleStopButtonClick}
        handlePlayModeClick={this.handlePlayModeClick}
        isPlaying={this.props.isPlaying}
        playMode={this.props.playMode}
      />
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    isPlaying: state.isPlaying,
    playMode: state.playMode
  };
};

export default connect(mapStateToProps)(PlayControl);
