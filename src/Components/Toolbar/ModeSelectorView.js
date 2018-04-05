import React from 'react';
import PropTypes from 'prop-types';

const ModeSelectorView = ({ UiMode, handleModeSelectorClick }, context) => (
  <div className="mode-selector-wrapper">
    <div
      onMouseDown={
        context.mobileViewportContext
          ? () => {}
          : handleModeSelectorClick.bind(null, 'song')
      }
      onTouchStart={handleModeSelectorClick.bind(null, 'song')}
      className={
        'mode-selector__option ' +
        (UiMode === 'song' ? 'mode-selector__option--selected' : '')
      }
    >
      SONG
    </div>
    <div
      onMouseDown={
        context.mobileViewportContext
          ? () => {}
          : handleModeSelectorClick.bind(null, 'pattern')
      }
      onTouchStart={handleModeSelectorClick.bind(null, 'pattern')}
      className={
        'mode-selector__option ' +
        (UiMode === 'pattern' ? 'mode-selector__option--selected' : '')
      }
    >
      PATTERN
    </div>
    {/*<div
      onClick={handleModeSelectorClick.bind(null, 'mixer')}
      className={
        'mode-selector__option ' +
        (UiMode === 'mixer' ? 'mode-selector__option--selected' : '')
      }
    >
      MIXER
    </div>*/}
  </div>
);

ModeSelectorView.contextTypes = {
  mobileViewportContext: PropTypes.bool
};

export default ModeSelectorView;
