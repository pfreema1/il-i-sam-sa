import React, { Component } from "react";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import Tone from "tone";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import "./App.css";
import kick1 from "./samples/kick1.wav";
import snare1 from "./samples/snare1.wav";
import closedHiHat1 from "./samples/closedHiHat1.wav";
import ToolbarContainer from "./Containers/ToolbarContainer";
import Sequencers from "./Containers/Sequencers";
import highClick from "./samples/clickHigh.wav";
import lowClick from "./samples/click.wav";
import AddSequencerButtonContainer from "./Containers/AddSequencerButtonContainer";
import SongModeContainer from "./Containers/SongModeContainer";
import StateTreeManager from "./Containers/StateTreeManager";

const returnTriggers = (amount = 16) => {
  let tempTriggersArr = [];

  for (let i = 0; i < amount; i++) {
    let tempObj = {
      id: null,
      timingValue: i * 48,
      nudgeValue: 0,
      scheduleId: null,
      isTriggered: false,
      note: "C2",
      duration: "192i", //full = 192
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
    note: "C2",
    duration: "192i",
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
        clickSamplerRef.triggerAttackRelease("C3", "192i", time, 1);
      }, iValue + "i");
    } else {
      return Tone.Transport.schedule(time => {
        clickSamplerRef.triggerAttackRelease("C2", "192i", time, 1);
      }, iValue + "i");
    }
  });
};

// const partCallbackFn = (time, note, synthRef, duration, velocity) => {
//   synthRef.triggerAttackRelease(note, duration, time, velocity);
// };

// const returnNewTonePart = () => {
//   return new Tone.Part(partCallbackFn).start(0);
// };

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
  playBackMode: "pattern",
  UiMode: "pattern",
  patternsArr: ["Pattern 1"],
  currentPatternIndex: 0,
  songArr: [],
  returnSongPatternStartTimesArr: []
};

var GLOBAL_PATTERN_TRIGGERS = [[]];

const buildPatternTimeline = currentPatternIndex => {
  //clear current timeline
  Tone.Transport.cancel();

  //iterate through triggers in global array and set events
  GLOBAL_PATTERN_TRIGGERS[currentPatternIndex].map(trigger => {
    let {
      synthesizerRef,
      note,
      duration,
      normalizedTimingValue,
      velocity
    } = trigger;

    let newScheduleId = new Tone.Event(time => {
      synthesizerRef.triggerAttackRelease(note, duration, time, velocity);
    }).start(normalizedTimingValue + "i");

    trigger.scheduleId = newScheduleId;
  });
};

const buildSongTimeline = songArr => {
  //clear current timeline
  Tone.Transport.cancel();

  songArr.map((patternIndex, index) => {
    GLOBAL_PATTERN_TRIGGERS[patternIndex].map(trigger => {
      let {
        synthesizerRef,
        note,
        duration,
        normalizedTimingValue,
        velocity
      } = trigger;

      let newScheduleId = new Tone.Event(time => {
        synthesizerRef.triggerAttackRelease(note, duration, time, velocity);
      }).start(normalizedTimingValue + index * 768 + "i");

      trigger.scheduleId = newScheduleId;
    });
  });
};

const addPatternTriggerToArr = (patternTrigger, currentPatternIndex) => {
  GLOBAL_PATTERN_TRIGGERS[currentPatternIndex].push(patternTrigger);
};

//set the transport to repeat
// Tone.Transport.loopEnd = '1m';
Tone.Transport.loopStart = "0i";
Tone.Transport.loopEnd = "768i";
Tone.Transport.loop = true;
Tone.Transport.bpm.value = 120;

const setTransportLoopStartEnd = state => {
  if (state.playBackMode === "pattern") {
    Tone.Transport.loopStart = "0i";
    Tone.Transport.loopEnd = "768i";
  } else if (state.playBackMode === "song") {
    let transportEnd = state.songArr.length * 768;
    Tone.Transport.loopStart = "0i";
    Tone.Transport.loopEnd = transportEnd + "i";
  }
};

const setTransportPositionToLoopStart = startTimeValue => {
  Tone.Transport.position = startTimeValue + "i";
};

