import React from 'react';

const PlayControlView = ({
  handlePlayButtonClick,
  handleStopButtonClick,
  handlePlayModeClick,
  isPlaying,
  playMode
}) => (
  <div className="play-control-wrapper">
    <div className="play-control__song-pattern-select">
      <div
        onClick={handlePlayModeClick.bind(null, 'song')}
        className={
          'play-control__song-select ' +
          (playMode === 'song' ? 'play-control__play-mode-selected' : '')
        }
      >
        <div className="play-control__small-box-select">[]</div>
        <div className="play-control__song-pattern-text">Song</div>
      </div>

      <div
        onClick={handlePlayModeClick.bind(null, 'pattern')}
        className={
          'play-control__patttern-select ' +
          (playMode === 'pattern' ? 'play-control__play-mode-selected' : '')
        }
      >
        <div className="play-control__small-box-select">[]</div>
        <div className="play-control__song-pattern-text">Pattern</div>
      </div>
    </div>

    <div
      onClick={handlePlayButtonClick}
      className={
        'play-control__play-pause-button ' +
        (isPlaying ? 'play-control__is-playing' : '')
      }
    >
      {isPlaying ? '||' : '>'}
    </div>

    <div onClick={handleStopButtonClick} className="play-control__stop-button">
      []
    </div>
  </div>
);

export default PlayControlView;
