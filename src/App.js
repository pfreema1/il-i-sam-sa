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

// const defaultTriggerState = {
//   id: null,
//   scheduleId: null,
//   isTriggered: false,
//   note: 'C2',
//   duration: '48i',
//   velocity: 1
// };

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

let initialState = {
  isEditingTrigger: false,
  isPlaying: false,
  triggers: returnTriggers()
};

console.log('initialState:  ', initialState);

/*****************************
 ******************************
 **
 **		triggerSynth
 **
 ******************************
 ******************************/
var synth = new Tone.PluckSynth().toMaster();
//set the transport to repeat
Tone.Transport.loopEnd = '1m';
Tone.Transport.loop = true;

//this function is called right before the scheduled time
function triggerSynth(time) {
  //the time is the sample-accurate time of the event
  synth.triggerAttackRelease('C2', '8n', time);
}

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
    case 'TRIGGER_CLICKED': {
      let newTriggers = state.triggers.map(elem => {
        if (elem.id === action.id) {
          if (elem.isTriggered) {
            //turn isTriggered to false, and clear id of previous Transport.schedule
            elem.isTriggered = false;
            Tone.Transport.clear(elem.scheduleId);
            elem.scheduleId = null;

            return elem;
          } else {
            //turn isTriggered to true, and save id of Transport.schedule
            let iValue = elem.id * 48;
            elem.isTriggered = true;
            elem.scheduleId = Tone.Transport.schedule(
              triggerSynth,
              iValue + 'i'
            );
            console.log('schedule set!');

            return elem;
          }
        } else {
          return elem;
        }
      });
      console.log('before returning in reducer: newTriggers:  ', newTriggers);

      return {
        ...state,
        triggers: newTriggers
      };
    }
    case 'PLAY_BUTTON_CLICKED': {
      handlePlayButtonClick(!state.isPlaying);
      return {
        ...state,
        isPlaying: !state.isPlaying
      };
    }
    default:
      return state;
  }
};

/*****************************/

const store = createStore(reducer, applyMiddleware(logger));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <Sequencer />
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
