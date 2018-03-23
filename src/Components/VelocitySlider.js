import React from 'react';
import Slider from 'material-ui/Slider';

const VelocitySlider = ({
  isTriggered,
  isSlicee,
  handleDragStop,
  velocityValAsPercentArr,
  index,
  triggerBeingEditedId,
  handleSliderChange
}) => (
  <Slider
    className={'velocity-slider ' + (isTriggered ? '' : 'not-triggered')}
    min={0}
    max={100}
    disabled={!isTriggered}
    onDragStop={
      isSlicee
        ? handleDragStop.bind(null, velocityValAsPercentArr[index], index)
        : handleDragStop.bind(
            null,
            velocityValAsPercentArr[index],
            triggerBeingEditedId
          )
    }
    defaultValue={velocityValAsPercentArr[index]}
    onChange={handleSliderChange.bind(null, index)}
    step={1}
    disableFocusRipple={true}
  />
);

export default VelocitySlider;
