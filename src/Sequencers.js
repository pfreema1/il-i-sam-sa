import React, { Component } from 'react';
import { connect } from 'react-redux';
import Sequencer from './Sequencer';

class Sequencers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  returnSequencers = () => {
    this.setupSequencers();
  };

  setupSequencer = sequencerId => {};

  render() {
    return <div>{this.returnSequencers()}</div>;
  }
}

/*****************************/
const mapStateToProps = state => {
  return {
    sequencers: state.sequencers,
    sequencersIdArr: state.sequencersIdArr
  };
};

export default connect(mapStateToProps)(Sequencers);
