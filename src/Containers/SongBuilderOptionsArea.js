import React, { Component } from 'react';
import { connect } from 'react-redux';
import SongBuilderOptionsAreaView from '../Components/SongBuilderOptionsAreaView';

class SongBuilderOptionsArea extends Component {
  handleRemoveFromSongClick = () => {
    this.props.dispatch({ type: 'REMOVE_PATTERN_FROM_SONG' });
  };

  handleMakeUniqueClick = () => {};

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
