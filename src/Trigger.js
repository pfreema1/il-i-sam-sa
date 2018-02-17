// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Tone from 'tone';
import type { TriggerObject, DispatchObject } from './types';

const TriggerWrapper = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${props => {
    return backgroundColorSetter(props.isTriggered, props.barStarter);
  }};
  margin: 5px;
  border-radius: 5px;
  display: inline-block;
`;

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
      <TriggerWrapper
        isTriggered={triggers[id].isTriggered}
        onClick={this.handleTriggerClick.bind(null, id)}
        barStarter={this.props.barStarter}
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
