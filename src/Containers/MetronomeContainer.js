import React, { Component } from 'react';
import { connect } from 'react-redux';
import MetronomeComponent from '../Components/Toolbar/MetronomeComponent';
import './MetronomeContainer.css';

class MetronomeContainer extends Component {
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
      <MetronomeComponent
        handleMetronomeIconClick={this.handleMetronomeIconClick}
        isMetronomeOn={this.props.isMetronomeOn}
        handleOnDragStart={this.handleOnDragStart}
        handleOnDrag={this.handleOnDrag}
        handleOnDragEnd={this.handleOnDragEnd}
        handleOnDragOver={this.handleOnDragOver}
        bpm={this.props.bpm}
        handleMetronomeIncreaseClick={this.handleMetronomeIncreaseClick}
        handleMetronomeDecreaseClick={this.handleMetronomeDecreaseClick}
      />
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

export default connect(mapStateToProps)(MetronomeContainer);
