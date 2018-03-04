import React from 'react';
import MockTriggerContainer from '../Containers/MockTriggerContainer';
import VelocitySlider from './VelocitySlider';

const VelocityTrigger = ({
  index,
  isTriggered,
  isSlicee,
  handleDragStop,
  velocityValAsPercentArr,
  triggerBeingEditedId,
  handleSliderChange
}) => (
  <div className="velocity-container">
    <MockTriggerContainer
      barStarter={index % 4 === 0 ? true : false}
      isTriggered={isTriggered}
      id={index}
      isSlicee={isSlicee}
    />
    <VelocitySlider
      isTriggered={isTriggered}
      isSlicee={isSlicee}
      handleDragStop={handleDragStop}
      velocityValAsPercentArr={velocityValAsPercentArr}
      index={index}
      triggerBeingEditedId={triggerBeingEditedId}
      handleSliderChange={handleSliderChange}
    />

    <div
      className={
        'velocity-percentage-container ' + (isTriggered ? '' : 'not-triggered')
      }
    >
      {velocityValAsPercentArr[index] + '%'}
    </div>
  </div>
);

export default VelocityTrigger;
