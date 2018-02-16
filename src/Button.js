import React, { Component } from 'react';
import styled from 'styled-components';

const ButtonWrapper = styled.div`
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

class Button extends Component {
  constructor(props) {
    super(props);

    console.log('props:  ', props);

    this.state = {
      isSelected: false
    };
  }

  handleButtonClick = id => {
    // console.log('clickd!  ', e.target.id);
    console.log('id  ', id);

    this.setState({
      isSelected: !this.state.isSelected
    });

    this.props.handleTrigger(id);
  };

  render() {
    return (
      <ButtonWrapper
        isSelected={this.state.isSelected}
        onClick={this.handleButtonClick.bind(null, this.props.id)}
        barStarter={this.props.barStarter}
      />
    );
  }
}

Button.propTypes = {};

export default Button;
