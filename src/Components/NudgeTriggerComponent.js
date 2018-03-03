import React from 'react';
import MockTriggerContainer from '../Containers/MockTriggerContainer';
import NudgeSliderComponent from '../Components/NudgeSliderComponent';

const NudgeTriggerComponent = ({
  index,
  isTriggered,
  isSlicee,
  sliderMinValue,
  totalNudgeRange,
  handleDragStop,
  nudgeValueArr,
  triggerBeingEditedId,
  handleSliderChange
}) => (
  <div className="nudge-container">
    <MockTriggerContainer
      barStarter={index % 4 === 0 ? true : false}
      isTriggered={isTriggered}
      id={index}
      isSlicee={isSlicee}
    />

    <NudgeSliderComponent
      isTriggered={isTriggered}
      sliderMinValue={sliderMinValue}
      totalNudgeRange={totalNudgeRange}
      isSlicee={isSlicee}
      handleDragStop={handleDragStop}
      nudgeValueArr={nudgeValueArr}
      index={index}
      triggerBeingEditedId={triggerBeingEditedId}
      handleSliderChange={handleSliderChange}
    />
    <div
      className={
        'nudge-percentage-container ' + (isTriggered ? '' : 'not-triggered')
      }
    >
      {nudgeValueArr[index]}
    </div>
  </div>
);

export default NudgeTriggerComponent;
