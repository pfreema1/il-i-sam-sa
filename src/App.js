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

/*****************************
 **
 **		set up default state
 **
 ******************************/

const returnTriggers = () => {
  let tempTriggersArr = [];
  for (let i = 0; i < 16; i++) {
    let tempObj = {
      id: null,
      scheduleId: null,
      isTriggered: false,
      note: null,
      duration: '48i',
      velocity: 1
    };
    tempObj.id = i;

    tempTriggersArr.push(tempObj);
  }

  return tempTriggersArr;
};

/*****************************
 **
 **		returnNewSynth
 **
 ******************************/

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
      let ref = new Tone.Player(kick1).toMaster();
      ref.retrigger = true;
      return ref;
    }
    default:
      return null;
  }
};

/*****************************
 **
 **		setupSequencer
 **      -returns new sequencers object
 ******************************/
const setupSequencer = (newSynthNum, currSequencers) => {
  let sequencerId = 'seq' + Date.now();
  //update sequencersIdArr
  currSequencers[sequencerId] = {
    synthesizer: newSynthNum,
    synthesizerRef: returnNewSynth(newSynthNum),
    triggers: returnTriggers()
  };

  return currSequencers;
};

const returnNewSequencersIdArr = sequencersObj => {
  return Object.keys(sequencersObj);
};

let initialState = {
  isEditingTrigger: false,
  triggerBeingEditedId: null,
  sequencerBeingEditedId: null,
  isPlaying: false,
  sequencersIdArr: [],
  sequencers: {}
};

var buffer = new Tone.Buffer(kick1, () => {
  console.log('buffer is now available, whatever that means');
});

// let testState = {
//   isEditingTrigger: false,
//   triggerBeingEditedId: null,
//   sequencerBeingEditedId: null,
//   isPlaying: false,
//   sequencerIdArr: [seq124445],
//   sequencers: {
//     seq124445: {
//       synthesizer: 2,
//       synthesizerRef: new Tone.FMSynth().toMaster(),
//       triggers: returnTriggers()
//     }
//   }
// };

//set the transport to repeat
Tone.Transport.loopEnd = '1m';
Tone.Transport.loop = true;

/*****************************
 **
 **		handlePlayButtonClick
 **
 ******************************/
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

//default note is C2
const returnSetTrigger = (trigger, synthesizerRef, note = 'C2', isSample) => {
  let iValue = trigger.id * 48;

  trigger.isTriggered = true;

  console.log('isSample:  ', isSample);

  if (isSample) {
    trigger.scheduleId = Tone.Transport.schedule(time => {
      synthesizerRef.start(
        time,
        0, //offset
        trigger.duration
      );
    }, iValue + 'i');
  } else {
    trigger.scheduleId = Tone.Transport.schedule(time => {
      synthesizerRef.triggerAttackRelease(
        trigger.note,
        trigger.duration,
        time,
        trigger.velocity
      );
    }, iValue + 'i');
    trigger.note = note;
  }

  return trigger;
};

/*****************************
 **
 **		reducer
 **
 ******************************/

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INITIALIZE': {
      let newSequencers = setupSequencer(9, {});
      let newSequencersIdArr = returnNewSequencersIdArr(newSequencers);

      return {
        ...state,
        sequencersIdArr: newSequencersIdArr,
        sequencers: newSequencers
      };
    }
    case 'TRIGGER_CLICKED': {
      let { triggerId, sequencerId } = action;
      let isSample =
        state.sequencers[sequencerId].synthesizer === 9 ? true : false;

      let newTriggers = state.sequencers[sequencerId].triggers.map(trigger => {
        /******SUPER IMPORTANT!!! */
        // since trigger is an object, we can't just modify the object directly
        // because that will only modify the existing object
        let tempTrigger = { ...trigger }; //Object.assign({}, trigger);

        if (tempTrigger.id === triggerId) {
          if (tempTrigger.isTriggered) {
            return returnClearedTrigger(tempTrigger);
          } else {
            return returnSetTrigger(
              tempTrigger,
              state.sequencers[sequencerId].synthesizerRef,
              'C2',
              isSample
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
            trigger.note
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
              action.newNote
            );
          } else {
            //case:  trigger wasn't triggered
            return returnSetTrigger(
              tempTrigger,
              state.sequencers[sequencerId].synthesizerRef,
              action.newNote
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
    default:
      return state;
  }
};

/*****************************/

const store = createStore(reducer, applyMiddleware(logger));

store.dispatch({ type: 'INITIALIZE' });

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <div>
            <Sequencer sequencerId={store.getState().sequencersIdArr[0]} />
            <PlayButton />
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
