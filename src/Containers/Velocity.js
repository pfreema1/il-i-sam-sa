import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Velocity.css';
import VelocityTrigger from '../Components/VelocityTrigger';

class Velocity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      velocityValAsPercentArr: [],
      triggersToRender: [],
      isSlicee: null
    };
  }

  componentDidMount() {
    this.setupVelocityUI(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.triggerBeingEditedId !== null) {
      this.setupVelocityUI(nextProps);
    }
  }

  setupVelocityUI = props => {
    const { sequencers, triggerBeingEditedId, sequencerBeingEditedId } = props;
    const parentTrigger =
      sequencers[sequencerBeingEditedId].triggers[triggerBeingEditedId];

    let isSlicee;
    let triggersToRender = [];

    if (!parentTrigger.isSliced) {
      isSlicee = false;
      triggersToRender = triggersToRender.concat(parentTrigger);
    } else {
      isSlicee = true;
      triggersToRender = triggersToRender.concat(parentTrigger.slicedTriggers);
    }

    //create array of velocity values
    const velocityValAsPercentArr = triggersToRender.map((trigger, index) => {
      return this.convertVelocityToPercentNum(trigger.velocity);
    });

    this.setState({
      velocityValAsPercentArr: velocityValAsPercentArr,
      triggersToRender: triggersToRender,
      isSlicee: isSlicee
    });
  };

  convertVelocityToPercentNum = velocityNum => {
    return Math.round(velocityNum * 100);
  };

  handleDragStop = (value, triggerId, e) => {
    value = value * 0.01; //convert back to 0 - 1 scale

    this.props.dispatch({
      type: 'CHANGE_NOTE_VELOCITY',
      triggerId: triggerId,
      newVelocity: value,
      isSlicee: this.state.isSlicee,
      parentTriggerId: this.props.triggerBeingEditedId
    });
  };

  handleSliderChange = (triggerId, e, value) => {
    let newVelocityArr = [...this.state.velocityValAsPercentArr];

    newVelocityArr[triggerId] = value;

    this.setState({
      velocityValAsPercentArr: newVelocityArr
    });
  };

  renderSliders = () => {
    const { triggersToRender, isSlicee, velocityValAsPercentArr } = this.state;

    return (
      <div>
        {triggersToRender.map((trigger, index) => {
          return (
            <VelocityTrigger
              key={index}
              index={index}
              isTriggered={trigger.isTriggered}
              isSlicee={isSlicee}
              handleDragStop={this.handleDragStop}
              velocityValAsPercentArr={velocityValAsPercentArr}
              triggerBeingEditedId={this.props.triggerBeingEditedId}
              handleSliderChange={this.handleSliderChange}
            />
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div>
        <h1>Set Trigger Velocity</h1>
        {this.renderSliders()}
      </div>
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

export default connect(mapStateToProps)(Velocity);
