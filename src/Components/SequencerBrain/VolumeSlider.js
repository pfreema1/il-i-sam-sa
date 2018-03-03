import React from 'react';
import { Tooltip } from 'react-tippy';
import Slider from 'material-ui/Slider';

const VolumeSlider = ({ volumeVal, handleSliderChange, handleDragStop }) => (
  <Tooltip title={'Volume:  ' + volumeVal} trigger="mouseenter">
    <div className="sequencer-brain__sliders sequencer-brain__vol-slider-container">
      <Slider
        id="volumeSlider"
        min={-80}
        max={0}
        step={1}
        style={{ height: 45 }}
        axis="y"
        defaultValue={0}
        onChange={handleSliderChange.bind(null, 'volumeSlider')}
        onDragStop={handleDragStop.bind(null, 'volumeSlider')}
        value={volumeVal}
      />
    </div>
  </Tooltip>
);

export default VolumeSlider;
