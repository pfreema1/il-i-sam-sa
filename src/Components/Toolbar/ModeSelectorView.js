import React from 'react';

const ModeSelectorView = ({ UiMode, handleModeSelectorClick }) => (
  <div className="mode-selector-wrapper">
    <div
      onClick={handleModeSelectorClick.bind(null, 'song')}
      className={
        'mode-selector__option ' +
        (UiMode === 'song' ? 'mode-selector__option--selected' : '')
      }
    >
      SONG
    </div>
    <div
      onClick={handleModeSelectorClick.bind(null, 'pattern')}
      className={
        'mode-selector__option ' +
        (UiMode === 'pattern' ? 'mode-selector__option--selected' : '')
      }
    >
      PATTERN
    </div>
    <div
      onClick={handleModeSelectorClick.bind(null, 'mixer')}
      className={
        'mode-selector__option ' +
        (UiMode === 'mixer' ? 'mode-selector__option--selected' : '')
      }
    >
      MIXER
    </div>
  </div>
);

export default ModeSelectorView;
