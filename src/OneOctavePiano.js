import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tone from 'tone';

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

/*****************************/

class OneOctavePiano extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { octaveNum } = this.props;

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
        <div
          id={'F#' + octaveNum}
          style={{ ...BlackKeyStyle, left: '105px' }}
        />
        <div
          id={'G#' + octaveNum}
          style={{ ...BlackKeyStyle, left: '135px' }}
        />
        <div
          id={'A#' + octaveNum}
          style={{ ...BlackKeyStyle, left: '165px' }}
        />
      </div>
    );
  }
}

/*****************************/

// const mapStateToProps = state => {
//   return {

//   };
// };

export default OneOctavePiano;
