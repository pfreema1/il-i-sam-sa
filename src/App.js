import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import Tone from 'tone';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './App.css';
import kick1 from './samples/kick1.wav';
import snare1 from './samples/snare1.wav';
import closedHiHat1 from './samples/closedHiHat1.wav';
import ToolbarContainer from './Containers/ToolbarContainer';
import Sequencers from './Containers/Sequencers';
import highClick from './samples/clickHigh.wav';
import lowClick from './samples/click.wav';
import SongModeContainer from './Containers/SongModeContainer';
import StateTreeManager from './Containers/StateTreeManager';
import './songMode.css';
import MixerScreenContainer from './Containers/MixerScreenContainer';
import AddSequencerDropContainer from './Containers/AddSequencerDropContainer';
import PropTypes from 'prop-types';

const returnTriggers = (amount = 16) => {
  let tempTriggersArr = [];

  for (let i = 0; i < amount; i++) {
    let tempObj = {
      id: null,
      timingValue: i * 48,
      nudgeValue: 0,
      scheduleId: null,
      isTriggered: false,
      note: 'C2',
      duration: '192i', //full = 192
      velocity: 1,
      isSliced: false,
      sliceAmount: 0,
      slicedTriggers: []
    };
    tempObj.id = i;

    tempTriggersArr.push(tempObj);
  }

  return tempTriggersArr;
};

const returnEmptyTriggers = (startTimeValue, startIdNum) => {
  let emptyTriggers = returnTriggers();

  emptyTriggers = setPatternTimingValues(startTimeValue, emptyTriggers);

  emptyTriggers = setNewTriggersIds(startIdNum, emptyTriggers);

  return emptyTriggers;
};

const returnNewSequencersObj = (arrayOfNewSequencers, state) => {
  let newSequencersObj = {};
  for (let i = 0; i < arrayOfNewSequencers.length; i++) {
    let sequencerKey = state.sequencersIdArr[i];
    newSequencersObj[sequencerKey] = arrayOfNewSequencers[i];
  }

  return newSequencersObj;
};

const returnArrayOfNewTriggersWithCopiedPattern = (
  sequencers,
  sequencer,
  currentPatternIndex,
  clonedTriggers,
  sequencerIndex,
  clonedTriggerIndex
) => {
  let startingIdValue = currentPatternIndex * 16;
  let endingIdValue = startingIdValue + 16;

  return sequencers[sequencer].triggers.map((trigger, index) => {
    if (index >= startingIdValue && index < endingIdValue) {
      //set trigger equal to corresponding trigger in clonedTriggers
      trigger = clonedTriggers[sequencerIndex][clonedTriggerIndex];

      clonedTriggerIndex++;

      return trigger;
    } else {
      return trigger;
    }
  });
};

const returnArrayOfNewSequencersWithCopiedPattern = (
  sequencers,
  clonedTriggers,
  currentPatternIndex
) => {
  let arrayOfNewSequencers = [];
  let clonedTriggerIndex = 0;
  let sequencerIndex = 0;

  for (let sequencer in sequencers) {
    let newTriggers = returnArrayOfNewTriggersWithCopiedPattern(
      sequencers,
      sequencer,
      currentPatternIndex,
      clonedTriggers,
      sequencerIndex,
      clonedTriggerIndex
    );

    let tempSequencer = { ...sequencers[sequencer] };

    tempSequencer.triggers = newTriggers;

    arrayOfNewSequencers = arrayOfNewSequencers.concat(tempSequencer);

    sequencerIndex++;
    clonedTriggerIndex = 0;
  }

  return arrayOfNewSequencers;
};

const returnArrayOfNewSequencers = (sequencers, startTimeValue, startIdNum) => {
  let arrayOfNewSequencers = [];

  for (let sequencer in sequencers) {
    let emptyTriggers = returnEmptyTriggers(startTimeValue, startIdNum);

    // concat new empty triggers to current triggers
    let currentTriggers = sequencers[sequencer].triggers.concat(emptyTriggers);

    //create copy of current sequencer
    let tempSequencer = { ...sequencers[sequencer] };

    tempSequencer.triggers = currentTriggers;

    arrayOfNewSequencers = arrayOfNewSequencers.concat(tempSequencer);
  }

  return arrayOfNewSequencers;
};

const setPatternTimingValues = (startTimeValue, triggers) => {
  triggers = triggers.map(trigger => {
    trigger.timingValue += startTimeValue;
    return trigger;
  });
  return triggers;
};

const returnIndexOfPattern = (patternToGetIndex, patternsArr) => {
  return patternsArr.reduce((prevVal, pattern, index) => {
    if (patternToGetIndex === pattern) {
      return index;
    } else {
      return prevVal;
    }
  }, null);
};

const copyGlobalPatternTriggers = indexToCopyFrom => {
  let patternTriggers = deepCopy(GLOBAL_PATTERN_TRIGGERS[indexToCopyFrom]);

  let indexOfLastPattern = GLOBAL_PATTERN_TRIGGERS.length - 1;
  let timeOffset = (indexOfLastPattern - indexToCopyFrom) * 768;

  //update time of new triggers
  patternTriggers.forEach(trigger => {
    trigger.time = trigger.time + timeOffset;
  });

  GLOBAL_PATTERN_TRIGGERS[indexOfLastPattern] = patternTriggers;
};

const setNewTriggersIds = (startIdNum, triggers) => {
  triggers = triggers.map((trigger, index) => {
    trigger.id = startIdNum + index;
    return trigger;
  });

  return triggers;
};

const returnSingleSlicedTrigger = () => {
  return {
    id: null,
    scheduleId: null,
    isTriggered: false,
    nudgeValue: 0,
    note: 'C2',
    duration: '192i',
    velocity: 1,
    isSliced: false,
    sliceAmount: 0
  };
};

const returnSynthComponentRefObj = sampleRef => {
  let synthComponentRefObj = {};

  synthComponentRefObj.volume = new Tone.Volume();
  synthComponentRefObj.pan = new Tone.Panner();
  synthComponentRefObj.solo = new Tone.Solo();
  synthComponentRefObj.pitch = new Tone.PitchShift();

  synthComponentRefObj.synthRef = new Tone.Sampler({ C2: sampleRef }).chain(
    synthComponentRefObj.pan,
    synthComponentRefObj.solo,
    synthComponentRefObj.pitch,
    synthComponentRefObj.volume,
    Tone.Master
  );
  return synthComponentRefObj;
};

