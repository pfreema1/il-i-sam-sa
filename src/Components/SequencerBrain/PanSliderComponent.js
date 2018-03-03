import React from 'react';
import { Tooltip } from 'react-tippy';
import Slider from 'material-ui/Slider';

const PanSliderComponent = ({ panVal, handleSliderChange, handleDragStop }) => (
  <Tooltip title={'Pan:  ' + panVal} trigger="mouseenter">
    <div className="sequencer-brain__sliders sequencer-brain__pan-slider-container">
      <Slider
        id="panSlider"
        min={-1}
        max={1}
        step={0.1}
        style={{ height: 45 }}
        axis="y"
        defaultValue={0}
        onChange={handleSliderChange.bind(null, 'panSlider')}
        onDragStop={handleDragStop.bind(null, 'panSlider')}
        value={panVal}
      />
    </div>
  </Tooltip>
);

export default PanSliderComponent;
