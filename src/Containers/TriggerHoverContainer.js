import React, { Component } from 'react';
import { connect } from 'react-redux';
import sliceAdd from '../icons/sliceAdd.svg';
import sliceMinus from '../icons/sliceMinus.svg';
import velocityIcon from '../icons/velocityIcon.svg';
import durationIcon from '../icons/durationIcon.svg';
import nudgeIcon from '../icons/nudgeIcon.svg';
import { Tooltip } from 'react-tippy';

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

class TriggerHoverContainer extends Component {
  render() {
    return (
      <div style={ContainerStyling}>
        <div style={row}>
          <div>
            <Tooltip title="VELOCITY" trigger="mouseenter" interactive="true">
              <img alt="velocity-icon" style={imgStyling} src={velocityIcon} />
            </Tooltip>
          </div>
          <div>
            <img alt="duration-icon" style={imgStyling} src={durationIcon} />
          </div>
          <div>
            <img alt="nudge-icon" style={imgStyling} src={nudgeIcon} />
          </div>
        </div>
        <div style={row}>
          <div>
            <img alt="increase-slices" style={imgStyling} src={sliceAdd} />
          </div>
          <div>
            <img alt="decrease-slices" style={imgStyling} src={sliceMinus} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(TriggerHoverContainer);
