import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import './Trigger.css';
import TriggerView from '../Components/TriggerView';

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

  handleTriggerClick = id => {
    if (this.props.isSlicee) {
      this.props.dispatch({
        type: 'SLICEE_TRIGGER_CLICKED',
        triggerId: id,
        sequencerId: this.props.sequencerId,
        parentTriggerId: this.props.parentTriggerId
      });
    } else {
      this.props.dispatch({
        type: 'PARENT_TRIGGER_CLICKED',
        triggerId: id,
        sequencerId: this.props.sequencerId
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
        isTriggered={this.state.isTriggered}
        barStarter={this.props.barStarter}
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
