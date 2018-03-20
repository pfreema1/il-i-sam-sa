import React from 'react';
import playIcon from '../../icons/playIcon.svg';

const PlayControlView = ({
  handlePlayButtonClick,
  handleStopButtonClick,
  handlePlayBackModeClick,
  isPlaying,
  playBackMode
}) => (
  <div className="play-control-wrapper">
    <div className="play-control__song-pattern-select">
      <div
        onClick={handlePlayBackModeClick.bind(null, 'song')}
        className={'play-control__song-select '}
      >
        <div className="play-control__small-box-select">
          <div
            className={
              'play-control__indicator ' +
              (playBackMode === 'song'
                ? 'play-control__play-mode-selected'
                : '')
            }
          />
        </div>
        <div className="play-control__song-pattern-text">SONG</div>
      </div>

      <div
        onClick={handlePlayBackModeClick.bind(null, 'pattern')}
        className={'play-control__pattern-select '}
      >
        <div className="play-control__small-box-select">
          <div
            className={
              'play-control__indicator ' +
              (playBackMode === 'pattern'
                ? 'play-control__play-mode-selected'
                : '')
            }
          />
        </div>
        <div className="play-control__song-pattern-text">PATTERN</div>
      </div>
    </div>

    <div
      onClick={handlePlayButtonClick}
      className={
        'play-control__play-pause-button ' +
        (isPlaying ? 'play-control__is-playing' : '')
      }
    >
      {isPlaying ? (
        '||'
      ) : (
        <img
          className="play-control__play-icon"
          src={playIcon}
          alt="play icon"
        />
      )}
    </div>

    <div onClick={handleStopButtonClick} className="play-control__stop-button">
      <div className="play-control__stop-button-icon" />
    </div>
  </div>
);

export default PlayControlView;
