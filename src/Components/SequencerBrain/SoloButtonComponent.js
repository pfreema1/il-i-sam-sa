import React from 'react';

const SoloButtonComponent = ({ handleSoloClick, isSoloed }) => (
  <div
    onClick={handleSoloClick}
    className={
      'sequencer-brain__solo-button ' +
      (isSoloed ? 'sequencer-brain__button--active' : '')
    }
  >
    S
  </div>
);

export default SoloButtonComponent;
