import React, { Component } from 'react';
import { connect } from 'react-redux';
import SongModePatternView from '../Components/SongModePatternView';

const styling = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '30vh',
  background: 'RGBA(55, 57, 62, 1.00)'
};

class SongModePatternSelectContainer extends Component {
  render() {
    const { patternsArr } = this.props;
    return (
      <div style={styling}>
        {patternsArr.map((pattern, index) => (
          <SongModePatternView key={index} patternName={pattern} />
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patternsArr: state.patternsArr
  };
}

export default connect(mapStateToProps)(SongModePatternSelectContainer);
