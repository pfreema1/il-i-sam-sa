import React from 'react';
import DurationSliderComponent from '../Components/DurationSliderComponent';
import MockTriggerContainer from '../Containers/MockTriggerContainer';

const DurationTriggerComponent = ({
  index,
  isTriggered,
  isSlicee,
  handleDragStop,
  durationValAsPercentArr,
  triggerBeingEditedId,
  handleSliderChange
}) => (
  <div key={index} className="duration-container">
    <MockTriggerContainer
      barStarter={index % 4 === 0 ? true : false}
      isTriggered={isTriggered}
      id={index}
      isSlicee={isSlicee}
    />
    <DurationSliderComponent
      isTriggered={isTriggered}
      isSlicee={isSlicee}
      handleDragStop={handleDragStop}
      durationValAsPercentArr={durationValAsPercentArr}
      index={index}
      triggerBeingEditedId={triggerBeingEditedId}
      handleSliderChange={handleSliderChange}
    />
    <div
      className={
        'duration-percentage-container ' + (isTriggered ? '' : 'not-triggered')
      }
    >
      {durationValAsPercentArr[index] + '%'}
    </div>
  </div>
);

export default DurationTriggerComponent;
