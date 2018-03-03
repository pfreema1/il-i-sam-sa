import React from 'react';

const MuteButtonComponent = ({ handleMuteClick, isMuted }) => (
  <div
    onClick={handleMuteClick}
    className={
      'sequencer-brain__mute-button ' +
      (isMuted ? 'sequencer-brain__button--active' : '')
    }
  >
    M
  </div>
);

export default MuteButtonComponent;
