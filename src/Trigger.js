// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { TriggerObject, DispatchObject } from './types';
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

type Props = {
  triggers: TriggerObject[],
  dispatch: (obj: DispatchObject) => void,
  barStarter: boolean,
  id: number
};

type State = {
  isTriggered: boolean
};

class Trigger extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isTriggered: props.triggers[props.id].isTriggered
    };
  }

  handleTriggerClick = id => {
    this.props.dispatch({ type: 'TRIGGER_CLICKED', id });
  };

  render() {
    const { id, triggers } = this.props;
    return (
      <RaisedButton
        backgroundColor={backgroundColorSetter(
          triggers[id].isTriggered,
          this.props.barStarter
        )}
        label=""
        style={ButtonStyle}
        // buttonStyle={ButtonStyle}
        // isTriggered={triggers[id].isTriggered}
        onClick={this.handleTriggerClick.bind(null, id)}
        // barStarter={this.props.barStarter}
      />
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    triggers: state.triggers
  };
};

export default connect(mapStateToProps)(Trigger);
