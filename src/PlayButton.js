import React, { Component } from 'react';
import { connect } from 'react-redux';

const PlayButtonStyle = {
  width: '20px',
  height: '20px',
  borderBottom: '15px solid white',
  borderRight: '15px solid white',
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
