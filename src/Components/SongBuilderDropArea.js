import React from 'react';
import SongModePatternView from './SongModePatternView';

const styling = {
  height: '150px',
  width: '70vw',
  border: '5px solid black',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const SongBuilderDropArea = ({ songArr }) => {
  return (
    <div style={styling}>
      {songArr.map((pattern, index) => {
        return <SongModePatternView key={index} patternName={pattern} />;
      })}
    </div>
  );
};

export default SongBuilderDropArea;
