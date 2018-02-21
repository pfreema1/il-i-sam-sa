import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

const ButtonContainerStyle = {
  width: '100%',
  height: '100%',

  borderRadius: '5px',
  zIndex: '200'
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

    const { sequencerId, id, sequencers, parentTriggerId } = props;

    if (props.isSlicee) {
      this.state = {
        isTriggered:
          sequencers[sequencerId].triggers[parentTriggerId].slicedTriggers[id]
            .isTriggered
      };
    } else {
      this.state = {
        isTriggered: sequencers[sequencerId].triggers[id].isTriggered
      };
    }

    // this.state = {
    //   isTriggered: props.isSliced
    //     ? sequencers[sequencerId].triggers[FOO].slicedTriggers[id].isTriggered
    //     : sequencers[sequencerId].triggers[id].isTriggered
    // };
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
          this.state.isTriggered,
          this.props.barStarter
        )}
        label=""
        style={{
          ...ButtonContainerStyle,
          width: this.props.width,
          height: this.props.height,
          minWidth: '',
          backgroundColor: 'yellow'
        }}
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
