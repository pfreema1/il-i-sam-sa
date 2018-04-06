<<<<<<< HEAD
import React from 'react';
import playIcon from '../../icons/playIcon.svg';
import pauseIcon from '../../icons/pauseIcon.svg';
import PropTypes from 'prop-types';
=======
import React from "react";
import playIcon from "../../icons/playIcon.svg";
import pauseIcon from "../../icons/pauseIcon.svg";
import PropTypes from "prop-types";
>>>>>>> foo2

const PlayControlView = (
  {
    handlePlayButtonClick,
    handleStopButtonClick,
    handlePlayBackModeClick,
    isPlaying,
    playBackMode
  },
  context
) => (
  <div className="play-control-wrapper">
    <div className="play-control__song-pattern-select">
      <div
        onMouseDown={
          context.mobileViewportContext
            ? () => {}
<<<<<<< HEAD
            : handlePlayBackModeClick.bind(null, 'song')
        }
        onTouchStart={handlePlayBackModeClick.bind(null, 'song')}
        className={'play-control__song-select '}
=======
            : handlePlayBackModeClick.bind(null, "song")
        }
        onTouchStart={handlePlayBackModeClick.bind(null, "song")}
        className={"play-control__song-select "}
>>>>>>> foo2
      >
        <div className="play-control__small-box-select">
          <div
            className={
              "play-control__indicator " +
              (playBackMode === "song"
                ? "play-control__play-mode-selected"
                : "")
            }
          />
        </div>
        <div className="play-control__song-pattern-text">SONG</div>
      </div>

      <div
        onMouseDown={
          context.mobileViewportContext
            ? () => {}
<<<<<<< HEAD
            : handlePlayBackModeClick.bind(null, 'pattern')
        }
        onTouchStart={handlePlayBackModeClick.bind(null, 'pattern')}
        className={'play-control__pattern-select '}
=======
            : handlePlayBackModeClick.bind(null, "pattern")
        }
        onTouchStart={handlePlayBackModeClick.bind(null, "pattern")}
        className={"play-control__pattern-select "}
>>>>>>> foo2
      >
        <div className="play-control__small-box-select">
          <div
            className={
              "play-control__indicator " +
              (playBackMode === "pattern"
                ? "play-control__play-mode-selected"
                : "")
            }
          />
        </div>
        <div className="play-control__song-pattern-text">PATTERN</div>
      </div>
    </div>

    <div
      onMouseDown={
        context.mobileViewportContext ? () => {} : handlePlayButtonClick
      }
      onTouchStart={handlePlayButtonClick}
<<<<<<< HEAD
      className={'play-control__play-pause-button '}
=======
      className={"play-control__play-pause-button "}
>>>>>>> foo2
    >
      {isPlaying ? (
        <img
          className="play-control__play-icon"
          src={pauseIcon}
          alt="pause icon"
          style={{ marginLeft: "-2px" }}
        />
      ) : (
        <img
          className="play-control__play-icon"
          src={playIcon}
          alt="play icon"
        />
      )}
    </div>

    <div
      onMouseDown={
        context.mobileViewportContext ? () => {} : handleStopButtonClick
      }
      onTouchStart={handleStopButtonClick}
      className="play-control__stop-button"
    >
      <div className="play-control__stop-button-icon" />
    </div>
  </div>
);

PlayControlView.contextTypes = {
  mobileViewportContext: PropTypes.bool
};

export default PlayControlView;
