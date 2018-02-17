import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Tone from 'tone';

const TriggerWrapper = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${props => {
    return backgroundColorSetter(props.isSelected, props.barStarter);
  }};
  margin: 5px;
  border-radius: 5px;
  display: inline-block;
`;

const backgroundColorSetter = (isSelected, barStarter) => {
  if (isSelected) {
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

    this.state = {
      isSelected: false
    };
  }

  handleTriggerClick = id => {
    // console.log('clickd!  ', e.target.id);
    // console.log('id  ', id);

    this.setState({
      isSelected: !this.state.isSelected
    });

    this.props.dispatch({ type: 'TRIGGER_CLICKED', id });
  };

  render() {
    return (
      <TriggerWrapper
        isSelected={this.state.isSelected}
        onClick={this.handleTriggerClick.bind(null, this.props.id)}
        barStarter={this.props.barStarter}
      />
    );
  }
}

/*****************************/

Trigger.propTypes = {};

const mapStateToProps = state => {
  return {
    foo: state.foo
  };
};

export default connect(mapStateToProps)(Trigger);