const setupNewSequencer = (sequencerId, state, sampleRef) => {
  let sequencers = { ...state.sequencers };

  let synthComponentRefObj = returnSynthComponentRefObj(sampleRef);

  let amountOfTriggers = state.patternsArr.length * 16;

  sequencers[sequencerId] = {
    synthesizerRef: synthComponentRefObj.synthRef,
    volumeRef: synthComponentRefObj.volume,
    volumeVal: synthComponentRefObj.volume.volume.value,
    panRef: synthComponentRefObj.pan,
    panVal: synthComponentRefObj.pan.pan.value,
    soloRef: synthComponentRefObj.solo,
    pitchRef: synthComponentRefObj.pitch,
    pitchVal: synthComponentRefObj.pitch.pitch,
    triggers: returnTriggers(amountOfTriggers),
    isMuted: false,
    isSoloed: false
  };

  return sequencers;
};

const returnNewSequencersIdArr = sequencersObj => {
  return Object.keys(sequencersObj);
};

const deepCopy = obj => {
  let rv;

  switch (typeof obj) {
    case 'object':
      if (obj === null) {
        rv = null;
      } else {
        if (obj instanceof Tone.Event) {
          //copy the reference to  the Tone.Event
          rv = obj;
        } else if (obj instanceof Tone.Sampler) {
          //copy the reference to the Tone.Sampler
          rv = obj;
        } else {
          switch (Object.prototype.toString.call(obj)) {
            case '[object Array]':
              //it's an array, create a new array with
              // deep copies of the entries
              rv = obj.map(deepCopy);
              break;
            default:
              //some other kind of object, deep-copy
              //its properties into a new object
              rv = Object.keys(obj).reduce((prev, key) => {
                prev[key] = deepCopy(obj[key]);
                return prev;
              }, {});
              break;
          }
        }
      }
      break;
    default:
      //it's a primitive. copy via assignment
      rv = obj;
      break;
  }
  return rv;
};

const returnUpdatedTimingAndIdTriggers = (
  currentPatternIndex,
  clonedTriggers,
  indexToCopyFrom
) => {
  let startingIdValue = currentPatternIndex * 16;
  let indexOfLastPattern = GLOBAL_PATTERN_TRIGGERS.length - 1;
  let timeOffset = (indexOfLastPattern - indexToCopyFrom) * 768;

  let newClonedTriggers = clonedTriggers.map(triggers => {
    return triggers.map((trigger, index) => {
      trigger.id = startingIdValue + index;
      trigger.timingValue = trigger.timingValue + timeOffset;
      return trigger;
    });
  });

  return newClonedTriggers;
};

//called everytime songBuilderDropArea updates
const updateSongBuilderPatternIcons = (
  currentPatternIndex,
  updateAll,
  songModeSelectedPatternSequenceIndex
) => {
  let songBuilderDropAreaEl = document.getElementById('songBuilderDropArea');
  let patternSelectAreaEl = document.getElementById('songModePatternSelect');
  let changedPatternId = 'PATTERN ' + parseInt(currentPatternIndex + 1, 10);

  songBuilderDropAreaEl.childNodes.forEach((replaceeEl, index) => {
    if (true /* updateAll */) {
      cloneAndReplacePatternIcon(
        patternSelectAreaEl,
        replaceeEl,
        songModeSelectedPatternSequenceIndex,
        songBuilderDropAreaEl,
        index
      );
    } else if (replaceeEl.id === changedPatternId) {
      cloneAndReplacePatternIcon(
        patternSelectAreaEl,
        replaceeEl,
        songModeSelectedPatternSequenceIndex,
        songBuilderDropAreaEl,
        index
      );
    }

    /*****************************/

    /*     if (replaceeEl.id === changedPatternId && !updateAll) {
      cloneAndReplacePatternIcon(
        patternSelectAreaEl,
        replaceeEl,
        songModeSelectedPatternSequenceIndex,
        songBuilderDropAreaEl,
        index
      );
    } else {
      //update all
      cloneAndReplacePatternIcon(
        patternSelectAreaEl,
        replaceeEl,
        songModeSelectedPatternSequenceIndex,
        songBuilderDropAreaEl,
        index
      );
    } */
  });
};

const cloneAndReplacePatternIcon = (
  patternSelectAreaEl,
  replaceeEl,
  songModeSelectedPatternSequenceIndex,
  songBuilderDropAreaEl,
  index
) => {
  let elReplacerParent = Array.from(patternSelectAreaEl.childNodes).filter(
    elReplacer => elReplacer.id === replaceeEl.id
  )[0];

  let clonedReplacer = elReplacerParent.cloneNode(true);
  //handle class disappearing
  if (index === songModeSelectedPatternSequenceIndex) {
    replaceeEl.className = 'selected-pattern';
  } else {
    replaceeEl.className = 'slight-opacity';
  }

  let arrayOfChildren = Array.from(clonedReplacer.children).map(child => child);

  while (replaceeEl.firstChild) {
    replaceeEl.removeChild(replaceeEl.firstChild);
  }

  arrayOfChildren.forEach(elem => {
    replaceeEl.appendChild(elem);
  });

  // original solution
  // songBuilderDropAreaEl.replaceChild(clonedReplacer, replaceeEl);
};

const returnTriggersToCopyArr = (patternToCopyIndex, state) => {
  let triggersToCopyArr = [];

  let patternToCopyStartId = patternToCopyIndex * 16;
  let patternToCopyEndId = patternToCopyStartId + 16;

  for (let sequencer in state.sequencers) {
    let tempTriggers = state.sequencers[sequencer].triggers.filter(
      (trigger, index) => {
        return index >= patternToCopyStartId && index < patternToCopyEndId;
      }
    );

    triggersToCopyArr.push(tempTriggers);
  }

  return triggersToCopyArr;
};

const returnClickSamplerRef = () => {
  return new Tone.Sampler({ C2: lowClick, C3: highClick }).chain(
    new Tone.Volume(-10),
    Tone.Master
  );
};

const returnNewMetronomeScheduleIdArr = (scheduleArray, clickSamplerRef) => {
  return scheduleArray.map((scheduleId, index) => {
    let iValue = 192 * index;
    if (index === 0) {
      return Tone.Transport.schedule(time => {
        clickSamplerRef.triggerAttackRelease('C3', '192i', time, 1);
      }, iValue + 'i');
    } else {
      return Tone.Transport.schedule(time => {
        clickSamplerRef.triggerAttackRelease('C2', '192i', time, 1);
      }, iValue + 'i');
    }
  });
};

const returnNormalizedTimingValue = (timingValue, patternIndex) => {
  return timingValue - patternIndex * 768;
};

const returnPatternTrigger = (
  note,
  duration,
  time,
  velocity,
  synthesizerRef,
  scheduleId
) => {
  let patternTrigger = {};

  patternTrigger.note = note;
  patternTrigger.duration = duration;
  patternTrigger.time = time;
  patternTrigger.velocity = velocity;
  patternTrigger.synthesizerRef = synthesizerRef;
  patternTrigger.scheduleId = scheduleId;

  return patternTrigger;
};

