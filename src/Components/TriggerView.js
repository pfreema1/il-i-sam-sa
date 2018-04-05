import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';

const ButtonContainerStyle = {
  width: '5vw',
  height: '100px',
  borderRadius: '5px'
};

const TriggerView = (
  { bgColor, width, height, isSlicee, handleTriggerClick, id },
  context
) => (
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
    disableTouchRipple={context.mobileViewportContext}
  >
    {' '}
  </RaisedButton>
);

TriggerView.contextTypes = {
  mobileViewportContext: PropTypes.bool
};

export default TriggerView;
