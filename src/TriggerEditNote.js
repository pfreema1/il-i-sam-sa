import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tone from 'tone';
import { Motion, spring } from 'react-motion';

const OneOctaveWrapperStyle = {
  width: '210px',
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

const FullPianoStyle = {
  width: '2100px'
};

const NoteTextStyle = {
  position: 'absolute',
  top: '75px',
  color: 'black',
  opacity: '0.2'
};

/*****************************/

const transformEndPointArr = [0, 420, 840, 1260, 1680, 2100];

const OneOctavePiano = props => {
  const { octaveNum } = props;

  return (
    <div style={OneOctaveWrapperStyle}>
      <div id={'C' + octaveNum} style={WhiteKeyStyle} />
      <div id={'D' + octaveNum} style={WhiteKeyStyle} />
      <div id={'E' + octaveNum} style={WhiteKeyStyle} />
      <div id={'F' + octaveNum} style={WhiteKeyStyle} />
      <div id={'G' + octaveNum} style={WhiteKeyStyle} />
      <div id={'A' + octaveNum} style={WhiteKeyStyle} />
      <div id={'B' + octaveNum} style={WhiteKeyStyle} />
      <div id={'C#' + octaveNum} style={{ ...BlackKeyStyle, left: '15px' }} />
      <div id={'D#' + octaveNum} style={{ ...BlackKeyStyle, left: '45px' }} />
      <div id={'F#' + octaveNum} style={{ ...BlackKeyStyle, left: '105px' }} />
      <div id={'G#' + octaveNum} style={{ ...BlackKeyStyle, left: '135px' }} />
      <div id={'A#' + octaveNum} style={{ ...BlackKeyStyle, left: '165px' }} />
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
            <OneOctavePiano octaveNum={0} />
            <OneOctavePiano octaveNum={1} />
            <OneOctavePiano octaveNum={2} />
            <OneOctavePiano octaveNum={3} />
            <OneOctavePiano octaveNum={4} />
            <OneOctavePiano octaveNum={5} />
            <OneOctavePiano octaveNum={6} />
            <OneOctavePiano octaveNum={7} />
            <OneOctavePiano octaveNum={8} />
            <OneOctavePiano octaveNum={9} />
            <div style={{ ...NoteTextStyle, left: '2px' }}>C0</div>
            <div style={{ ...NoteTextStyle, left: '215px' }}>C1</div>
            <div style={{ ...NoteTextStyle, left: '424px' }}>C2</div>
            <div style={{ ...NoteTextStyle, left: '635px' }}>C3</div>
            <div style={{ ...NoteTextStyle, left: '845px' }}>C4</div>
            <div style={{ ...NoteTextStyle, left: '1055px' }}>C5</div>
            <div style={{ ...NoteTextStyle, left: '1265px' }}>C6</div>
            <div style={{ ...NoteTextStyle, left: '1475px' }}>C7</div>
            <div style={{ ...NoteTextStyle, left: '1685px' }}>C8</div>
            <div style={{ ...NoteTextStyle, left: '1895px' }}>C9</div>
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
