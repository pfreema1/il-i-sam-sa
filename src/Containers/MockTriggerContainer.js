import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MockTriggerContainer.css';
import MockTriggerComponent from '../Components/MockTriggerComponent';

class MockTriggerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      barStarter: props.barStarter,
      isTriggered: props.isTriggered
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      barStarter: nextProps.barStarter,
      isTriggered: nextProps.isTriggered
    });
  }

  handleClick = () => {
    const { triggerBeingEditedId, sequencerBeingEditedId, id } = this.props;

    if (this.props.isSlicee) {
      //dispatch slicee trigger click
      this.props.dispatch({
        type: 'SLICEE_TRIGGER_CLICKED',
        triggerId: id,
        sequencerId: sequencerBeingEditedId,
        parentTriggerId: triggerBeingEditedId
      });
    } else {
      //dispatch normal trigger click
      this.props.dispatch({
        type: 'PARENT_TRIGGER_CLICKED',
        triggerId: triggerBeingEditedId,
        sequencerId: sequencerBeingEditedId
      });
    }
  };

  render() {
    let { barStarter, isTriggered } = this.state;

    return (
      <MockTriggerComponent
        handleClick={this.handleClick}
        barStarter={barStarter}
        isTriggered={isTriggered}
      />
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    sequencers: state.sequencers,
    triggerBeingEditedId: state.triggerBeingEditedId,
    sequencerBeingEditedId: state.sequencerBeingEditedId
  };
};

export default connect(mapStateToProps)(MockTriggerContainer);
