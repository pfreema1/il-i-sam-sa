import React, { Component } from 'react';
import { connect } from 'react-redux';

const styling = {
  width: '100px',
  height: '70px',
  background: 'white',
  border: '1px solid black',
  color: 'black',
  cursor: 'move',
  transition: 'all 0.5s'
};

const selectedStyling = {
  background: 'yellow'
};

/*****************************/

class SongModePatternView extends Component {
  constructor(props) {
    super(props);

    // this.state = { isSelected: false };
  }

  handleClick = () => {
    // this.setState({ isSelected: !this.state.isSelected });
  };

  render() {
    let { patternName, songModeSelectedPattern } = this.props;

    //if this component is selectedpatternsequenceindex

    return (
      <div id={patternName} style={styling} onClick={this.handleClick}>
        {patternName}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    songModeSelectedPattern: state.songModeSelectedPattern,
    songModeSelectedPatternSequenceIndex:
      state.songModeSelectedPatternSequenceIndex
  };
};

export default connect(mapStateToProps)(SongModePatternView);
