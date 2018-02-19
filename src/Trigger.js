import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

const ButtonStyle = {
  width: '5vw',
  height: '100px',
  margin: '5px',
  borderRadius: '5px',
  minWidth: '5vw'
};

const backgroundColorSetter = (isTriggered, barStarter) => {
  if (isTriggered) {
    return '#BEEBD1';
  } else {
    if (barStarter) {
      return '#6863B2';
    } else {
      return '#405790';
    }
  }
};

class Trigger extends Component {
  constructor(props: Props) {
    super(props);

    const { sequencerId, id, sequencers } = props;

    this.state = {
      isTriggered: sequencers[sequencerId].triggers[id].isTriggered
    };
  }

  handleTriggerClick = id => {
    this.props.dispatch({
      type: 'TRIGGER_CLICKED',
      triggerId: id,
      sequencerId: this.props.sequencerId
    });
  };

  render() {
    const { sequencerId, id, sequencers } = this.props;

    return (
      <RaisedButton
        backgroundColor={backgroundColorSetter(
          sequencers[sequencerId].triggers[id].isTriggered,
          this.props.barStarter
        )}
        label=""
        style={ButtonStyle}
        onClick={this.handleTriggerClick.bind(null, id)}
      />
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    sequencers: state.sequencers
  };
};

export default connect(mapStateToProps)(Trigger);
