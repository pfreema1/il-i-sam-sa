import React from 'react';
import Slider from 'material-ui/Slider';

const styling = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '20px',
  border: '1px solid black'
};

const MixerControlView = ({
  sequencerName,
  volumeVal,
  volumeChange,
  volumeDragStop,
  index
}) => {
  return (
    <div style={styling}>
      <h3>{sequencerName}</h3>
      <Slider
        style={{ height: 300 }}
        axis="y"
        defaultValue={volumeVal}
        min={-80}
        max={0}
        onChange={volumeChange.bind(null, index)}
        onDragStop={volumeDragStop.bind(null, index)}
        value={volumeVal}
      />
      <div>fx here</div>
    </div>
  );
};

export default MixerControlView;
