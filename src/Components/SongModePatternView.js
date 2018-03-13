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

const SongModePatternView = ({ patternName }) => {
  return (
    <div id={patternName} style={styling}>
      {patternName}
    </div>
  );
};

export default SongModePatternView;
