import React, { Component } from 'react';
import { connect } from 'react-redux';
import SongModePatternView from '../Components/SongModePatternView';
import ReactSortable from 'react-sortablejs';

const styling = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '120px',
  background: 'RGBA(55, 57, 62, 1.00)'
};

class SongModePatternSelectContainer extends Component {
  constructor(props) {
    super(props);

    this.patternHeight = 50;
    this.patternWidth = 136;
    this.triggerWidth = this.patternWidth / 16;
    this.sequencerAmount = props.sequencersIdArr.length + 1;
    this.sequencerHeight = this.patternHeight / this.sequencerAmount;
    this.arrayOfSequencerTriggerIds = [];

    // using key to force a re-render -- needed to update the
    // pattern icon in the pattern select container
    this.state = {
      key: Math.random()
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.songArr != this.props.songArr) {
      this.setState({ key: Math.random() });
    }

    this.triggerWidth = this.patternWidth / 16;
    this.sequencerAmount = nextProps.sequencersIdArr.length + 1;
    this.sequencerHeight = this.patternHeight / this.sequencerAmount;

    this.arrayOfSequencerTriggerIds = this.createArrayOfTriggeredIds(nextProps);
  }

  componentDidUpdate() {
    this.props.dispatch({
      type: 'PATTERN_SELECT_RERENDERED',
      updateAll: false
    });
  }

  createArrayOfTriggeredIds = nextProps => {
    let arrayOfSequencerTriggerIds = nextProps.sequencersIdArr.map(
      sequencer => {
        let sequencerTriggers = nextProps.sequencers[sequencer].triggers
          .filter(trigger => {
            return trigger.isTriggered || trigger.isSliced;
          })
          .map(trigger => trigger.id);

        return sequencerTriggers;
      }
    );

    return arrayOfSequencerTriggerIds;
  };

  returnArrayOfPositionObjsForPattern = patternIndex => {
    let startId = patternIndex * 16;
    let endId = startId + 16;

    let patternPositions = [];

    //i tracks sequencer, j tracks trigger
    for (let i = 0; i < this.arrayOfSequencerTriggerIds.length; i++) {
      for (let j = 0; j < this.arrayOfSequencerTriggerIds[i].length; j++) {
        if (
          this.arrayOfSequencerTriggerIds[i][j] >= startId &&
          this.arrayOfSequencerTriggerIds[i][j] < endId
        ) {
          //case trigger is relevant to pattern
          let tempPosObj = {};
          let normalizedId = this.arrayOfSequencerTriggerIds[i][j] - startId;

          tempPosObj.top =
            i * this.sequencerHeight / this.patternHeight +
            3 / this.patternHeight;

          tempPosObj.left =
            normalizedId * this.triggerWidth / this.patternWidth;

          patternPositions.push(tempPosObj);
        }
      }
    }

    return patternPositions;
  };

  render() {
    const { patternsArr } = this.props;
    return (
      <ReactSortable
        key={this.state.key}
        id="songModePatternSelect"
        options={{
          animation: 150,
          sort: false,
          group: {
            name: 'clone1',
            pull: 'clone',
            put: false
          }
        }}
        style={styling}
      >
        {patternsArr.map((pattern, index) => {
          let arrayOfPositions = this.returnArrayOfPositionObjsForPattern(
            index
          );

          return (
            <SongModePatternView
              key={index}
              patternName={pattern}
              patternHeight={this.patternHeight}
              patternWidth={this.patternWidth}
              arrayOfPositions={arrayOfPositions}
              triggerWidth={this.triggerWidth / this.patternWidth}
              triggerHeight={this.sequencerHeight / this.patternHeight}
            />
          );
        })}
      </ReactSortable>
    );
  }
}

function mapStateToProps(state) {
  return {
    patternsArr: state.patternsArr,
    songModeSelectedPattern: state.songModeSelectedPattern,
    songModeSelectedPatternSequenceIndex:
      state.songModeSelectedPatternSequenceIndex,
    sequencersIdArr: state.sequencersIdArr,
    sequencers: state.sequencers,
    songArr: state.songArr
  };
}

export default connect(mapStateToProps)(SongModePatternSelectContainer);
