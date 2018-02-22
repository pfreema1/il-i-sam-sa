import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MockTrigger.css';

class MockTrigger extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleClick = () => {
    //need this info to trigger note on/off
    //  triggerBeingEditedId
    // isSlicee
    // sequencerBeingEditedId
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
    let { barStarter, isTriggered } = this.props;

    return (
      <div
        className={
          'mock-trigger ' +
          (barStarter ? 'bar-starter ' : '') +
          (isTriggered ? 'is-triggered' : 'disabled')
        }
        onClick={this.handleClick}
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

export default connect(mapStateToProps)(MockTrigger);