const initialState = {
  isEditingTrigger: false,
  triggerBeingEditedId: null,
  sequencerBeingEditedId: null,
  isPlaying: false,
  sequencersIdArr: [],
  sequencers: {},
  samples: {},
  bpm: 120,
  isMetronomeOn: false,
  metronome: {
    clickSamplerRef: returnClickSamplerRef(),
    scheduleArray: [null, null, null, null]
  },
  playBackMode: 'pattern',
  UiMode: 'pattern',
  patternsArr: ['PATTERN 1'],
  currentPatternIndex: 0,
  songArr: [],
  returnSongPatternStartTimesArr: [],
  songModeSelectedPattern: null,
  songModeSelectedPatternDomRef: null,
  songModeSelectedPatternSequenceIndex: null
};

var GLOBAL_PATTERN_TRIGGERS = [[]];

const buildPatternTimeline = currentPatternIndex => {
  //clear current timeline
  Tone.Transport.cancel();

  //iterate through triggers in global array and set events
  GLOBAL_PATTERN_TRIGGERS[currentPatternIndex].forEach(trigger => {
    let {
      synthesizerRef,
      note,
      duration,
      normalizedTimingValue,
      velocity
    } = trigger;

    let newScheduleId = new Tone.Event(time => {
      synthesizerRef.triggerAttackRelease(note, duration, time, velocity);
    }).start(normalizedTimingValue + 'i');

    trigger.scheduleId = newScheduleId;
  });
};

const buildSongTimeline = songArr => {
  //clear current timeline
  Tone.Transport.cancel();

  songArr.forEach((patternIndex, index) => {
    GLOBAL_PATTERN_TRIGGERS[patternIndex].forEach(trigger => {
      let {
        synthesizerRef,
        note,
        duration,
        normalizedTimingValue,
        velocity
      } = trigger;

      let newScheduleId = new Tone.Event(time => {
        synthesizerRef.triggerAttackRelease(note, duration, time, velocity);
      }).start(normalizedTimingValue + index * 768 + 'i');

      trigger.scheduleId = newScheduleId;
    });
  });
};

//this function returns the song array based on the ui in drop area
const returnSongPatternIndexArr = state => {
  const songBuilderDropArea = document.getElementById('songBuilderDropArea');

  return Array.from(songBuilderDropArea.childNodes)
    .map((childNode, index) => {
      //makes list of pattern id's
      return childNode.id;
    })
    .map(patternName => {
      //convert pattern names to index of patternsArr
      let indexInPatternsArr;
      state.patternsArr.forEach((pattern, index) => {
        if (pattern === patternName) indexInPatternsArr = index;
      });

      return indexInPatternsArr;
    });
};

const addPatternTriggerToArr = (patternTrigger, currentPatternIndex) => {
  GLOBAL_PATTERN_TRIGGERS[currentPatternIndex].push(patternTrigger);
};

//set the transport to repeat
// Tone.Transport.loopEnd = '1m';
Tone.Transport.loopStart = '0i';
Tone.Transport.loopEnd = '768i';
Tone.Transport.loop = true;
Tone.Transport.bpm.value = 120;

const setTransportLoopStartEnd = state => {
  if (state.playBackMode === 'pattern') {
    Tone.Transport.loopStart = '0i';
    Tone.Transport.loopEnd = '768i';
  } else if (state.playBackMode === 'song') {
    let transportEnd = state.songArr.length * 768;
    Tone.Transport.loopStart = '0i';
    Tone.Transport.loopEnd = transportEnd + 'i';
  }
};

const handlePlayButtonClick = play => {
  if (play) {
    Tone.Transport.start('+0.1');
  } else {
    Tone.Transport.pause();
  }
};

const returnSongPatternStartTimesArr = (songListIdArr, patternsArr) => {
  return songListIdArr.map(id => {
    //find out which index 'id' is in patternsArr
    let index = patternsArr.reduce((prevVal, pattern, index) => {
      if (pattern === id) {
        return index;
      } else {
        return prevVal;
      }
    }, 0);

    return returnStartTimeForCurrentPattern(index);
  });
};

const returnStartTimeForCurrentPattern = currentPatternIndex => {
  return currentPatternIndex * 768;
};

const handleStopButtonClick = () => {
  Tone.Transport.stop();
};

const returnClearedTrigger = (trigger, synthRef, currentPatternIndex) => {
  // Tone.Transport.clear(trigger.scheduleId);
  if (trigger.isTriggered) {
    let prevTriggerTime = trigger.timingValue + trigger.nudgeValue;
    clearTriggerInGlobalArr(prevTriggerTime, synthRef, currentPatternIndex);
  }

  trigger.isTriggered = false;
  trigger.scheduleId = null;
  trigger.note = 'C2';

  return trigger;
};

const returnSetTrigger = (
  trigger,
  synthesizerRef,
  note = 'C2',
  duration = '192i',
  velocity = 1,
  isSample,
  state
) => {
  let iValue = trigger.timingValue + trigger.nudgeValue;

  trigger.isTriggered = true;

  trigger.scheduleId = new Tone.Event(time => {
    synthesizerRef.triggerAttackRelease(note, duration, time, velocity);
  });

  trigger.scheduleId.start(
    returnNormalizedTimingValue(iValue, state.currentPatternIndex) + 'i'
  );

  let patternTrigger = returnPatternTrigger(
    note,
    duration,
    iValue,
    velocity,
    synthesizerRef,
    trigger.scheduleId
  );

  patternTrigger.normalizedTimingValue = returnNormalizedTimingValue(
    iValue,
    state.currentPatternIndex
  );
  addPatternTriggerToArr(patternTrigger, state.currentPatternIndex);

  //set triggers' attributes
  trigger.note = note;
  trigger.duration = duration;
  trigger.velocity = velocity;

  return trigger;
};

const returnTriggerAttributes = trigger => {
  return {
    timingValue: trigger.timingValue,
    note: trigger.note,
    duration: trigger.duration,
    velocity: trigger.velocity
  };
};

const playClickedTrigger = (
  triggerRef,
  sequencerId,
  synthesizerRef,
  parentTriggerId,
  triggerId,
  isSlicee
) => {
  synthesizerRef.triggerAttackRelease(
    triggerRef.note,
    triggerRef.duration,
    undefined,
    triggerRef.velocity
  );
};

const returnNewSamplesObj = (sample, state) => {
  let newSamplesObj = { ...state.samples };
  let sampleName = [sample];

  newSamplesObj[sampleName] = sample;

  return newSamplesObj;
};

