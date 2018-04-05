import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Trigger.css';
import TriggerView from '../Components/TriggerView';

const backgroundColorSetter = (isTriggered, barStarter) => {
  if (isTriggered) {
    return 'RGBA(192, 32, 11, 1.00)';
  } else {
    if (barStarter) {
      return 'RGBA(52, 51, 51, 1.00)';
    } else {
      return 'RGBA(38, 38, 38, 1.00)';
    }
  }
};

class Trigger extends Component {
  constructor(props) {
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
  }

  componentWillReceiveProps(nextProps) {
    const { sequencerId, id, sequencers, parentTriggerId } = nextProps;

    if (nextProps.isSlicee) {
      this.setState({
        isTriggered:
          sequencers[sequencerId].triggers[parentTriggerId].slicedTriggers[id]
            .isTriggered
      });
    } else {
      this.setState({
        isTriggered: sequencers[sequencerId].triggers[id].isTriggered
      });
    }
  }

  handleTriggerClick = (id, e) => {
    e.preventDefault();

    console.log('handleTriggerClick running!');
    if (this.props.isSlicee) {
      this.props.dispatch({
        type: 'SLICEE_TRIGGER_CLICKED',
        triggerId: id,
        sequencerId: this.props.sequencerId,
        parentTriggerId: this.props.parentTriggerId,
        isTurningOn: !this.state.isTriggered
      });
    } else {
      this.props.dispatch({
        type: 'PARENT_TRIGGER_CLICKED',
        triggerId: id,
        sequencerId: this.props.sequencerId,
        isTurningOn: !this.state.isTriggered
      });
    }
  };

  render() {
    const { id, isSlicee } = this.props;

    const bgColor = backgroundColorSetter(
      this.state.isTriggered,
      this.props.barStarter
    );

    return (
      <TriggerView
        bgColor={bgColor}
        width={this.props.width}
        height={this.props.height}
        isSlicee={isSlicee}
        handleTriggerClick={this.handleTriggerClick}
        id={id}
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
