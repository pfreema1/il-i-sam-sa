import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';
import FullPiano from './FullPiano';

const PianoWindowStyle = {
  width: '420px',
  height: '100px',
  overflow: 'hidden'
};

const TriggerEditNoteWrapperStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: '100%',
  margin: '20px'
};

/*****************************/

class TriggerEditNote extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentEndPoint: 0
    };
  }

  handleScrollLeftClick = () => {
    if (this.state.currentEndPoint !== 0) {
      this.setState({ currentEndPoint: this.state.currentEndPoint - 1 });
    }
  };

  handleScrollRightClick = () => {
    if (this.state.currentEndPoint !== 4) {
      this.setState({ currentEndPoint: this.state.currentEndPoint + 1 });
    }
  };

  render() {
    return (
      <div style={TriggerEditNoteWrapperStyle}>
        <div
          style={{
            visibility: this.state.currentEndPoint === 0 ? 'hidden' : 'visible'
          }}
          onClick={this.handleScrollLeftClick}
        >
          &lt;
        </div>
        <div style={PianoWindowStyle}>
          <FullPiano endPoint={this.state.currentEndPoint} />
        </div>
        <div
          style={{
            visibility: this.state.currentEndPoint === 4 ? 'hidden' : 'visible'
          }}
          onClick={this.handleScrollRightClick}
        >
          &gt;
        </div>
      </div>
    );
  }
}

/*****************************/

TriggerEditNote.propTypes = {};

export default TriggerEditNote;
