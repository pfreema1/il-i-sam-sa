import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import Tone from 'tone';
import Sequencer from './Sequencer';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './App.css';
import PlayButton from './PlayButton';
import kick1 from './samples/kick1.wav';
import snare1 from './samples/snare1.wav';
import closedHiHat1 from './samples/closedHiHat1.wav';

const returnTriggers = () => {
  let tempTriggersArr = [];
  for (let i = 0; i < 16; i++) {
    let tempObj = {
      id: null,
      timingValue: i * 48,
      scheduleId: null,
      isTriggered: false,
      note: null,
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
    note: null,
    duration: '192i', //full = 192
    velocity: 1,
    isSliced: false,
    sliceAmount: 0
  };
};

const returnNewSynth = synthNum => {
  switch (synthNum) {
    case 1:
      return new Tone.AMSynth().toMaster();
    case 2:
      return new Tone.DuoSynth().toMaster();
    case 3:
      return new Tone.FMSynth().toMaster();
    case 4:
      return new Tone.MembraneSynth().toMaster();
    case 5:
      return new Tone.MetalSynth().toMaster();
    case 6:
      return new Tone.MonoSynth().toMaster();
    case 7:
      return new Tone.NoiseSynth().toMaster();
    case 8:
      return new Tone.PluckSynth().toMaster();
    case 9: {
      let kickRef = new Tone.Sampler({ C2: kick1 }).toMaster();
      // kickRef.retrigger = true;
      return kickRef;
    }
    case 10: {
      let kickRef = new Tone.Sampler({ C2: kick1 }).toMaster();
      // kickRef.retrigger = true;
      return kickRef;
    }
    case 11: {
      let snareRef = new Tone.Sampler({ C2: snare1 }).toMaster();
      // snareRef.retrigger = true;
      return snareRef;
    }
    case 12: {
      let closeHiHatRef = new Tone.Sampler({ C2: closedHiHat1 }).toMaster();
      // closeHiHatRef.retrigger = true;
      return closeHiHatRef;
    }
    default:
      return null;
  }
};

const setupAmenSequencers = () => {
  let sequencers = {};
  let kickSequencerId = 'seqKick' + Date.now();
  let snareSequencerId = 'seqSnare' + Date.now();
  let hiHatSequencerId = 'seqHiHat' + Date.now();

  sequencers[kickSequencerId] = {
    synthesizer: 10,
    synthesizerRef: returnNewSynth(10),
    triggers: returnTriggers()
  };

  sequencers[snareSequencerId] = {
    synthesizer: 11,
    synthesizerRef: returnNewSynth(11),
    triggers: returnTriggers()
  };

  sequencers[hiHatSequencerId] = {
    synthesizer: 12,
    synthesizerRef: returnNewSynth(12),
    triggers: returnTriggers()
  };

  return sequencers;
};

const returnNewSequencersIdArr = sequencersObj => {
  return Object.keys(sequencersObj);
};

const initialState = {
  isEditingTrigger: false,
  triggerBeingEditedId: null,
  sequencerBeingEditedId: null,
  isPlaying: false,
  sequencersIdArr: [],
  sequencers: {}
};

//set the transport to repeat
Tone.Transport.loopEnd = '1m';
Tone.Transport.loop = true;
Tone.Transport.bpm.value = 100;

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
  trigger.note = null;

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
  let iValue = trigger.timingValue;

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
      debugger;
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
    debugger;
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
  debugger;
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
    case 'INITIALIZE': {
      let sequencers = setupAmenSequencers();

      let newSequencersIdArr = returnNewSequencersIdArr(sequencers);

      return {
        ...state,
        sequencersIdArr: newSequencersIdArr,
        sequencers: { ...sequencers }
      };
    }
    case 'PARENT_TRIGGER_CLICKED': {
      let { triggerId, sequencerId } = action;

      let synthesizerRef = state.sequencers[sequencerId].synthesizerRef;

      let newTriggers = state.sequencers[sequencerId].triggers.map(trigger => {
        let tempTrigger = { ...trigger };

        if (tempTrigger.id === triggerId) {
          tempTrigger = returnHandledSampleTrigger(tempTrigger, synthesizerRef);
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
    case 'SLICEE_TRIGGER_CLICKED': {
      let { triggerId, sequencerId, parentTriggerId } = action;
      let synthesizerRef = state.sequencers[sequencerId].synthesizerRef;

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
      let sequencerId = state.sequencerBeingEditedId;

      //dispose old synth
      state.sequencers[sequencerId].synthesizerRef.dispose();

      //create new object with same values as old but new reference
      let tempSequencerObj = { ...state.sequencers[sequencerId] };

      //change synthesizer number
      tempSequencerObj.synthesizer = action.newSynthNum;

      //change synthesizerRef
      tempSequencerObj.synthesizerRef = returnNewSynth(action.newSynthNum);

      //iterate through triggers and reschedule
      tempSequencerObj.triggers = tempSequencerObj.triggers.map(trigger => {
        let tempTrigger = { ...trigger };

        if (tempTrigger.isTriggered) {
          tempTrigger = returnClearedTrigger(tempTrigger);

          //we are using original 'trigger' object to pass in the note
          tempTrigger = returnSetTrigger(
            tempTrigger,
            tempSequencerObj.synthesizerRef,
            tempTrigger.note,
            tempTrigger.duration,
            tempTrigger.velocity,
            false
          );

          return tempTrigger;
        } else {
          return trigger;
        }
      });

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...tempSequencerObj
          }
        }
      };
    }
    case 'EDIT_TRIGGER_NOTE': {
      let sequencerId = state.sequencerBeingEditedId;

      let newTriggers = state.sequencers[sequencerId].triggers.map(trigger => {
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
    case 'TRIGGER_SLICED': {
      let sequencerId = action.sequencerBeingEditedId;
      let triggerId = action.triggerBeingEditedId;
      let synthesizerRef = state.sequencers[sequencerId].synthesizerRef;

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
      let sequencerId = action.sequencerBeingEditedId;
      let triggerId = action.triggerBeingEditedId;

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
            //log the attributes of tempslicedtrigger here!
            console.log('tempTrigger.note:  ', tempTrigger.note);
            console.log('tempTrigger.duration:  ', tempTrigger.duration);
            console.log('tempTrigger.velocity:  ', tempTrigger.velocity);
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

store.dispatch({ type: 'INITIALIZE' });

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <div>
            <Sequencer sequencerId={store.getState().sequencersIdArr[2]} />
            <Sequencer sequencerId={store.getState().sequencersIdArr[1]} />
            <Sequencer sequencerId={store.getState().sequencersIdArr[0]} />
            <PlayButton />
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
