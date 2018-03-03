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
import ToolbarContainer from './ToolbarContainer';
import AddSequencer from './AddSequencer';
import Sequencers from './Sequencers';
import highClick from './samples/clickHigh.wav';
import lowClick from './samples/click.wav';

const returnTriggers = () => {
  let tempTriggersArr = [];
  for (let i = 0; i < 16; i++) {
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

const returnSingleSlicedTrigger = () => {
  return {
    id: null,
    scheduleId: null,
    isTriggered: false,
    nudgeValue: 0,
    note: 'C2',
    duration: '192i', //full = 192
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

  sequencers[sequencerId] = {
    synthesizerRef: synthComponentRefObj.synthRef,
    volumeRef: synthComponentRefObj.volume,
    volumeVal: synthComponentRefObj.volume.volume.value,
    panRef: synthComponentRefObj.pan,
    panVal: synthComponentRefObj.pan.pan.value,
    soloRef: synthComponentRefObj.solo,
    pitchRef: synthComponentRefObj.pitch,
    pitchVal: synthComponentRefObj.pitch.pitch,
    triggers: returnTriggers(),
    isMuted: false,
    isSoloed: false
  };

  return sequencers;
};

const returnNewSequencersIdArr = sequencersObj => {
  return Object.keys(sequencersObj);
};

const returnClickSamplerRef = () => {
  return new Tone.Sampler({ C2: lowClick, C3: highClick }).toMaster();
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
    scheduleArray: null
  }
};

//set the transport to repeat
Tone.Transport.loopEnd = '1m';
Tone.Transport.loop = true;
Tone.Transport.bpm.value = 120;

const handlePlayButtonClick = play => {
  if (play) {
    Tone.Transport.start('+0.1');
  } else {
    Tone.Transport.stop();
  }
};

const returnClearedTrigger = trigger => {
  trigger.isTriggered = false;
  Tone.Transport.clear(trigger.scheduleId);
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
  isSample
) => {
  let iValue = trigger.timingValue + trigger.nudgeValue;

  trigger.isTriggered = true;

  if (isSample) {
    trigger.scheduleId = Tone.Transport.schedule(time => {
      synthesizerRef.triggerAttackRelease(note, duration, time, velocity);
    }, iValue + 'i');
  } else {
    // trigger.scheduleId = Tone.Transport.schedule(time => {
    //   synthesizerRef.triggerAttackRelease(
    //     trigger.note,
    //     duration,
    //     time,
    //     trigger.velocity
    //   );
    // }, iValue + 'i');
    // trigger.note = note;
  }

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

const returnHandledSampleTrigger = (trigger, synthesizerRef) => {
  if (trigger.isTriggered) {
    trigger = returnClearedTrigger(trigger);
  } else {
    trigger = returnSetTrigger(
      trigger,
      synthesizerRef,
      'C2',
      trigger.duration,
      trigger.velocity,
      true
    );
  }

  return trigger;
};

const retriggerScheduledTriggers = (
  currentlyTriggeredTriggersObjArr,
  tempSlicedTrigger,
  synthesizerRef
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
        true
      );
    }
  }
};

const clearAllSlicedTriggers = parentTrigger => {
  for (let i = 0; i < parentTrigger.slicedTriggers.length; i++) {
    Tone.Transport.clear(parentTrigger.slicedTriggers[i].scheduleId);
  }
};

const clearPreviouslyScheduledTrigger = (
  isSlicee,
  sequencerRef,
  parentTriggerId,
  triggerId
) => {
  if (isSlicee) {
    Tone.Transport.clear(
      sequencerRef.triggers[parentTriggerId].slicedTriggers[triggerId]
        .scheduleId
    );
  } else {
    Tone.Transport.clear(sequencerRef.triggers[triggerId].scheduleId);
  }
};

// const returnTriggerAttributes = (isSlicee, sequencerR)

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
    tempSlicedTrigger.id = 'trigger' + triggerId + 'slice' + i;
    tempSlicedTrigger.timingValue =
      i * iValueScale +
      state.sequencers[sequencerId].triggers[triggerId].timingValue;
    retriggerScheduledTriggers(
      currentlyTriggeredTriggersObjArr,
      tempSlicedTrigger,
      synthesizerRef
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
  parentTrigger = returnClearedTrigger(parentTrigger);

  clearAllSlicedTriggers(parentTrigger);

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
      const { triggerId, sequencerId } = action;

      const synthesizerRef = state.sequencers[sequencerId].synthesizerRef;

      const newTriggers = state.sequencers[sequencerId].triggers.map(
        trigger => {
          let tempTrigger = { ...trigger };

          if (tempTrigger.id === triggerId) {
            tempTrigger = returnHandledSampleTrigger(
              tempTrigger,
              synthesizerRef
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
    case 'SLICEE_TRIGGER_CLICKED': {
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
                  synthesizerRef
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
    case 'PLAY_BUTTON_CLICKED': {
      handlePlayButtonClick(!state.isPlaying);
      return {
        ...state,
        isPlaying: !state.isPlaying
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
                false
              );
            } else {
              //case:  trigger wasn't triggered
              return returnSetTrigger(
                tempTrigger,
                state.sequencers[sequencerId].synthesizerRef,
                action.newNote,
                tempTrigger.duration,
                tempTrigger.velocity,
                false
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

      //check if unable to unslice further
      if (state.sequencers[sequencerId].triggers[triggerId].sliceAmount === 0) {
        console.log('cant unslice anymore!');
        return {
          ...state
        };
      }

      clearAllSlicedTriggers(state.sequencers[sequencerId].triggers[triggerId]);

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

      //save previous triggers attributes here?

      clearPreviouslyScheduledTrigger(
        isSlicee,
        sequencerRef,
        parentTriggerId,
        triggerId
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
                    'C2',
                    newDurationStr,
                    tempSlicedTrigger.velocity,
                    true
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
              true
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
        triggerId
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
                    'C2',
                    tempSlicedTrigger.duration,
                    newVelocity,
                    true
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
            console.log('newVelocity:  ', newVelocity);

            tempTrigger = returnSetTrigger(
              tempTrigger,
              synthesizerRef,
              'C2',
              tempTrigger.duration,
              newVelocity,
              true
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
        triggerId
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
                    'C2',
                    tempSlicedTrigger.duration,
                    tempSlicedTrigger.velocity,
                    true
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
              true
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
      if (state.isMetronomeOn) {
        //clear scheduled metronome Transport.schedule
        let newMetronomeScheduleIdArr = state.metronome.scheduleArray.map(
          scheduleId => {
            //clear id
            Tone.Transport.clear(scheduleId);
            return null;
          }
        );
      } else {
      }

      return {
        ...state,
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

    return returnValue;
  };
};

/*****************************/

const store = createStore(reducer, applyMiddleware(timelineLogger, logger));

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

  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <div>
            <ToolbarContainer />
            <Sequencers />

            <AddSequencer />
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
