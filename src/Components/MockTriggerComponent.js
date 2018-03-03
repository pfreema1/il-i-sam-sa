import React from 'react';

const MockTriggerComponent = ({ handleClick, barStarter, isTriggered }) => (
  <div
    className={
      'mock-trigger ' +
      (barStarter ? 'bar-starter ' : '') +
      (isTriggered ? 'is-triggered' : 'disabled')
    }
    onClick={handleClick}
  />
);

export default MockTriggerComponent;
