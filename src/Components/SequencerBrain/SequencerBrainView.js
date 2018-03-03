import React from 'react';
import MuteButtonComponent from './MuteButtonComponent';
import SoloButtonComponent from './SoloButtonComponent';
import PanSliderComponent from './PanSliderComponent';
import PitchSlider from './PitchSlider';
import VolumeSlider from './VolumeSlider';

const SequencerBrainView = ({
  sequencerId,
  handleMuteClick,
  isMuted,
  handleSoloClick,
  isSoloed,
  panVal,
  handleSliderChange,
  handleDragStop,
  pitchVal,
  volumeVal
}) => (
  <div className="sequencer-brain__container">
    <div className="sequencer-brain__name-container">{sequencerId}</div>
    <div className="sequencer-brain__controls-container">
      <div className="sequencer-brain__mute-solo-container">
        <MuteButtonComponent
          handleMuteClick={handleMuteClick}
          isMuted={isMuted}
        />
        <SoloButtonComponent
          handleSoloClick={handleSoloClick}
          isSoloed={isSoloed}
        />
      </div>
      <PanSliderComponent
        panVal={panVal}
        handleSliderChange={handleSliderChange}
        handleDragStop={handleDragStop}
      />
      <PitchSlider
        pitchVal={pitchVal}
        handleSliderChange={handleSliderChange}
        handleDragStop={handleDragStop}
      />
      <VolumeSlider
        volumeVal={volumeVal}
        handleSliderChange={handleSliderChange}
        handleDragStop={handleDragStop}
      />
    </div>
  </div>
);

export default SequencerBrainView;
