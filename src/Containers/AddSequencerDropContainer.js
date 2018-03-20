import React, { Component } from 'react';
import { connect } from 'react-redux';

const wrapperStyling = {
  width: '130px',
  height: '100px',
  border: '5px dashed RGBA(130, 130, 123, 1.00)',
  borderRadius: '2px',
  marginLeft: '5px',
  boxSizing: 'border-box',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  fontSize: '10px'
};

/*****************************/

class AddSequencerDropContainer extends Component {
  render() {
    return (
      <div style={wrapperStyling}>
        <div>DRAG SAMPLE HERE</div>
        <div>OR</div> <div>SELECT SAMPLE</div>{' '}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(AddSequencerDropContainer);
