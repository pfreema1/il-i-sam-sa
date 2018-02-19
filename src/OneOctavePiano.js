import React, { Component } from 'react';
import { connect } from 'react-redux';

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

class OneOctavePiano extends Component {
  constructor(props) {
    super(props);

    /*
    triggerBeingEditedId: state.triggerBeingEditedId,
    sequencerBeingEditedId: state.sequencerBeingEditedId,
    sequencers: state.sequencers
    */

    this.returnCurrentlyTriggeredNote();

    this.state = {};
  }

  returnCurrentlyTriggeredNote = () => {
    let { sequencerBeingEditedId, triggerBeingEditedId } = this.props;

    if (sequencerBeingEditedId) {
      let triggers = this.props.sequencers[sequencerBeingEditedId].triggers;
      if (
        triggerBeingEditedId !== null &&
        triggers[triggerBeingEditedId].isTriggered
      ) {
        return triggers[triggerBeingEditedId].note;
      }
    }
  };

  handleKeyClick = e => {
    console.log('id of clicked key:  ', e.target.id);

    this.props.dispatch({ type: 'EDIT_TRIGGER_NOTE', newNote: e.target.id });
  };

  render() {
    const { octaveNum } = this.props;
    let currentlyTriggeredNote = this.returnCurrentlyTriggeredNote();

    return (
      <div style={OneOctaveWrapperStyle}>
        <div
          id={'C' + octaveNum}
          style={{
            ...WhiteKeyStyle,
            backgroundColor:
              currentlyTriggeredNote === 'C' + octaveNum ? '#F6D1A8' : 'white'
          }}
          onClick={this.handleKeyClick}
        />
        <div
          id={'D' + octaveNum}
          style={{
            ...WhiteKeyStyle,
            backgroundColor:
              currentlyTriggeredNote === 'D' + octaveNum ? '#F6D1A8' : 'white'
          }}
          onClick={this.handleKeyClick}
        />
        <div
          id={'E' + octaveNum}
          style={{
            ...WhiteKeyStyle,
            backgroundColor:
              currentlyTriggeredNote === 'E' + octaveNum ? '#F6D1A8' : 'white'
          }}
          onClick={this.handleKeyClick}
        />
        <div
          id={'F' + octaveNum}
          style={{
            ...WhiteKeyStyle,
            backgroundColor:
              currentlyTriggeredNote === 'F' + octaveNum ? '#F6D1A8' : 'white'
          }}
          onClick={this.handleKeyClick}
        />
        <div
          id={'G' + octaveNum}
          style={{
            ...WhiteKeyStyle,
            backgroundColor:
              currentlyTriggeredNote === 'G' + octaveNum ? '#F6D1A8' : 'white'
          }}
          onClick={this.handleKeyClick}
        />
        <div
          id={'A' + octaveNum}
          style={{
            ...WhiteKeyStyle,
            backgroundColor:
              currentlyTriggeredNote === 'A' + octaveNum ? '#F6D1A8' : 'white'
          }}
          onClick={this.handleKeyClick}
        />
        <div
          id={'B' + octaveNum}
          style={{
            ...WhiteKeyStyle,
            backgroundColor:
              currentlyTriggeredNote === 'B' + octaveNum ? '#F6D1A8' : 'white'
          }}
          onClick={this.handleKeyClick}
        />
        <div
          id={'C#' + octaveNum}
          style={{
            ...BlackKeyStyle,
            left: '15px',
            backgroundColor:
              currentlyTriggeredNote === 'C#' + octaveNum ? '#F6D1A8' : 'black'
          }}
          onClick={this.handleKeyClick}
        />
        <div
          id={'D#' + octaveNum}
          style={{
            ...BlackKeyStyle,
            left: '45px',
            backgroundColor:
              currentlyTriggeredNote === 'D#' + octaveNum ? '#F6D1A8' : 'black'
          }}
          onClick={this.handleKeyClick}
        />
        <div
          id={'F#' + octaveNum}
          style={{
            ...BlackKeyStyle,
            left: '105px',
            backgroundColor:
              currentlyTriggeredNote === 'F#' + octaveNum ? '#F6D1A8' : 'black'
          }}
          onClick={this.handleKeyClick}
        />
        <div
          id={'G#' + octaveNum}
          style={{
            ...BlackKeyStyle,
            left: '135px',
            backgroundColor:
              currentlyTriggeredNote === 'G#' + octaveNum ? '#F6D1A8' : 'black'
          }}
          onClick={this.handleKeyClick}
        />
        <div
          id={'A#' + octaveNum}
          style={{
            ...BlackKeyStyle,
            left: '165px',
            backgroundColor:
              currentlyTriggeredNote === 'A#' + octaveNum ? '#F6D1A8' : 'black'
          }}
          onClick={this.handleKeyClick}
        />
      </div>
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    triggerBeingEditedId: state.triggerBeingEditedId,
    sequencerBeingEditedId: state.sequencerBeingEditedId,
    sequencers: state.sequencers
  };
};

export default connect(mapStateToProps)(OneOctavePiano);
