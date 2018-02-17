import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import Sequencer from './Sequencer';
import './App.css';

const defaultTriggerState = {
  key: null,
  scheduleId: null,
  isTriggered: false,
  note: 'C2',
  duration: '48i',
  velocity: 1
};

let initialState = {
  isPlaying: false,
  triggers: []
};

//IIFE!  - sets up default state
(() => {
  //create object to put into triggers array
  let tempObj = defaultTriggerState;

  for (let i = 0; i < 16; i++) {
    tempObj.key = i;
    initialState.triggers.push(tempObj);
  }
})();

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TRIGGER_CLICKED': {
      console.log('id that was clicked:  ', action.id);

      return state;
    }
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(logger));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Sequencer />
      </Provider>
    );
  }
}

export default App;