const returnArrayOfCurrentlyTriggered = parentTrigger => {
  // get note, duration, velocity, and timevalue
  let arrayOfCurrentlyTriggeredAttrs = [];
  if (!parentTrigger.isSliced) {
    //case: this is the first slice

    let tempTriggerAttrObj = {};
    if (parentTrigger.isTriggered) {
      tempTriggerAttrObj = returnTriggerAttributes(parentTrigger);
      return arrayOfCurrentlyTriggeredAttrs.concat(tempTriggerAttrObj);
    } else {
      return [];
    }
  } else {
    //case:  parentTrigger has already been sliced
    //iterate through slicedTriggers and get the attributes
    let currentlyTriggered = parentTrigger.slicedTriggers.filter(
      slicedTrigger => {
        return slicedTrigger.isTriggered;
      }
    );
    arrayOfCurrentlyTriggeredAttrs = currentlyTriggered.map(slicedTrigger => {
      return returnTriggerAttributes(slicedTrigger);
    });

    return arrayOfCurrentlyTriggeredAttrs;
  }
};

const returnHandledSampleTrigger = (trigger, synthesizerRef, state) => {
  if (trigger.isTriggered) {
    trigger = returnClearedTrigger(
      trigger,
      synthesizerRef,
      state.currentPatternIndex
    );
  } else {
    trigger = returnSetTrigger(
      trigger,
      synthesizerRef,
      'C2',
      trigger.duration,
      trigger.velocity,
      true,
      state
    );
  }

  return trigger;
};

const retriggerScheduledTriggers = (
  currentlyTriggeredTriggersObjArr,
  tempSlicedTrigger,
  synthesizerRef,
  state
) => {
  for (let i = 0; i < currentlyTriggeredTriggersObjArr.length; i++) {
    if (
      tempSlicedTrigger.timingValue ===
      currentlyTriggeredTriggersObjArr[i].timingValue
    ) {
      //need to apply previous triggers' note, duration, and velocity here
      tempSlicedTrigger.note = currentlyTriggeredTriggersObjArr[i].note;
      tempSlicedTrigger.duration = currentlyTriggeredTriggersObjArr[i].duration;
      tempSlicedTrigger.velocity = currentlyTriggeredTriggersObjArr[i].velocity;
      tempSlicedTrigger = returnSetTrigger(
        tempSlicedTrigger,
        synthesizerRef,
        'C2',
        tempSlicedTrigger.duration,
        tempSlicedTrigger.velocity,
        true,
        state
      );
    }
  }
};

const clearAllSlicedTriggers = (
  parentTrigger,
  synthRef,
  currentPatternIndex
) => {
  for (let i = 0; i < parentTrigger.slicedTriggers.length; i++) {
    // Tone.Transport.clear(parentTrigger.slicedTriggers[i].scheduleId);
    if (parentTrigger.slicedTriggers[i].isTriggered) {
      let prevTriggerTime =
        parentTrigger.slicedTriggers[i].timingValue +
        parentTrigger.slicedTriggers[i].nudgeValue;
      clearTriggerInGlobalArr(prevTriggerTime, synthRef, currentPatternIndex);
    }
  }
};

const clearPreviouslyScheduledTrigger = (
  isSlicee,
  sequencerRef,
  parentTriggerId,
  triggerId,
  currentPatternIndex,
  nudgeOffset = 0
) => {
  let prevTriggerTime,
    prevTriggerSynthRef = sequencerRef.synthesizerRef;

  if (isSlicee) {
    prevTriggerTime =
      sequencerRef.triggers[parentTriggerId].slicedTriggers[triggerId]
        .timingValue +
      sequencerRef.triggers[parentTriggerId].slicedTriggers[triggerId]
        .nudgeValue;
  } else {
    prevTriggerTime =
      sequencerRef.triggers[triggerId].timingValue +
      sequencerRef.triggers[triggerId].nudgeValue;
  }

  clearTriggerInGlobalArr(
    prevTriggerTime,
    prevTriggerSynthRef,
    currentPatternIndex,
    nudgeOffset
  );
};

const clearTriggerInGlobalArr = (
  prevTriggerTime,
  prevTriggerSynthRef,
  currentPatternIndex,
  nudgeOffset = 0
) => {
  let matchingGlobalTriggerIndex;
  let matchingGlobalTrigger = GLOBAL_PATTERN_TRIGGERS[
    currentPatternIndex
  ].filter((trigger, index) => {
    if (
      trigger.time === prevTriggerTime &&
      trigger.synthesizerRef === prevTriggerSynthRef
    ) {
      matchingGlobalTriggerIndex = index;
      return true;
    } else {
      return false;
    }
  })[0];

  //cancel tone.event
  matchingGlobalTrigger.scheduleId.dispose();

  //remove from the global array
  GLOBAL_PATTERN_TRIGGERS[currentPatternIndex].splice(
    matchingGlobalTriggerIndex,
    1
  );
};

const returnEmptySlicedTriggersArr = parentTrigger => {
  let tempSlicedTriggersArr = [];
  const newNumOfSlicedTriggers = parentTrigger.sliceAmount * 4;

  for (let i = 0; i < newNumOfSlicedTriggers; i++) {
    let tempTrigger = returnSingleSlicedTrigger();

    //add timingValue property
    tempTrigger.timingValue =
      parentTrigger.id * 48 + 48 / newNumOfSlicedTriggers * i;

    tempSlicedTriggersArr = tempSlicedTriggersArr.concat(tempTrigger);
  }

  return tempSlicedTriggersArr;
};

const returnSlicedTriggersArr = (
  parentTrigger,
  triggerId,
  state,
  sequencerId,
  currentlyTriggeredTriggersObjArr,
  synthesizerRef
) => {
  const numOfSlicedTriggers = parentTrigger.sliceAmount * 4;
  const iValueScale = 48 / numOfSlicedTriggers;

  let tempSlicedTriggersArr = [];

  for (let i = 0; i < numOfSlicedTriggers; i++) {
    // push new triggers onto newTriggers array
    let tempSlicedTrigger = returnSingleSlicedTrigger();
    tempSlicedTrigger.id = 'trigger' + triggerId + 'slice' + i;
    tempSlicedTrigger.timingValue =
      i * iValueScale +
      state.sequencers[sequencerId].triggers[triggerId].timingValue;
    retriggerScheduledTriggers(
      currentlyTriggeredTriggersObjArr,
      tempSlicedTrigger,
      synthesizerRef,
      state
    );

    tempSlicedTriggersArr = tempSlicedTriggersArr.concat(tempSlicedTrigger);
  }

  return tempSlicedTriggersArr;
};

const returnDeSlicedParentTrigger = parentTrigger => {
  // case: we are on the correct parent trigger
  parentTrigger.sliceAmount = parentTrigger.sliceAmount - 1;

  if (parentTrigger.sliceAmount === 0) {
    parentTrigger.isSliced = false;
  }

  let tempSlicedTriggersArr = returnEmptySlicedTriggersArr(parentTrigger);

  parentTrigger.slicedTriggers = tempSlicedTriggersArr;

  return parentTrigger;
};

