import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import './Duration.css';
import MockTrigger from './MockTrigger';

class Duration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      durationValAsPercentArr: [],
      triggersToRender: [],
      isSlicee: null
    };
  }

  componentDidMount() {
    this.setupDurationUI(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // bugfix!  make sure to check =/!= to null instead of just checking falsy (id of 0 will make bugs!)
    if (nextProps.triggerBeingEditedId !== null) {
      this.setupDurationUI(nextProps);
    }
  }

  setupDurationUI = props => {
    const { sequencers, triggerBeingEditedId, sequencerBeingEditedId } = props;

    let isSlicee;
    let triggersToRender = [];

    if (
      !sequencers[sequencerBeingEditedId].triggers[triggerBeingEditedId]
        .isSliced
    ) {
      isSlicee = false;

      triggersToRender = triggersToRender.concat(
        sequencers[sequencerBeingEditedId].triggers[triggerBeingEditedId]
      );
    } else {
      isSlicee = true;
      triggersToRender = triggersToRender.concat(
        sequencers[sequencerBeingEditedId].triggers[triggerBeingEditedId]
          .slicedTriggers
      );
    }

    //create array of duration values
    const durationValAsPercentArr = triggersToRender.map((trigger, index) => {
      return this.convertDurationStrToPercentNum(trigger.duration);
    });

    this.setState({
      durationValAsPercentArr: durationValAsPercentArr,
      triggersToRender: triggersToRender,
      isSlicee: isSlicee
    });
  };

  convertDurationStrToPercentNum = durationStr => {
    let IValueNum = parseInt(durationStr.slice(0, durationStr.length - 1), 10);

    // console.log('hi there:  ', IValueNum / 192 * 100);

    return Math.round(IValueNum / 192 * 100);
  };

  // function sig:  function(event: object) => void
  // binded value and triggerId (prepended)
  handleDragStop = (value, triggerId, e) => {
    // convert value to duration string
    let newDurationStr = Math.round(value * 0.01 * 192) + 'i';

    console.log('****values being passed into reducer');
    console.log('triggerId:  ', triggerId);
    console.log('newDurationStr:  ', newDurationStr);
    console.log('isSlicee:  ', this.state.isSlicee);
    console.log('parentTriggerId:  ', this.props.triggerBeingEditedId);

    this.props.dispatch({
      type: 'CHANGE_NOTE_DURATION',
      triggerId: triggerId,
      newDurationStr: newDurationStr,
      isSlicee: this.state.isSlicee,
      parentTriggerId: this.props.triggerBeingEditedId
    });
  };

  // function sig:  function(event: object, newValue: number) => void
  // binded triggerId (its prepended)
  handleSliderChange = (triggerId, e, value) => {
    // console.log('handleSliderChange: triggerId:  ', triggerId);
    // console.log('handleSliderChange: e:  ', e);
    // console.log('value:  ', value);

    let newDurationArr = [...this.state.durationValAsPercentArr];

    newDurationArr[triggerId] = value;

    this.setState({
      durationValAsPercentArr: newDurationArr
    });
  };

  renderSliders = () => {
    const { triggersToRender, isSlicee, durationValAsPercentArr } = this.state;

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
                className={
                  'duration-slider ' +
                  (trigger.isTriggered ? '' : 'not-triggered')
                }
                min={0}
                max={100}
                disabled={!trigger.isTriggered}
                onDragStop={
                  isSlicee
                    ? this.handleDragStop.bind(
                        null,
                        this.state.durationValAsPercentArr[index],
                        index
                      )
                    : this.handleDragStop.bind(
                        null,
                        this.state.durationValAsPercentArr[index],
                        this.props.triggerBeingEditedId
                      )
                }
                defaultValue={durationValAsPercentArr[index]}
                onChange={this.handleSliderChange.bind(null, index)}
                step={1}
              />
              <div
                className={
                  'duration-percentage-container ' +
                  (trigger.isTriggered ? '' : 'not-triggered')
                }
              >
                {durationValAsPercentArr[index] + '%'}
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
        <h1>Set Trigger Duration</h1>
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

export default connect(mapStateToProps)(Duration);
