import React from 'react';

const styling = {
  background: 'lightgrey',
  height: '200px',
  width: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

const buttonStyling = {
  padding: '15px',
  border: '1px solid black',
  background: 'lightblue'
};

const SongBuilderOptionsAreaView = ({
  songModeSelectedPattern,
  handleRemoveFromSongClick,
  handleMakeUniqueClick,
  handleGoToPatternClick
}) => {
  return (
    <div style={styling}>
      {songModeSelectedPattern !== '' ? (
        <div>
          <h1>{songModeSelectedPattern}</h1>
          <div style={buttonStyling} onClick={handleRemoveFromSongClick}>
            remove from song
          </div>
          <div style={buttonStyling} onClick={handleMakeUniqueClick}>
            make unique
          </div>
          <div style={buttonStyling} onClick={handleGoToPatternClick}>
            go to pattern
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SongBuilderOptionsAreaView;
