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

/*****************************
 ******************************
 **
 **		set up default state
 **
 ******************************
 ******************************/

const returnTriggers = () => {
  let tempTriggersArr = [];
  for (let i = 0; i < 16; i++) {
    let tempObj = {
      id: null,
      scheduleId: null,
      isTriggered: false,
      note: 'C2',
      duration: '48i',
      velocity: 1
    };
    tempObj.id = i;

    tempTriggersArr.push(tempObj);
  }

  return tempTriggersArr;
};

/*****************************
 ******************************
 **
 **		returnNewSynth
 **
 ******************************
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
    default:
      return null;
  }
};

/*****************************
 ******************************
 **
 **		setupSequencer
 **      -returns new sequencers object
 ******************************
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

/*****************************
 ******************************
 **
 **		triggerSynth
 **
 ******************************
 ******************************/
// var synth = new Tone.FMSynth().toMaster();
//set the transport to repeat
Tone.Transport.loopEnd = '1m';
Tone.Transport.loop = true;

//this function is called right before the scheduled time
// function triggerSynth(note, duration, time, velocity) {
//   //the time is the sample-accurate time of the event
//   synth.triggerAttackRelease(note, duration, time, velocity);
// }

/*****************************
 ******************************
 **
 **		handlePlayButtonClick
 **
 ******************************
 ******************************/
const handlePlayButtonClick = play => {
  if (play) {
    Tone.Transport.start('+0.1');
  } else {
    Tone.Transport.stop();
  }
};

/*****************************
 ******************************
 **
 **		reducer
 **
 ******************************
 ******************************/

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INITIALIZE': {
      let newSequencers = setupSequencer(3, {});
      let newSequencersIdArr = returnNewSequencersIdArr(newSequencers);

      return {
        ...state,
        sequencersIdArr: newSequencersIdArr,
        sequencers: newSequencers
      };
    }
    case 'TRIGGER_CLICKED': {
      let { triggerId, sequencerId } = action;

      let newTriggers = state.sequencers[sequencerId].triggers.map(trigger => {
        /******SUPER IMPORTANT!!! */
        // since trigger is an object, we can't just modify the object directly
        // because that will only modify the existing object
        let tempTrigger = Object.assign({}, trigger);

        if (tempTrigger.id === triggerId) {
          if (tempTrigger.isTriggered) {
            //turn isTriggered to false, and clear id of previous Transport.schedule
            tempTrigger.isTriggered = false;
            Tone.Transport.clear(tempTrigger.scheduleId);
            tempTrigger.scheduleId = null;

            return tempTrigger;
          } else {
            //turn isTriggered to true, and save id of Transport.schedule
            let iValue = tempTrigger.id * 48;
            tempTrigger.isTriggered = true;
            tempTrigger.scheduleId = Tone.Transport.schedule(time => {
              state.sequencers[sequencerId].synthesizerRef.triggerAttackRelease(
                tempTrigger.note,
                tempTrigger.duration,
                time,
                tempTrigger.velocity
              );
            }, iValue + 'i');

            return tempTrigger;
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
      //change synthesizer number, and synthesizerRef, and dispose old synth
      //-dispose
      // state.sequencers[sequencerId].synthesizerRef.dispose();

      return {
        ...state,
        sequencers: {
          ...state.sequencers,
          [sequencerId]: {
            ...state.sequencers[sequencerId],
            synthesizer: action.newSynthNum,
            synthesizerRef: returnNewSynth(action.newSynthNum)
          }
        }
      };
    }
    case 'EDIT_TRIGGER_NOTE': {
      let sequencerId = state.sequencerBeingEditedId;

      let newTriggers = state.sequencers[sequencerId].triggers.map(trigger => {
        let tempTrigger = Object.assign({}, trigger);

        if (tempTrigger.id === state.triggerBeingEditedId) {
          let iValue = tempTrigger.id * 48;
          if (tempTrigger.isTriggered) {
            //trigger was already triggered, need to clear the previously scheduled trigger
            Tone.Transport.clear(tempTrigger.scheduleId);

            //schedule new trigger
            tempTrigger.scheduleId = Tone.Transport.schedule(time => {
              state.sequencers[sequencerId].synthesizerRef.triggerAttackRelease(
                tempTrigger.note,
                tempTrigger.duration,
                time,
                tempTrigger.velocity
              );
            }, iValue + 'i');
            tempTrigger.note = action.newNote;

            return tempTrigger;
          } else {
            //case:  trigger wasn't triggered
            tempTrigger.isTriggered = true;

            tempTrigger.scheduleId = Tone.Transport.schedule(time => {
              state.sequencers[sequencerId].synthesizerRef.triggerAttackRelease(
                tempTrigger.note,
                tempTrigger.duration,
                time,
                tempTrigger.velocity
              );
            }, iValue + 'i');

            tempTrigger.note = action.newNote;

            return tempTrigger;
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
