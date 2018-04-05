import React from 'react';

const styling = {
  // width: '100px',
  // height: '70px',
  background: 'RGBA(26, 26, 26, 1.00)',
  border: '1px solid black',
  color: 'black',
  cursor: 'move',
  transition: 'all 0.5s',
  // margin: '15px',
  position: 'relative',
  borderRadius: '2px',
  touchAction: 'none'
};

const hoverOverlayStyling = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: '"Oswald", sans-serif',
  height: '100%',
  width: '100%',
  // background: 'RGBA(0,0,0,0.3)',
  color: 'white',
  opacity: '0.3'
};

/*****************************/

const SongModePatternView = ({
  patternName,
  patternHeight,
  patternWidth,
  arrayOfPositions,
  triggerWidth,
  triggerHeight
}) => {
  return (
    <div
      id={patternName}
      style={{
        ...styling,
        height: patternHeight + 'px',
        width: patternWidth + 'px'
      }}
    >
      <div style={hoverOverlayStyling}>{patternName}</div>
      {arrayOfPositions.map((pos, index) => {
        return (
          <div
            key={index}
            style={{
              background: 'red',
              position: 'absolute',
              top: pos.top * 100 + '%',
              left: pos.left * 100 + '%',
              width: triggerWidth * 100 + '%',
              height: triggerHeight * 100 + '%',
              borderRadius: '2px',
              opacity: '0.3'
            }}
          />
        );
      })}
    </div>
  );
};

export default SongModePatternView;