const handlePlayButtonClick = play => {
  if (play) {
    Tone.Transport.start("+0.1");
  } else {
    Tone.Transport.pause();
  }
};

const handleSongModePlayButtonClick = songPatternStartTimesArr => {
  let index = 0;
  Tone.Transport.loop = false;

  const myLoop = new Tone.Loop(() => {
    console.log("index: ", index);
    console.log("moving to start time:  ", songPatternStartTimesArr[index]);
    Tone.Transport.stop();

    console.log("Tone.Transport.ticks before:  ", Tone.Transport.ticks);

    Tone.Transport.position = songPatternStartTimesArr[index] + "i";

    console.log("Tone.Transport.ticks after:  ", Tone.Transport.ticks);

    // Tone.Transport.start('+0.1');

    index++;
    if (index >= songPatternStartTimesArr.length) {
      index = 0;
    }
  }, "1m").start(0);

  Tone.Transport.start("+0.1");
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

const handleStopButtonClick = currentPatternIndex => {
  Tone.Transport.stop();
  // Tone.Transport.pause();

  // setTransportPositionToLoopStart(
  //   returnStartTimeForCurrentPattern(currentPatternIndex)
  // );
};

const returnClearedTrigger = (trigger, synthRef, currentPatternIndex) => {
  // Tone.Transport.clear(trigger.scheduleId);
  if (trigger.isTriggered) {
    let prevTriggerTime = trigger.timingValue + trigger.nudgeValue;
    clearTriggerInGlobalArr(prevTriggerTime, synthRef, currentPatternIndex);
  }

  trigger.isTriggered = false;
  trigger.scheduleId = null;
  trigger.note = "C2";

  return trigger;
};

const returnSetTrigger = (
  trigger,
  synthesizerRef,
  note = "C2",
  duration = "192i",
  velocity = 1,
  isSample,
  state
) => {
  let iValue = trigger.timingValue + trigger.nudgeValue;

  trigger.isTriggered = true;

  // if (isSample) {
  //   trigger.scheduleId = Tone.Transport.schedule(time => {
  //     synthesizerRef.triggerAttackRelease(note, duration, time, velocity);
  //   }, iValue + 'i');
  // }

  trigger.scheduleId = new Tone.Event(time => {
    synthesizerRef.triggerAttackRelease(note, duration, time, velocity);
  });

  trigger.scheduleId.start(
    returnNormalizedTimingValue(iValue, state.currentPatternIndex) + "i"
  );

  /*****************************/

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

  /*****************************/

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
      "C2",
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
        "C2",
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
    // Tone.Transport.clear(
    //   sequencerRef.triggers[parentTriggerId].slicedTriggers[triggerId]
    //     .scheduleId
    // );
    prevTriggerTime =
      sequencerRef.triggers[parentTriggerId].slicedTriggers[triggerId]
        .timingValue +
      sequencerRef.triggers[parentTriggerId].slicedTriggers[triggerId]
        .nudgeValue;
  } else {
    // Tone.Transport.clear(sequencerRef.triggers[triggerId].scheduleId);
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

    //********** may need to add id here **********

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
    tempSlicedTrigger.id = "trigger" + triggerId + "slice" + i;
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
    case "ADD_NEW_SEQUENCER": {
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

    case "PARENT_TRIGGER_CLICKED": {
      const { triggerId, sequencerId } = action;

      const synthesizerRef = state.sequencers[sequencerId].synthesizerRef;

      const newTriggers = state.sequencers[sequencerId].triggers.map(
        trigger => {
          let tempTrigger = { ...trigger };

          if (tempTrigger.id === triggerId) {
            tempTrigger = returnHandledSampleTrigger(
              tempTrigger,
              synthesizerRef,
              state
            );

            if (tempTrigger.isTriggered && !state.isPlaying) {
              playClickedTrigger(
                tempTrigger,
                sequencerId,
                synthesizerRef,
                null,
                triggerId,
                false
              );
            }
          }

          return tempTrigger;
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
    case "SLICEE_TRIGGER_CLICKED": {
      const { triggerId, sequencerId, parentTriggerId } = action;
      const synthesizerRef = state.sequencers[sequencerId].synthesizerRef;

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

                if (tempSlicedTrigger.isTriggered && !state.isPlaying) {
                  playClickedTrigger(
                    tempSlicedTrigger,
                    sequencerId,
                    synthesizerRef,
                    parentTriggerId,
                    triggerId,
                    true
                  );
                }
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
    case "PLAY_BUTTON_CLICKED": {
      // if (state.playBackMode === 'pattern') {
      //   handlePlayButtonClick(!state.isPlaying);
      // } else if (state.playBackMode === 'song') {
      //   handleSongModePlayButtonClick(state.songPatternStartTimesArr);
      // }

      setTransportLoopStartEnd(state);

      handlePlayButtonClick(!state.isPlaying);

      return {
        ...state,
        isPlaying: !state.isPlaying
      };
    }
    case "STOP_BUTTON_CLICKED": {
      handleStopButtonClick(state.currentPatternIndex);

      return {
        ...state,
        isPlaying: false
      };
    }
    case "PLAYBACK_MODE_CLICKED": {
      const playBackMode = action.playBackMode;

      if (playBackMode === "song") {
        buildSongTimeline(state.songArr);
      } else if (playBackMode === "pattern") {
        buildPatternTimeline(state.currentPatternIndex);
      }

      return {
        ...state,
        playBackMode: playBackMode
      };
    }
    case "MODE_SELECTOR_CLICKED": {
      const mode = action.mode;

      return {
        ...state,
        UiMode: mode
      };
    }
    case "PATTERN_CHANGED": {
      const patternIndex = action.patternIndex;

      //stop playback
      handleStopButtonClick(patternIndex);

      buildPatternTimeline(patternIndex);

      return {
        ...state,
        playBackMode: "pattern",
        UiMode: "pattern",
        currentPatternIndex: patternIndex,
        isPlaying: false
      };
    }
    case "SONG_UPDATED": {
      const songListIdArr = action.listIdArr;
      const songPatternStartTimesArr = returnSongPatternStartTimesArr(
        songListIdArr,
        state.patternsArr
      );

      //list of pattern id's to list of pattern indexes
      let songListPatternIndexArr = songListIdArr.map(id => {
        return state.patternsArr.reduce((prevVal, pattern, index) => {
          if (id === pattern) {
            return index;
          } else {
            return prevVal;
          }
        }, null);
      });

      if (state.playBackMode === "song") {
        buildSongTimeline(songListPatternIndexArr);
      }

      return {
        ...state,
        songArr: songListPatternIndexArr,
        songPatternStartTimesArr: songPatternStartTimesArr
      };
    }
    case "BLANK_PATTERN_ADDED": {
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
        "Pattern " + (state.patternsArr.length + 1)
      );

      //update state.currentPatternIndex
      let newCurrentPatternIndex = newPatternsArr.length - 1;

      //stop playback
      handleStopButtonClick(newCurrentPatternIndex);

      //add new array to GLOBAL_PATTERN_TRIGGERS
      GLOBAL_PATTERN_TRIGGERS.push([]);

      //update Timeline
      buildPatternTimeline(newCurrentPatternIndex);

      return {
        ...state,
        sequencers: newSequencersObj,
        patternsArr: newPatternsArr,
        currentPatternIndex: newCurrentPatternIndex,
        isPlaying: false
      };
    }
    case "COPIED_PATTERN_ADDED": {
      let { patternToCopy } = action;
      let patternToCopyIndex = state.patternsArr.reduce(
        (prevVal, pattern, index) => {
          if (patternToCopy === pattern) {
            return index;
          } else {
            return prevVal;
          }
        },
        null
      );

      

      return {
        ...state
      };
    }
    case "EDITING_TRIGGER": {
      return {
        ...state,
        isEditingTrigger: action.isEditingTrigger,
        triggerBeingEditedId: action.triggerBeingEditedId,
        sequencerBeingEditedId: action.sequencerBeingEditedId
      };
    }
    case "EDITING_SYNTHESIZER": {
      return {
        ...state,
        sequencerBeingEditedId: action.sequencerBeingEditedId
      };
    }
    case "SYNTHESIZER_CHANGED": {
      // const sequencerId = state.sequencerBeingEditedId;
      // //dispose old synth
      // state.sequencers[sequencerId].synthesizerRef.dispose();
      // //create new object with same values as old but new reference
      // let tempSequencerObj = { ...state.sequencers[sequencerId] };
      // //change synthesizer number
      // tempSequencerObj.synthesizer = action.newSynthNum;
      // //change synthesizerRef
      // tempSequencerObj.synthesizerRef = returnNewSynth(action.newSynthNum);
      // //iterate through triggers and reschedule
      // tempSequencerObj.triggers = tempSequencerObj.triggers.map(trigger => {
      //   let tempTrigger = { ...trigger };
      //   if (tempTrigger.isTriggered) {
      //     tempTrigger = returnClearedTrigger(tempTrigger);
      //     //we are using original 'trigger' object to pass in the note
      //     tempTrigger = returnSetTrigger(
      //       tempTrigger,
      //       tempSequencerObj.synthesizerRef,
      //       tempTrigger.note,
      //       tempTrigger.duration,
      //       tempTrigger.velocity,
      //       false
      //     );
      //     return tempTrigger;
      //   } else {
      //     return trigger;
      //   }
      // });
      // return {
      //   ...state,
      //   sequencers: {
      //     ...state.sequencers,
      //     [sequencerId]: {
      //       ...tempSequencerObj
      //     }
      //   }
      // };
      return {
        ...state
      };
    }
    case "EDIT_TRIGGER_NOTE": {
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
    case "TRIGGER_SLICED": {
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
    case "TRIGGER_UNSLICED": {
      const sequencerId = action.sequencerBeingEditedId;
      const triggerId = action.triggerBeingEditedId;
      const synthRef = state.sequencers[sequencerId].synthesizerRef;

      //check if unable to unslice further
      if (state.sequencers[sequencerId].triggers[triggerId].sliceAmount === 0) {
        console.log("cant unslice anymore!");
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
    case "CHANGE_NOTE_DURATION": {
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
      let newTriggers = sequencerRef.triggers.map(trigger => {
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
                    "C2",
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
              "C2",
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
    case "CHANGE_NOTE_VELOCITY": {
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
                  // tempSlicedTrigger.duration = newDurationStr;
                  tempSlicedTrigger = returnSetTrigger(
                    tempSlicedTrigger,
                    synthesizerRef,
                    "C2",
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
            // tempTrigger.duration = newDurationStr;
            console.log("newVelocity:  ", newVelocity);

            tempTrigger = returnSetTrigger(
              tempTrigger,
              synthesizerRef,
              "C2",
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
    case "CHANGE_NOTE_NUDGE": {
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
                  // tempSlicedTrigger.duration = newDurationStr;
                  tempSlicedTrigger.nudgeValue = nudgeValue;
                  tempSlicedTrigger = returnSetTrigger(
                    tempSlicedTrigger,
                    synthesizerRef,
                    "C2",
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
              "C2",
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
    case "CHANGE_PAN_VALUE": {
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
    case "CHANGE_PITCH_VALUE": {
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
    case "CHANGE_VOLUME_VALUE": {
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
    case "CHANGE_MUTE_STATE": {
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
    case "CHANGE_SOLO_STATE": {
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
    case "INCREASE_BPM": {
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
    case "DECREASE_BPM": {
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
    case "TOGGLE_METRONOME": {
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

class App extends Component {
  componentDidMount() {
    store.dispatch({
      type: "ADD_NEW_SEQUENCER",
      sequencerId: "closedHiHat1",
      sample: closedHiHat1
    });

    store.dispatch({
      type: "ADD_NEW_SEQUENCER",
      sequencerId: "snare1",
      sample: snare1
    });
    store.dispatch({
      type: "ADD_NEW_SEQUENCER",
      sequencerId: "kick1",
      sample: kick1
    });
  }

  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <div>
            <ToolbarContainer />
            <Sequencers />

            <AddSequencerButtonContainer />

            <StateTreeManager />

            <SongModeContainer />
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
