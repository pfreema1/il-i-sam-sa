import React from 'react';
import Slider from 'material-ui/Slider';

const mixerStyling = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  margin: '20px',
  border: '1px solid black',
  height: '80vh',
  minWidth: '120px'
};

const sequencerIdStyling = {
  height: '5%'
};

const fxContainerStyling = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '20%'
};

/*****************************/

const MixerControlView = ({
  sequencerName,
  volumeVal,
  volumeChange,
  volumeDragStop,
  index
}) => {
  return (
    <div style={mixerStyling}>
      <div style={sequencerIdStyling}>
        <h3>{sequencerName}</h3>
      </div>
      <Slider
        style={{ height: '60%' }}
        axis="y"
        defaultValue={volumeVal}
        min={-80}
        max={0}
        onChange={volumeChange.bind(null, index)}
        onDragStop={volumeDragStop.bind(null, index)}
        value={volumeVal}
      />
      <div style={fxContainerStyling}>fx here</div>
    </div>
  );
};

export default MixerControlView;
