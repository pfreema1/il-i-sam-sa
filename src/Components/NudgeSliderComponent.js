import React from 'react';
import Slider from 'material-ui/Slider';

const NudgeSliderComponent = ({
  isTriggered,
  sliderMinValue,
  totalNudgeRange,
  isSlicee,
  handleDragStop,
  nudgeValueArr,
  index,
  triggerBeingEditedId,
  handleSliderChange
}) => (
  <Slider
    className={
      'nudge-slider ' +
      (isTriggered ? '' : 'not-triggered ') +
      (sliderMinValue === 0 ? 'nudge-slider--first-trigger' : '')
    }
    min={sliderMinValue}
    max={totalNudgeRange / 2}
    disabled={!isTriggered}
    onDragStop={
      isSlicee
        ? handleDragStop.bind(null, nudgeValueArr[index], index)
        : handleDragStop.bind(null, nudgeValueArr[index], triggerBeingEditedId)
    }
    defaultValue={nudgeValueArr[index]}
    onChange={handleSliderChange.bind(null, index)}
    step={1}
    disableFocusRipple={true}
  />
);

export default NudgeSliderComponent;