const returnSlicedParentTrigger = (
  parentTrigger,
  triggerId,
  state,
  sequencerId,
  synthesizerRef
) => {
  let currentlyTriggeredTriggersObjArr = returnArrayOfCurrentlyTriggered(
    parentTrigger
  );
  //clear parent trigger
  parentTrigger = returnClearedTrigger(
    parentTrigger,
    synthesizerRef,
    state.currentPatternIndex
  );

  clearAllSlicedTriggers(
    parentTrigger,
    synthesizerRef,
    state.currentPatternIndex
  );

  parentTrigger.isSliced = true;
  parentTrigger.sliceAmount = parentTrigger.sliceAmount + 1;

  //create new sliced triggers array
  let tempSlicedTriggersArr = returnSlicedTriggersArr(
    parentTrigger,
    triggerId,
    state,
    sequencerId,
    currentlyTriggeredTriggersObjArr,
    synthesizerRef
  );

  parentTrigger.slicedTriggers = tempSlicedTriggersArr;

  return parentTrigger;
};

/*****************************
 **
 **		reducer
 **
 ******************************/

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_NEW_SEQUENCER': {
      //payload should include:  sequencerId, sample
      const { sequencerId, sample } = action;

      let tempSequencers = setupNewSequencer(sequencerId, state, sample);
      let tempSequencersIdArr = returnNewSequencersIdArr(tempSequencers);
      let tempSamplesObj = returnNewSamplesObj(sample, state);

      return {
        ...state,
        sequencersIdArr: [...tempSequencersIdArr],
        sequencers: {
          ...state.sequencers,
          ...tempSequencers
        },
        samples: {
          ...tempSamplesObj
        }
      };
    }

    case 'PARENT_TRIGGER_CLICKED': {
      const { triggerId, sequencerId, isTurningOn } = action;

      const synthesizerRef = state.sequencers[sequencerId].synthesizerRef;

      isTurningOn && synthesizerRef.triggerAttackRelease('C2', 1, undefined, 1);

      const newTriggers = state.sequencers[sequencerId].triggers.map(
        trigger => {
          let tempTrigger = { ...trigger };

          if (tempTrigger.id === triggerId) {
            tempTrigger = returnHandledSampleTrigger(
              tempTrigger,
              synthesizerRef,
              state
            );

            // if (tempTrigger.isTriggered && !state.isPlaying) {
            //   playClickedTrigger(
            //     tempTrigger,
            //     sequencerId,
            //     synthesizerRef,
            //     null,
            //     triggerId,
            //     false
            //   );
            // }
          }

          return tempTrigger;
        }
      );

      // updateSongBuilderPatternIcons(state.currentPatternIndex);

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...state.sequencers[sequencerId],
            triggers: newTriggers
          }
        }
      };
    }
    case 'SLICEE_TRIGGER_CLICKED': {
      const { triggerId, sequencerId, parentTriggerId, isTurningOn } = action;
      const synthesizerRef = state.sequencers[sequencerId].synthesizerRef;

      isTurningOn && synthesizerRef.triggerAttackRelease('C2', 1, undefined, 1);

      let newTriggers = state.sequencers[sequencerId].triggers.map(trigger => {
        let tempTrigger = { ...trigger };

        if (tempTrigger.id === parentTriggerId) {
          // found parent trigger - iterate through sliced triggers
          let tempSlicedTriggersArr = tempTrigger.slicedTriggers.map(
            (slicedTrigger, index) => {
              let tempSlicedTrigger = { ...slicedTrigger };

              if (index === triggerId) {
                tempSlicedTrigger = returnHandledSampleTrigger(
                  tempSlicedTrigger,
                  synthesizerRef,
                  state
                );

                // if (tempSlicedTrigger.isTriggered && !state.isPlaying) {
                //   playClickedTrigger(
                //     tempSlicedTrigger,
                //     sequencerId,
                //     synthesizerRef,
                //     parentTriggerId,
                //     triggerId,
                //     true
                //   );
                // }
              }

              return tempSlicedTrigger;
            }
          );

          tempTrigger.slicedTriggers = tempSlicedTriggersArr;

          return tempTrigger;
        } else {
          return tempTrigger;
        }
      });

      // updateSongBuilderPatternIcons(state.currentPatternIndex);

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...state.sequencers[sequencerId],
            triggers: newTriggers
          }
        }
      };
    }
    case 'PATTERN_SELECT_RERENDERED': {
      if (state.songArr.length > 0) {
        updateSongBuilderPatternIcons(
          state.currentPatternIndex,
          action.updateAll,
          state.songModeSelectedPatternSequenceIndex
        );
      }

      return {
        ...state
      };
    }
    case 'PLAY_BUTTON_CLICKED': {
      setTransportLoopStartEnd(state);

      handlePlayButtonClick(!state.isPlaying);

      return {
        ...state,
        isPlaying: !state.isPlaying
      };
    }
    case 'STOP_BUTTON_CLICKED': {
      handleStopButtonClick();

      return {
        ...state,
        isPlaying: false
      };
    }
    case 'PLAYBACK_MODE_CLICKED': {
      const playBackMode = action.playBackMode;

      handleStopButtonClick();

      if (playBackMode === 'song') {
        buildSongTimeline(state.songArr);
      } else if (playBackMode === 'pattern') {
        buildPatternTimeline(state.currentPatternIndex);
      }

      return {
        ...state,
        playBackMode: playBackMode,
        isPlaying: false
      };
    }
    case 'MODE_SELECTOR_CLICKED': {
      const mode = action.mode;
      let isPlaying = false;

      handleStopButtonClick();

      if (mode === 'song') {
        buildSongTimeline(state.songArr);
      } else if (mode === 'pattern') {
        buildPatternTimeline(state.currentPatternIndex);
      }

      return {
        ...state,
        UiMode: mode,
        playBackMode: mode,
        isPlaying: isPlaying
      };
    }
    case 'PATTERN_CHANGED': {
      const patternIndex = action.patternIndex;

      //stop playback
      handleStopButtonClick();

      buildPatternTimeline(patternIndex);

      return {
        ...state,
        playBackMode: 'pattern',
        UiMode: 'pattern',
        currentPatternIndex: patternIndex,
        isPlaying: false
      };
    }
    case 'SONG_UPDATED': {
      const songListIdArr = action.listIdArr;
      const newIndex = action.newIndex;

      const songPatternStartTimesArr = returnSongPatternStartTimesArr(
        songListIdArr,
        state.patternsArr
      );

      handleStopButtonClick();

      //list of pattern id's to list of pattern indexes
      let songListPatternIndexArr = songListIdArr.map(id => {
        return state.patternsArr.reduce((prevVal, pattern, index) => {
          if (id === pattern) return index;
          else return prevVal;
        }, null);
      });

      if (state.playBackMode === 'song') {
        buildSongTimeline(songListPatternIndexArr);
      }

      let newSelectedPatternId =
        state.patternsArr[songListPatternIndexArr[newIndex]];

      return {
        ...state,
        songArr: songListPatternIndexArr,
        songPatternStartTimesArr: songPatternStartTimesArr,
        isPlaying: false,
        songModeSelectedPatternSequenceIndex: newIndex,
        songModeSelectedPattern: newSelectedPatternId
      };
    }
    case 'BLANK_PATTERN_ADDED': {
      const startTimeValue = state.patternsArr.length * 768;
      const startIdNum = state.patternsArr.length * 16;
      let arrayOfNewSequencers = returnArrayOfNewSequencers(
        state.sequencers,
        startTimeValue,
        startIdNum
      );

      //create new sequencers object
      let newSequencersObj = returnNewSequencersObj(
        arrayOfNewSequencers,
        state
      );

      //update state.patternsArr
      let newPatternsArr = state.patternsArr.concat(
        'PATTERN ' + (state.patternsArr.length + 1)
      );

      //update state.currentPatternIndex
      let newCurrentPatternIndex = newPatternsArr.length - 1;

      //stop playback
      handleStopButtonClick();

      //add new array to GLOBAL_PATTERN_TRIGGERS
      GLOBAL_PATTERN_TRIGGERS.push([]);

      //update Timeline
      buildPatternTimeline(newCurrentPatternIndex);

      return {
        ...state,
        sequencers: newSequencersObj,
        patternsArr: newPatternsArr,
        currentPatternIndex: newCurrentPatternIndex,
        isPlaying: false,
        UiMode: action.switchToPattern ? 'pattern' : 'song'
      };
    }
    case 'COPIED_PATTERN_ADDED': {
      let { patternToCopy } = action;

      let patternToCopyIndex = returnIndexOfPattern(
        patternToCopy,
        state.patternsArr
      );

      let triggersToCopyArr = returnTriggersToCopyArr(
        patternToCopyIndex,
        state
      );

      // at this point, the blank pattern should already have been added, so lets make a deep copy of the triggers to copy
      let clonedTriggers = deepCopy(triggersToCopyArr);
      //update id's and timing values
      clonedTriggers = returnUpdatedTimingAndIdTriggers(
        state.currentPatternIndex,
        clonedTriggers,
        patternToCopyIndex
      );

      //do same process as adding blank pattern above - create whole new sequencers object to maintain immutability pattern
      let arrayOfNewSequencers = returnArrayOfNewSequencersWithCopiedPattern(
        state.sequencers,
        clonedTriggers,
        state.currentPatternIndex
      );

      let newSequencersObj = returnNewSequencersObj(
        arrayOfNewSequencers,
        state
      );

      copyGlobalPatternTriggers(patternToCopyIndex);

      buildPatternTimeline(state.currentPatternIndex);

      return {
        ...state,
        sequencers: newSequencersObj
      };
    }
    case 'EDITING_TRIGGER': {
      return {
        ...state,
        isEditingTrigger: action.isEditingTrigger,
        triggerBeingEditedId: action.triggerBeingEditedId,
        sequencerBeingEditedId: action.sequencerBeingEditedId
      };
    }
    case 'EDITING_SYNTHESIZER': {
      return {
        ...state,
        sequencerBeingEditedId: action.sequencerBeingEditedId
      };
    }
    case 'SYNTHESIZER_CHANGED': {
      return {
        ...state
      };
    }
    case 'EDIT_TRIGGER_NOTE': {
      const sequencerId = state.sequencerBeingEditedId;

      const newTriggers = state.sequencers[sequencerId].triggers.map(
        trigger => {
          let tempTrigger = { ...trigger }; //create new object to avoid mutating original

          if (tempTrigger.id === state.triggerBeingEditedId) {
            if (tempTrigger.isTriggered) {
              //trigger was already triggered, need to clear the previously scheduled trigger
              Tone.Transport.clear(tempTrigger.scheduleId);

              return returnSetTrigger(
                tempTrigger,
                state.sequencers[sequencerId].synthesizerRef,
                action.newNote,
                tempTrigger.duration,
                tempTrigger.velocity,
                false,
                state
              );
            } else {
              //case:  trigger wasn't triggered
              return returnSetTrigger(
                tempTrigger,
                state.sequencers[sequencerId].synthesizerRef,
                action.newNote,
                tempTrigger.duration,
                tempTrigger.velocity,
                false,
                state
              );
            }
          } else {
            return tempTrigger;
          }
        }
      );

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...state.sequencers[sequencerId],
            triggers: newTriggers
          }
        }
      };
    }
    case 'TRIGGER_SLICED': {
      const sequencerId = action.sequencerBeingEditedId;
      const triggerId = action.triggerBeingEditedId;
      const synthesizerRef = state.sequencers[sequencerId].synthesizerRef;

      //iterate through all parent triggers
      let newTriggers = state.sequencers[sequencerId].triggers.map(trigger => {
        let parentTrigger = { ...trigger };

        if (parentTrigger.id === triggerId) {
          parentTrigger = returnSlicedParentTrigger(
            parentTrigger,
            triggerId,
            state,
            sequencerId,
            synthesizerRef
          );
        }

        return parentTrigger;
      });

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...state.sequencers[sequencerId],
            triggers: newTriggers
          }
        }
      };
    }
    case 'TRIGGER_UNSLICED': {
      const sequencerId = action.sequencerBeingEditedId;
      const triggerId = action.triggerBeingEditedId;
      const synthRef = state.sequencers[sequencerId].synthesizerRef;

      //check if unable to unslice further
      if (state.sequencers[sequencerId].triggers[triggerId].sliceAmount === 0) {
        console.log('cant unslice anymore!');
        return {
          ...state
        };
      }

      clearAllSlicedTriggers(
        state.sequencers[sequencerId].triggers[triggerId],
        synthRef,
        state.currentPatternIndex
      );

      let newTriggers = state.sequencers[sequencerId].triggers.map(trigger => {
        let parentTrigger = { ...trigger };

        if (parentTrigger.id === triggerId) {
          parentTrigger = returnDeSlicedParentTrigger(parentTrigger);
        }

        return parentTrigger;
      });

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...state.sequencers[sequencerId],
            triggers: newTriggers
          }
        }
      };
    }
    case 'CHANGE_NOTE_DURATION': {
      const { triggerId, newDurationStr, isSlicee, parentTriggerId } = action;
      const sequencerRef = state.sequencers[state.sequencerBeingEditedId];
      const sequencerId = state.sequencerBeingEditedId;
      const synthesizerRef = sequencerRef.synthesizerRef;

      clearPreviouslyScheduledTrigger(
        isSlicee,
        sequencerRef,
        parentTriggerId,
        triggerId,
        state.currentPatternIndex
      );

      //create new parent triggers array and schedule new trigger
      const newTriggers = sequencerRef.triggers.map(trigger => {
        let tempTrigger = { ...trigger };

        if (isSlicee) {
          if (tempTrigger.id === parentTriggerId) {
            //found parent trigger - iterate through sliced triggers
            let tempSlicedTriggersArr = tempTrigger.slicedTriggers.map(
              (slicedTrigger, index) => {
                let tempSlicedTrigger = { ...slicedTrigger };

                if (index === triggerId) {
                  // found slicee trigger - schedule new trigger
                  tempSlicedTrigger = returnSetTrigger(
                    tempSlicedTrigger,
                    synthesizerRef,
                    'C2',
                    newDurationStr,
                    tempSlicedTrigger.velocity,
                    true,
                    state
                  );
                }

                return tempSlicedTrigger;
              }
            );

            tempTrigger.slicedTriggers = tempSlicedTriggersArr;
          }
        } else {
          if (tempTrigger.id === triggerId) {
            //found correct trigger - shedule new trigger
            tempTrigger = returnSetTrigger(
              tempTrigger,
              synthesizerRef,
              'C2',
              newDurationStr,
              tempTrigger.velocity,
              true,
              state
            );
          }
        }

        return tempTrigger;
      });

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...state.sequencers[sequencerId],
            triggers: newTriggers
          }
        }
      };
    }
    case 'CHANGE_NOTE_VELOCITY': {
      const { triggerId, parentTriggerId, isSlicee, newVelocity } = action;
      const sequencerRef = state.sequencers[state.sequencerBeingEditedId];
      const sequencerId = state.sequencerBeingEditedId;
      const synthesizerRef = sequencerRef.synthesizerRef;

      clearPreviouslyScheduledTrigger(
        isSlicee,
        sequencerRef,
        parentTriggerId,
        triggerId,
        state.currentPatternIndex
      );

      //create new parent triggers array and schedule new trigger
      const newTriggers = sequencerRef.triggers.map(trigger => {
        let tempTrigger = { ...trigger };

        if (isSlicee) {
          if (tempTrigger.id === parentTriggerId) {
            //found parent trigger - iterate through sliced triggers
            let tempSlicedTriggersArr = tempTrigger.slicedTriggers.map(
              (slicedTrigger, index) => {
                let tempSlicedTrigger = { ...slicedTrigger };

                if (index === triggerId) {
                  // found slicee trigger - schedule new trigger
                  tempSlicedTrigger = returnSetTrigger(
                    tempSlicedTrigger,
                    synthesizerRef,
                    'C2',
                    tempSlicedTrigger.duration,
                    newVelocity,
                    true,
                    state
                  );
                }

                return tempSlicedTrigger;
              }
            );

            tempTrigger.slicedTriggers = tempSlicedTriggersArr;
          }
        } else {
          if (tempTrigger.id === triggerId) {
            //found correct trigger - shedule new trigger
            tempTrigger = returnSetTrigger(
              tempTrigger,
              synthesizerRef,
              'C2',
              tempTrigger.duration,
              newVelocity,
              true,
              state
            );
          }
        }

        return tempTrigger;
      });

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...state.sequencers[sequencerId],
            triggers: newTriggers
          }
        }
      };
    }
    case 'CHANGE_NOTE_NUDGE': {
      const { triggerId, parentTriggerId, isSlicee, nudgeValue } = action;
      const sequencerRef = state.sequencers[state.sequencerBeingEditedId];
      const sequencerId = state.sequencerBeingEditedId;
      const synthesizerRef = sequencerRef.synthesizerRef;

      clearPreviouslyScheduledTrigger(
        isSlicee,
        sequencerRef,
        parentTriggerId,
        triggerId,
        state.currentPatternIndex,
        nudgeValue
      );

      const newTriggers = sequencerRef.triggers.map(trigger => {
        let tempTrigger = { ...trigger };

        if (isSlicee) {
          if (tempTrigger.id === parentTriggerId) {
            //found parent trigger - iterate through sliced triggers
            let tempSlicedTriggersArr = tempTrigger.slicedTriggers.map(
              (slicedTrigger, index) => {
                let tempSlicedTrigger = { ...slicedTrigger };

                if (index === triggerId) {
                  // found slicee trigger - schedule new trigger
                  tempSlicedTrigger.nudgeValue = nudgeValue;
                  tempSlicedTrigger = returnSetTrigger(
                    tempSlicedTrigger,
                    synthesizerRef,
                    'C2',
                    tempSlicedTrigger.duration,
                    tempSlicedTrigger.velocity,
                    true,
                    state
                  );
                }

                return tempSlicedTrigger;
              }
            );

            tempTrigger.slicedTriggers = tempSlicedTriggersArr;
          }
        } else {
          if (tempTrigger.id === triggerId) {
            //found correct trigger - schedule new trigger
            tempTrigger.nudgeValue = nudgeValue;
            tempTrigger = returnSetTrigger(
              tempTrigger,
              synthesizerRef,
              'C2',
              tempTrigger.duration,
              tempTrigger.velocity,
              true,
              state
            );
          }
        }

        return tempTrigger;
      });

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...state.sequencers[sequencerId],
            triggers: newTriggers
          }
        }
      };
    }
    case 'CHANGE_PAN_VALUE': {
      let { newPanVal, sequencerId } = action;
      let sequencerRef = { ...state.sequencers[sequencerId] };

      sequencerRef.panRef.pan.value = newPanVal;
      sequencerRef.panVal = newPanVal;

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...sequencerRef
          }
        }
      };
    }
    case 'CHANGE_PITCH_VALUE': {
      const { newPitchVal, sequencerId } = action;
      let sequencerRef = { ...state.sequencers[sequencerId] };

      sequencerRef.pitchRef.pitch = newPitchVal;
      sequencerRef.pitchVal = newPitchVal;

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...sequencerRef
          }
        }
      };
    }
    case 'CHANGE_VOLUME_VALUE': {
      const { newVolumeVal, sequencerId } = action;
      let sequencerRef = { ...state.sequencers[sequencerId] };

      sequencerRef.volumeRef.volume.value = newVolumeVal;
      sequencerRef.volumeVal = newVolumeVal;

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...sequencerRef
          }
        }
      };
    }
    case 'CHANGE_MUTE_STATE': {
      const { sequencerId } = action;
      let sequencerRef = { ...state.sequencers[sequencerId] };

      sequencerRef.volumeRef.mute = !sequencerRef.isMuted;
      sequencerRef.isMuted = !sequencerRef.isMuted;

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...sequencerRef
          }
        }
      };
    }
    case 'CHANGE_SOLO_STATE': {
      const { sequencerId } = action;
      let sequencerRef = { ...state.sequencers[sequencerId] };

      sequencerRef.soloRef.solo = !sequencerRef.isSoloed;
      sequencerRef.isSoloed = !sequencerRef.isSoloed;

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...sequencerRef
          }
        }
      };
    }
    case 'INCREASE_BPM': {
      let newBpm = state.bpm + 1;

      Tone.Transport.bpm.value = newBpm;

      if (newBpm > 300) {
        newBpm = 300;
      }

      return {
        ...state,
        bpm: newBpm
      };
    }
    case 'DECREASE_BPM': {
      let newBpm = state.bpm - 1;

      if (newBpm < 1) {
        newBpm = 1;
      }

      Tone.Transport.bpm.value = newBpm;

      return {
        ...state,
        bpm: newBpm
      };
    }
    case 'TOGGLE_METRONOME': {
      let newMetronomeScheduleIdArr;

      if (state.isMetronomeOn) {
        //clear scheduled metronome Transport.schedule
        newMetronomeScheduleIdArr = state.metronome.scheduleArray.map(
          scheduleId => {
            //clear id
            Tone.Transport.clear(scheduleId);
            return null;
          }
        );
      } else {
        // schedule metronome clicks
        newMetronomeScheduleIdArr = returnNewMetronomeScheduleIdArr(
          state.metronome.scheduleArray,
          state.metronome.clickSamplerRef
        );
      }

      return {
        ...state,
        metronome: {
          ...state.metronome,
          scheduleArray: newMetronomeScheduleIdArr
        },
        isMetronomeOn: !state.isMetronomeOn
      };
    }
    case 'SONG_MODE_PATTERN_SELECTED': {
      let { sequenceInSongIndex, patternName } = action;

      /*
        not happy about manipulating dom directly here, but couldn't 
        figure out how to show selected pattern any other way
      */
      // get reference to drop area
      let songBuilderDropArea = document.getElementById('songBuilderDropArea');

      //iterate through the children (patterns in song) and remove any 'selected-pattern' styling class
      Array.from(songBuilderDropArea.childNodes).forEach((childNode, index) => {
        // .classList.remove('selected-pattern');
        songBuilderDropArea.childNodes.item(index).className = 'slight-opacity';
      });

      //add 'selected-pattern' styling to element that was clicked
      let elemClicked = songBuilderDropArea.childNodes.item(
        sequenceInSongIndex
      );

      // elemClicked.classList.add('selected-pattern');
      elemClicked.className = 'selected-pattern';

      return {
        ...state,
        songModeSelectedPattern: patternName,
        songModeSelectedPatternSequenceIndex: sequenceInSongIndex,
        songModeSelectedPatternDomRef: /* elemClicked */ action.patternDomRef
      };
    }
    case 'REMOVE_PATTERN_FROM_SONG': {
      // const elemToRemove = state.songModeSelectedPatternDomRef;

      const elemToRemove = document.querySelector('.selected-pattern');
      //remove DOM element
      elemToRemove.remove();

      handleStopButtonClick();

      //this function returns the song array based on the ui in drop area
      const newSongArr = returnSongPatternIndexArr(state);

      buildSongTimeline(newSongArr);

      // updateSongBuilderPatternIcons(
      //   state.currentPatternIndex,
      //   true,
      //   state.songModeSelectedPatternSequenceIndex
      // );

      return {
        ...state,
        songArr: newSongArr,
        songModeSelectedPattern: null,
        songModeSelectedPatternDomRef: null,
        songModeSelectedPatternSequenceIndex: null,
        isPlaying: false
      };
    }
    case 'MAKE_UNIQUE_IN_SONG_MODE': {
      // const nodeToChange = state.songModeSelectedPatternDomRef;
      const nodeToChange = document.querySelector('.selected-pattern');

      const newPatternName = state.patternsArr[state.patternsArr.length - 1];

      //change content of el
      nodeToChange.id = newPatternName;
      nodeToChange.innerHTML = newPatternName;

      //update songArr
      const newSongArr = returnSongPatternIndexArr(state);

      //rebuild song timeline
      buildSongTimeline(newSongArr);

      //change songModeSelectedPattern
      const songModeSelectedPattern = newPatternName;

      return {
        ...state,
        songArr: newSongArr,
        songModeSelectedPattern: songModeSelectedPattern
      };
    }
    case 'GO_TO_PATTERN_CLICKED': {
      let newCurrentPatternIndex = state.patternsArr.reduce(
        (prevVal, pattern, index) => {
          if (pattern === state.songModeSelectedPattern) {
            return index;
          } else {
            return prevVal;
          }
        },
        null
      );

      handleStopButtonClick();

      buildPatternTimeline(newCurrentPatternIndex);

      return {
        ...state,
        UiMode: 'pattern',
        currentPatternIndex: newCurrentPatternIndex,
        playBackMode: 'pattern',
        isPlaying: false
      };
    }
    default:
      return state;
  }
};

