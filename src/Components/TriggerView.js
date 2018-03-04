import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const ButtonContainerStyle = {
  width: '5vw',
  height: '100px',
  borderRadius: '5px'
};

const TriggerView = ({
  bgColor,
  isTriggered,
  barStarter,
  width,
  height,
  isSlicee,
  handleTriggerClick,
  id
}) => (
  <RaisedButton
    backgroundColor={bgColor}
    label=""
    style={{
      ...ButtonContainerStyle,
      width: width,
      height: height,
      minWidth: '',
      backgroundColor: 'yellow'
    }}
    className={'trigger-button ' + (isSlicee ? 'slicee' : '')}
    onClick={handleTriggerClick.bind(null, id)}
  >
    {' '}
  </RaisedButton>
);

export default TriggerView;
