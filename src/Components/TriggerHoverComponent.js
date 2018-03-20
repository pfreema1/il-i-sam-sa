import React from 'react';
import sliceAdd from '../icons/sliceAdd.svg';
import sliceMinus from '../icons/sliceMinus.svg';
import velocityIcon from '../icons/velocityIcon.svg';
import durationIcon from '../icons/durationIcon.svg';
import nudgeIcon from '../icons/nudgeIcon.svg';

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
        <div>
          <img
            onClick={handleMenuItemClick.bind(null, triggerId, 1)}
            alt="velocity-icon"
            style={imgStyling}
            src={velocityIcon}
          />
        </div>
        <div>
          <img
            onClick={handleMenuItemClick.bind(null, triggerId, 2)}
            alt="duration-icon"
            style={imgStyling}
            src={durationIcon}
          />
        </div>
        <div>
          <img
            onClick={handleMenuItemClick.bind(null, triggerId, 3)}
            alt="nudge-icon"
            style={imgStyling}
            src={nudgeIcon}
          />
        </div>
      </div>
      <div style={row}>
        <div>
          <img
            onClick={handleSliceMenuItemClick.bind(null, triggerId)}
            alt="increase-slices"
            style={imgStyling}
            src={sliceAdd}
          />
        </div>
        <div>
          <img
            onClick={handleUnSliceMenuItemClick.bind(null, triggerId)}
            alt="decrease-slices"
            style={imgStyling}
            src={sliceMinus}
          />
        </div>
      </div>
    </div>
  );
};

export default TriggerHoverComponent;
