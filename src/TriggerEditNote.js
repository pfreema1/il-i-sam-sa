import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tone from 'tone';
import { Motion, spring } from 'react-motion';

const OneOctaveWrapperStyle = {
  width: '240px',
  height: '100px',
  backgroundColor: 'white',
  boxSizing: 'border-box',
  position: 'relative',
  display: 'inline-block'
};

const BlackKeyStyle = {
  width: '30px',
  height: '60px',
  background: 'black',
  border: '1px solid #DDDDDD',
  boxSizing: 'border-box',
  position: 'absolute',
  top: '0'
};

const WhiteKeyStyle = {
  width: '30px',
  height: '100px',
  background: 'white',
  border: '1px solid #DDDDDD',
  display: 'inline-block',
  boxSizing: 'border-box'
};

const PianoWindowStyle = {
  width: '480px',
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

const FullPianoStyle = {
  width: '2400px'
};

/*****************************/

const transformEndPointArr = [0, 480, 960, 1440, 1920, 2400];

const OneOctavePiano = () => {
  return (
    <div style={OneOctaveWrapperStyle}>
      <div style={WhiteKeyStyle} />
      <div style={WhiteKeyStyle} />
      <div style={WhiteKeyStyle} />
      <div style={WhiteKeyStyle} />
      <div style={WhiteKeyStyle} />
      <div style={WhiteKeyStyle} />
      <div style={WhiteKeyStyle} />
      <div style={WhiteKeyStyle} />
      <div style={{ ...BlackKeyStyle, left: '15px' }} />
      <div style={{ ...BlackKeyStyle, left: '45px' }} />
      <div style={{ ...BlackKeyStyle, left: '105px' }} />
      <div style={{ ...BlackKeyStyle, left: '135px' }} />
      <div style={{ ...BlackKeyStyle, left: '165px' }} />
    </div>
  );
};

const FullPiano = props => {
  console.log('FullPiano: props:  ', props);

  let endPointInPx = transformEndPointArr[props.endPoint] * -1;
  console.log('endPointInPx:  ', endPointInPx);

  return (
    <Motion defaultStyle={{ x: 0 }} style={{ x: spring(endPointInPx) }}>
      {interpStyle => {
        return (
          <div
            style={{
              ...FullPianoStyle,
              transform: `translateX(${interpStyle.x}px)`
            }}
          >
            <OneOctavePiano />
            <OneOctavePiano />
            <OneOctavePiano />
            <OneOctavePiano />
            <OneOctavePiano />
            <OneOctavePiano />
            <OneOctavePiano />
            <OneOctavePiano />
            <OneOctavePiano />
            <OneOctavePiano />
          </div>
        );
      }}
    </Motion>
  );
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
