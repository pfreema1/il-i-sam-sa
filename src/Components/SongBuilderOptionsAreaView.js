import React from 'react';

const styling = {
  // background: 'lightgrey',
  height: '80px',
  width: '800px',
  display: 'flex',
  // flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '40px',
  border: '1px solid RGBA(130, 130, 123, 0.5)',
  borderRadius: '2px'
};

const buttonStyling = {
  // padding: '15px',
  // border: '1px solid black',
  background: 'lightblue',
  borderRadius: '2px',
  width: '200px',
  height: '50px',
  fontFamily: "'Oswald', sans-serif",
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  marginLeft: '50px',
  marginRight: '50px'
};

const removeFromSongStyling = {
  background: 'RGBA(241, 144, 115, 1.00)'
};

const makeUniqueStyling = {
  background: 'RGBA(147, 122, 118, 1.00)'
};

const goToPattern = {
  background: 'RGBA(166, 166, 164, 1.00)'
};

/*****************************/

const SongBuilderOptionsAreaView = ({
  songModeSelectedPattern,
  handleRemoveFromSongClick,
  handleMakeUniqueClick,
  handleGoToPatternClick
}) => {
  return (
    <div>
      {songModeSelectedPattern !== null ? (
        <div>
          <h1
            style={{ fontFamily: "'Oswald', sans-serif", textAlign: 'center' }}
          >
            {songModeSelectedPattern}
          </h1>
          <div style={styling}>
            <div
              style={{ ...buttonStyling, ...removeFromSongStyling }}
              onClick={handleRemoveFromSongClick}
            >
              REMOVE FROM SONG
            </div>
            <div
              style={{ ...buttonStyling, ...makeUniqueStyling }}
              onClick={handleMakeUniqueClick}
            >
              MAKE UNIQUE
            </div>
            <div
              style={{ ...buttonStyling, ...goToPattern }}
              onClick={handleGoToPatternClick}
            >
              GO TO PATTERN
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SongBuilderOptionsAreaView;
