import React, { Component } from 'react';
import Slider from 'material-ui/Slider';

const DurationSliderComponent = ({
  isTriggered,
  handleDragStop,
  durationValAsPercentArr,
  index,
  triggerBeingEditedId,
  handleSliderChange,
  isSlicee
}) => (
  <Slider
    className={'duration-slider ' + (isTriggered ? '' : 'not-triggered')}
    min={0}
    max={100}
    disabled={!isTriggered}
    onDragStop={
      isSlicee
        ? handleDragStop.bind(null, durationValAsPercentArr[index], index)
        : handleDragStop.bind(
            null,
            durationValAsPercentArr[index],
            triggerBeingEditedId
          )
    }
    defaultValue={durationValAsPercentArr[index]}
    onChange={handleSliderChange.bind(null, index)}
    step={1}
  />
);

export default DurationSliderComponent;
