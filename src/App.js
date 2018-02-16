import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import Sequencer from './Sequencer';
import './App.css';

const initialState = {
  foo: 1
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
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
