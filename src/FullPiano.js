import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';
import OneOctavePiano from './OneOctavePiano';

const FullPianoStyle = {
  width: '2100px'
};

const NoteTextStyle = {
  position: 'absolute',
  top: '75px',
  color: 'black',
  opacity: '0.2',
  pointerEvents: 'none'
};

const transformEndPointArr = [0, 420, 840, 1260, 1680, 2100];

/*****************************/

class FullPiano extends Component {
  constructor(props) {
    super(props);

    // this.endPointInPx = transformEndPointArr[props.endPoint] * -1;

    this.state = {
      endPointInPx: transformEndPointArr[props.endPoint] * -1
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      endPointInPx: transformEndPointArr[nextProps.endPoint] * -1
    });
  }

  render() {
    return (
      <Motion
        defaultStyle={{ x: 0 }}
        style={{ x: spring(this.state.endPointInPx) }}
      >
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
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    triggerBeingEdited: state.triggerBeingEdited,
    triggers: state.triggers
  };
};

export default connect(mapStateToProps)(FullPiano);