/*****************************/

const timelineLogger = ({ getState }) => {
  return next => action => {
    const returnValue = next(action);
    const Timeline = { ...Tone.Transport._timeline };

    console.log(`%c TIMELINE`, `color: #ff8000`, Timeline);
    console.log(
      `%c GLOBAL_PATTERN_TRIGGERS`,
      `color: #ff80ff`,
      GLOBAL_PATTERN_TRIGGERS
    );

    return returnValue;
  };
};

/*****************************/

const store = createStore(reducer, applyMiddleware(timelineLogger, logger));

// const muiTheme = {
//   slider: {
//     handleFillColor: 'yellow'
//   }
// };

// const theme = merge(darkBaseTheme, muiTheme);

class App extends Component {
  componentDidMount() {
    store.dispatch({
      type: 'ADD_NEW_SEQUENCER',
      sequencerId: 'closedHiHat1',
      sample: closedHiHat1
    });

    store.dispatch({
      type: 'ADD_NEW_SEQUENCER',
      sequencerId: 'snare1',
      sample: snare1
    });
    store.dispatch({
      type: 'ADD_NEW_SEQUENCER',
      sequencerId: 'kick1',
      sample: kick1
    });
  }

  getChildContext() {
    const width = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );

    const height = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    let mobileViewportContext;

    // if ((width <= 1024 && height <= 768) || (width <= 768 && height <= 1024)) {
    //   // mobileViewportContext = React.createContext(true);
    //   console.log('NOT MOBILE');
    //   return { mobileViewportContext: false };
    // } else {
    //   // mobileViewportContext = React.createContext(false);
    //   console.log('MOBILE SCREEN');
    //   return { mobileViewportContext: true };
    // }
    console.log(window.orientation);

    if (typeof window.orientation !== 'undefined') {
      return { mobileViewportContext: true };
    } else {
      return { mobileViewportContext: false };
    }
  }

  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <div>
            <ToolbarContainer />
            <Sequencers />

            <AddSequencerDropContainer />

            {process.env.REACT_APP_ENV === 'dev' && <StateTreeManager />}

            <SongModeContainer />

            <MixerScreenContainer />
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

App.childContextTypes = {
  mobileViewportContext: PropTypes.bool
};

export default App;
