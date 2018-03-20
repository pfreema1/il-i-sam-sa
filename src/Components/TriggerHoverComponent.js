import React from 'react';
import sliceAdd from '../icons/sliceAdd.svg';
import sliceMinus from '../icons/sliceMinus.svg';
import velocityIcon from '../icons/velocityIcon.svg';
import durationIcon from '../icons/durationIcon.svg';
import nudgeIcon from '../icons/nudgeIcon.svg';
import './TriggerHoverComponent.css';

const ContainerStyling = {
  // height: '70px',
  // width: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'space-between'
  // margin: '35px'
};

const imgStyling = {
  height: '30px',
  margin: '15px'
};

const row = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center'
  // marginTop: '20px',
  // marginBottom: '40px'
};

const TriggerHoverComponent = ({
  handleMenuItemClick,
  handleSliceMenuItemClick,
  handleUnSliceMenuItemClick,
  triggerId
}) => {
  return (
    <div style={ContainerStyling}>
      <div style={row}>
        <div
          onClick={handleMenuItemClick.bind(null, triggerId, 1)}
          className="trigger-hover-icon-wrapper"
        >
          <img alt="velocity-icon" style={imgStyling} src={velocityIcon} />
        </div>
        <div
          onClick={handleMenuItemClick.bind(null, triggerId, 2)}
          className="trigger-hover-icon-wrapper"
        >
          <img alt="duration-icon" style={imgStyling} src={durationIcon} />
        </div>
        <div
          onClick={handleMenuItemClick.bind(null, triggerId, 3)}
          className="trigger-hover-icon-wrapper"
        >
          <img alt="nudge-icon" style={imgStyling} src={nudgeIcon} />
        </div>
      </div>
      <div style={row}>
        <div
          onClick={handleSliceMenuItemClick.bind(null, triggerId)}
          className="trigger-hover-icon-wrapper"
        >
          <img alt="increase-slices" style={imgStyling} src={sliceAdd} />
        </div>
        <div
          onClick={handleUnSliceMenuItemClick.bind(null, triggerId)}
          className="trigger-hover-icon-wrapper"
        >
          <img alt="decrease-slices" style={imgStyling} src={sliceMinus} />
        </div>
      </div>
    </div>
  );
};

export default TriggerHoverComponent;
