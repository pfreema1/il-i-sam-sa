import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import './Nudge.css';
import MockTrigger from './MockTrigger';

class Nudge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nudgeValueArr: [],
      triggersToRender: [],
      isSlicee: null
    };
  }

  componentDidMount() {
    this.setupNudgeUI(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.triggerBeingEditedId !== null) {
      this.setupNudgeUI(nextProps);
    }
  }

  setupNudgeUI = props => {
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

    //create array of nudge values
    const nudgeValueArr = triggersToRender.map((trigger, index) => {
      return trigger.nudgeValue;
    });

    this.setState({
      nudgeValueArr: nudgeValueArr,
      triggersToRender: triggersToRender,
      isSlicee: isSlicee
    });
  };

  // function sig:  function(event: object) => void
  // binded value and triggerId (prepended)
  handleDragStop = (value, triggerId, e) => {};

  // function sig:  function(event: object, newValue: number) => void
  // binded triggerId (its prepended)
  handleSliderChange = (triggerId, e, value) => {
    let newNudgeArr = [...this.state.nudgeValueArr];

    newNudgeArr[triggerId] = value;

    this.setState({
      nudgeValueArr: newNudgeArr
    });
  };

  renderSliders = () => {
    const { triggersToRender, isSlicee, nudgeValueArr } = this.state;

    return (
      <div>
        {triggersToRender.map((trigger, index) => {
          return (
            <div key={index} className="nudge-container">
              <MockTrigger
                barStarter={index % 4 === 0 ? true : false}
                isTriggered={trigger.isTriggered}
                id={index}
                isSlicee={isSlicee}
              />

              <Slider
                className={
                  'nudge-slider ' + (trigger.isTriggered ? '' : 'not-triggered')
                }
                min={-100} //******** THESE NEED TO BE CHANGED! */
                max={100}
                disabled={!trigger.isTriggered}
                onDragStop={
                  isSlicee
                    ? this.handleDragStop.bind(
                        null,
                        this.state.nudgeValueArr[index],
                        index
                      )
                    : this.handleDragStop.bind(
                        null,
                        this.state.nudgeValueArr[index],
                        this.props.triggerBeingEditedId
                      )
                }
                defaultValue={nudgeValueArr[index]}
                onChange={this.handleSliderChange.bind(null, index)}
                step={1}
              />
              <div
                className={
                  'nudge-percentage-container ' +
                  (trigger.isTriggered ? '' : 'not-triggered')
                }
              >
                {nudgeValueArr[index] + '%'}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div>
        <h1>Set Nudge Amount</h1>
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

export default connect(mapStateToProps)(Nudge);
