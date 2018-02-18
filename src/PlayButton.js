import React, { Component } from 'react';
import { connect } from 'react-redux';

const PlayButtonStyle = {
  width: '50px',
  height: '50px',
  borderBottom: '25px solid white',
  borderRight: '25px solid white',
  transform: 'rotate(-45deg)'
};

class PlayButton extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  playButtonClicked = () => {
    this.props.dispatch({ type: 'PLAY_BUTTON_CLICKED' });
  };

  render() {
    return <div style={PlayButtonStyle} onClick={this.playButtonClicked} />;
  }
}

/*****************************/

export default connect()(PlayButton);
