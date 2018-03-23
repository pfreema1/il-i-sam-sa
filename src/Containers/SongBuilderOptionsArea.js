import React, { Component } from 'react';
import { connect } from 'react-redux';
import SongBuilderOptionsAreaView from '../Components/SongBuilderOptionsAreaView';

class SongBuilderOptionsArea extends Component {
  handleRemoveFromSongClick = () => {
    this.props.dispatch({ type: 'REMOVE_PATTERN_FROM_SONG' });
  };

  handleMakeUniqueClick = () => {
    this.props.dispatch({
      type: 'BLANK_PATTERN_ADDED',
      switchToPattern: false
    });
    this.props.dispatch({
      type: 'COPIED_PATTERN_ADDED',
      patternToCopy: this.props.songModeSelectedPattern
    });
    this.props.dispatch({ type: 'MAKE_UNIQUE_IN_SONG_MODE' });
  };

  handleGoToPatternClick = () => {
    this.props.dispatch({ type: 'GO_TO_PATTERN_CLICKED' });
  };

  render() {
    const { songModeSelectedPattern } = this.props;

    return (
      <SongBuilderOptionsAreaView
        songModeSelectedPattern={songModeSelectedPattern}
        handleRemoveFromSongClick={this.handleRemoveFromSongClick}
        handleMakeUniqueClick={this.handleMakeUniqueClick}
        handleGoToPatternClick={this.handleGoToPatternClick}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    songModeSelectedPattern: state.songModeSelectedPattern
  };
}

export default connect(mapStateToProps)(SongBuilderOptionsArea);
