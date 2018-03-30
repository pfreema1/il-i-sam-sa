import React from 'react';
import metronomeIcon from '../../icons/metronomeIcon.svg';
import arrowIcon from '../../icons/arrowIcon.svg';
import redMetronomeIcon from '../../icons/redMetronomeIcon.svg';
import TouchRipple from 'material-ui/internal/TouchRipple';
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
      className={'metronome__icon-container '}
    >
      {isMetronomeOn ? (
        <img src={redMetronomeIcon} alt="red metronome icon" />
      ) : (
        <img src={metronomeIcon} alt="metronome icon" />
      )}
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
        {bpm + ' BPM'}
      </div>
      <div className="metronome__increase-decrease-container">
        <div
          onClick={handleMetronomeIncreaseClick}
          className="metronome__increase-button"
        >
          <img src={arrowIcon} alt="arrow icon" />
        </div>
        <div
          onClick={handleMetronomeDecreaseClick}
          className="metronome__decrease-button"
        >
          <img src={arrowIcon} alt="arrow icon" />
        </div>
      </div>
    </div>
  </div>
);

export default MetronomeComponent;
