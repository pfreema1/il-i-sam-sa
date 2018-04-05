import React, { Component } from 'react';
import { connect } from 'react-redux';

const wrapperStyling = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center'
};

const saveStateStyling = {
  width: '100px',
  height: '70px',
  background: 'yellow'
};

const loadStateStyling = {
  width: '100px',
  height: '70px',
  background: 'orange'
};

/*****************************/

class StateTreeManager extends Component {
  constructor(props) {
    super(props);

    this.actionsArr = [
      { type: 'PARENT_TRIGGER_CLICKED', triggerId: 0, sequencerId: 'kick1' },
      { type: 'PARENT_TRIGGER_CLICKED', triggerId: 4, sequencerId: 'kick1' },
      { type: 'PARENT_TRIGGER_CLICKED', triggerId: 8, sequencerId: 'kick1' },
      { type: 'PARENT_TRIGGER_CLICKED', triggerId: 12, sequencerId: 'kick1' },
      { type: 'BLANK_PATTERN_ADDED', switchToPattern: false },
      { type: 'PARENT_TRIGGER_CLICKED', triggerId: 16, sequencerId: 'snare1' },
      { type: 'PARENT_TRIGGER_CLICKED', triggerId: 20, sequencerId: 'snare1' },
      { type: 'PARENT_TRIGGER_CLICKED', triggerId: 24, sequencerId: 'snare1' },
      { type: 'PARENT_TRIGGER_CLICKED', triggerId: 28, sequencerId: 'snare1' },
      { type: 'BLANK_PATTERN_ADDED', switchToPattern: false },
      {
        type: 'PARENT_TRIGGER_CLICKED',
        triggerId: 32,
        sequencerId: 'closedHiHat1'
      },
      {
        type: 'PARENT_TRIGGER_CLICKED',
        triggerId: 36,
        sequencerId: 'closedHiHat1'
      },
      {
        type: 'PARENT_TRIGGER_CLICKED',
        triggerId: 40,
        sequencerId: 'closedHiHat1'
      },
      {
        type: 'PARENT_TRIGGER_CLICKED',
        triggerId: 44,
        sequencerId: 'closedHiHat1'
      },
      { type: 'BLANK_PATTERN_ADDED', switchToPattern: false },
      { type: 'COPIED_PATTERN_ADDED', patternToCopy: 'PATTERN 3' }
    ];
  }

  handleSaveStateClick = () => {};

  handleLoadStateClick = () => {
    //run these dispatches every ~1 second
    let index = 0;
    let intervalFn = setInterval(() => {
      if (index < this.actionsArr.length) {
        this.props.dispatch(this.actionsArr[index]);
      } else {
        clearInterval(intervalFn);
      }

      index++;

      console.log('interval run!');
    }, 50);
  };

  handleMakePostRequestClick = () => {
    const payloadBody = JSON.stringify(this.props.sequencers);

    fetch('http://localhost:4000/save-it', {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      method: 'post',
      mode: 'cors',
      body: payloadBody
    })
      .then(res => res.text())
      .then(text => console.log(text))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div style={wrapperStyling}>
        <div onClick={this.handleSaveStateClick} style={saveStateStyling}>
          SAVE STATE
        </div>

        <div onClick={this.handleMakePostRequestClick} style={saveStateStyling}>
          SEND POST REQ
        </div>

        <div onClick={this.handleLoadStateClick} style={loadStateStyling}>
          LOAD STATE
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    state: state,
    sequencers: state.sequencers
  };
}

export default connect(mapStateToProps)(StateTreeManager);
