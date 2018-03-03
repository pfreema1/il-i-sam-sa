import React from 'react';
import { Tooltip } from 'react-tippy';
import Slider from 'material-ui/Slider';

const PitchSlider = ({ pitchVal, handleSliderChange, handleDragStop }) => (
  <Tooltip title={'Pitch:  ' + pitchVal} trigger="mouseenter">
    <div className="sequencer-brain__sliders sequencer-brain__pitch-slider-container">
      <Slider
        id="pitchSlider"
        min={-12}
        max={12}
        step={1}
        style={{ height: 45 }}
        axis="y"
        defaultValue={0}
        onChange={handleSliderChange.bind(null, 'pitchSlider')}
        onDragStop={handleDragStop.bind(null, 'pitchSlider')}
        value={pitchVal}
      />
    </div>
  </Tooltip>
);

export default PitchSlider;
