import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import './Duration.css';
import MockTrigger from './MockTrigger';

class Duration extends Component {
  constructor(props) {
    super(props);

    let { sequencers, triggerBeingEditedId, sequencerBeingEditedId } = props;

    let currentDurationString =
      sequencers[sequencerBeingEditedId].triggers[triggerBeingEditedId]
        .duration;

    this.state = {
      durationPercentage: this.convertDurationToPercent(currentDurationString)
    };
  }

  convertDurationToPercent = durationStr => {
    let IValueNum = parseInt(durationStr.slice(0, durationStr.length - 1));

    console.log('IValueNum:  ', IValueNum);

    return IValueNum / 192 * 100;
  };

  setNewDuration = (e, value) => {
    console.log('value in setNewDuration:  ', value);
    this.props.dispatch({ type: 'CHANGE_NOTE_DURATION' });
  };

  handleSliderChange = (e, value) => {
    // value = parseInt(value * 100);
    this.setState({ durationPercentage: value });
  };

  renderSliders = () => {
    const {
      sequencers,
      triggerBeingEditedId,
      sequencerBeingEditedId
    } = this.props;

    let isSlicee;
    let triggersToRender = [];

    if (
      !sequencers[sequencerBeingEditedId].triggers[triggerBeingEditedId]
        .isSliced
    ) {
      isSlicee = false;
      triggersToRender.push(
        sequencers[sequencerBeingEditedId].triggers[triggerBeingEditedId]
      );
    } else {
      isSlicee = true;
      triggersToRender =
        sequencers[sequencerBeingEditedId].triggers[triggerBeingEditedId]
          .slicedTriggers;
    }

    return (
      <div>
        {triggersToRender.map((trigger, index) => {
          return (
            <div key={index} className="duration-container">
              <MockTrigger
                barStarter={index % 4 === 0 ? true : false}
                isTriggered={trigger.isTriggered}
                id={index}
                isSlicee={isSlicee}
              />

              <Slider
                className="duration-slider"
                min={0}
                max={100}
                disabled={!trigger.isTriggered}
                onDragStop={this.setNewDuration.bind(null)}
                //   defaultValue={this.state.durationPercentage}
                //   onChange={this.handleSliderChange}
                step={1}
              />
              <div>Percentage text here</div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    let { triggerBeingEditedId } = this.props;

    return (
      <div>
        <h1>Set Trigger Duration</h1>
        {triggerBeingEditedId && this.renderSliders()}
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

export default connect(mapStateToProps)(Duration);
