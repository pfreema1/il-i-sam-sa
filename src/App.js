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
 **		setupSequencer
 **      -returns new sequencers object
 ******************************
 ******************************/
const setupSequencer = (newSynthNum, currSequencers) => {
  let sequencerId = 'seq' + Date.now();
  //update sequencersIdArr
  currSequencers[sequencerId] = {
    synthesizer: newSynthNum,
    synthesizerRef: new Tone.FMSynth().toMaster(), //this will have to be dynamically applied according to 'newSynthNum'
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
      let newSequencers = setupSequencer(2, {});
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
        if (trigger.id === triggerId) {
          if (trigger.isTriggered) {
            //turn isTriggered to false, and clear id of previous Transport.schedule
            trigger.isTriggered = false;
            Tone.Transport.clear(trigger.scheduleId);
            trigger.scheduleId = null;

            return trigger;
          } else {
            //turn isTriggered to true, and save id of Transport.schedule
            let iValue = trigger.id * 48;
            trigger.isTriggered = true;
            trigger.scheduleId = Tone.Transport.schedule(time => {
              state.sequencers[sequencerId].synthesizerRef.triggerAttackRelease(
                trigger.note,
                trigger.duration,
                time,
                trigger.velocity
              );
            }, iValue + 'i');

            return trigger;
          }
        } else {
          return trigger;
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
        triggerBeingEditedId: action.triggerBeingEditedId
      };
    }

    case 'EDIT_TRIGGER_NOTE': {
      let newTriggers = state.triggers.map(trigger => {
        if (trigger.id === state.triggerBeingEditedId) {
          let iValue;
          if (trigger.isTriggered) {
            //trigger was already triggered, need to clear the previously scheduled trigger
            Tone.Transport.clear(trigger.scheduleId);

            iValue = trigger.id * 48;

            //schedule new trigger
            // trigger.scheduleId = Tone.Transport.schedule(time => {
            //   synth.triggerAttackRelease(
            //     trigger.note,
            //     trigger.duration,
            //     time,
            //     trigger.velocity
            //   );
            // }, iValue + 'i');
            trigger.note = action.newNote;

            return trigger;
          } else {
            //case:  trigger wasn't triggered
            trigger.isTriggered = true;

            iValue = trigger.id * 48;

            // trigger.scheduleId = Tone.Transport.schedule(time => {
            //   synth.triggerAttackRelease(
            //     trigger.note,
            //     trigger.duration,
            //     time,
            //     trigger.velocity
            //   );
            // }, iValue + 'i');

            trigger.note = action.newNote;

            return trigger;
          }

          return trigger;
        } else {
          return trigger;
        }
      });

      return {
        ...state,
        triggers: newTriggers
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
