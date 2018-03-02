import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Metronome.css';

class Metronome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //what if i only use redux as state?
    };
  }

  componentDidMount() {
    this.dragImg = new Image(0, 0);
    //blank image
    this.dragImg.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }

  handleMetronomeIncreaseClick = e => {
    console.log(e);

    this.props.dispatch({ type: 'INCREASE_BPM' });
  };

  handleMetronomeDecreaseClick = () => {
    this.props.dispatch({ type: 'DECREASE_BPM' });
  };

  handleOnDrag = e => {
    e.preventDefault();

    if (e.pageY !== this.prevPageY) {
      let delta = this.prevPageY - e.pageY;

      if (delta > 0) {
        this.props.dispatch({ type: 'INCREASE_BPM' });
      } else {
        this.props.dispatch({ type: 'DECREASE_BPM' });
      }
    }

    this.prevPageY = e.pageY;
  };

  handleOnDragStart = e => {
    //sets ghost image to blank image created in componentDidMount
    e.dataTransfer.setDragImage(this.dragImg, 0, 0);
    this.dragStartYPos = e.pageY;
    this.prevPageY = e.pageY;
  };

  handleOnDragEnd = e => {
    this.dragStartYPos = e.pageY;
    this.prevPageY = e.pageY;
  };

  handleOnDragOver = e => {
    e.preventDefault();
  };

  handleMetronomeIconClick = () => {
    this.props.dispatch({ type: 'TOGGLE_METRONOME' });
  };

  render() {
    return (
      <div className="metronome__container">
        <div
          onClick={this.handleMetronomeIconClick}
          className={
            'metronome__icon-container ' +
            (this.props.isMetronomeOn ? 'metronome-on' : '')
          }
        >
          []
        </div>
        <div className="metronome__control-container">
          <div
            draggable="true"
            onDragStart={this.handleOnDragStart}
            onDrag={this.handleOnDrag}
            onDragEnd={this.handleOnDragEnd}
            onDragOver={this.handleOnDragOver}
            className="metronome__bpm-readout"
          >
            {this.props.bpm + ' bpm'}
          </div>
          <div className="metronome__increase-decrease-container">
            <div
              onClick={this.handleMetronomeIncreaseClick}
              className="metronome__increase-button"
            >
              ^
            </div>
            <div
              onClick={this.handleMetronomeDecreaseClick}
              className="metronome__decrease-button"
            >
              ^
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    bpm: state.bpm,
    isMetronomeOn: state.isMetronomeOn
  };
};

export default connect(mapStateToProps)(Metronome);
