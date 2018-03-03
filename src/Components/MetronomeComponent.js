import React from 'react';

const MetronomeComponent = ({
  handleMetronomeIconClick,
  isMetronomeOn,
  handleOnDragStart,
  handleOnDrag,
  handleOnDragEnd,
  handleOnDragOver,
  bpm,
  handleMetronomeIncreaseClick,
  handleMetronomeDecreaseClick
}) => (
  <div className="metronome__container">
    <div
      onClick={handleMetronomeIconClick}
      className={
        'metronome__icon-container ' + (isMetronomeOn ? 'metronome-on' : '')
      }
    >
      []
    </div>
    <div className="metronome__control-container">
      <div
        draggable="true"
        onDragStart={handleOnDragStart}
        onDrag={handleOnDrag}
        onDragEnd={handleOnDragEnd}
        onDragOver={handleOnDragOver}
        className="metronome__bpm-readout"
      >
        {bpm + ' bpm'}
      </div>
      <div className="metronome__increase-decrease-container">
        <div
          onClick={handleMetronomeIncreaseClick}
          className="metronome__increase-button"
        >
          ^
        </div>
        <div
          onClick={handleMetronomeDecreaseClick}
          className="metronome__decrease-button"
        >
          ^
        </div>
      </div>
    </div>
  </div>
);

export default MetronomeComponent;
