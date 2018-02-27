import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SequencerBrain.css';

class SequencerBrain extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return <div className="sequencer-brain__container">hi me brain</div>;
  }
}

/*****************************/

export default SequencerBrain;
